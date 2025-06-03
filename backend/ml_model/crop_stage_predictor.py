import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
import joblib
import os
import json
import argparse
import sys

class CropStagePredictor:
    def __init__(self):
        self.model = None
        self.label_encoder = LabelEncoder()
        self.crop_encoder = LabelEncoder()
        self.features = None
        self.target = None
        
    def load_data(self, file_path):
        """Load and preprocess the dataset"""
        try:
            # Get the absolute path to the dataset
            current_dir = os.path.dirname(os.path.abspath(__file__))
            dataset_path = os.path.join(current_dir, 'farmer_guide_crop_dataset.xlsx')
            print(f"Loading dataset from: {dataset_path}", file=sys.stderr)
            
            df = pd.read_excel(dataset_path)
            # Use only 'crop' and 'days_since_planting' as features
            self.features = df[['crop', 'days_since_planting']].copy()
            self.target = df['stage']

            # Encode 'crop' as categorical
            self.features['crop'] = self.features['crop'].astype(str)
            self.crop_encoder.fit(self.features['crop'])
            self.features['crop'] = self.crop_encoder.transform(self.features['crop'])

            # Encode the target variable
            self.target = self.label_encoder.fit_transform(self.target)
            return True
        except Exception as e:
            print(f"Error loading data: {str(e)}", file=sys.stderr)
            return False
    
    def train_model(self):
        """Train the Random Forest model"""
        if self.features is None or self.target is None:
            return False
        
        # Split the data
        X_train, X_test, y_train, y_test = train_test_split(
            self.features, self.target, test_size=0.2, random_state=42
        )
        
        # Initialize and train the model
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.model.fit(X_train, y_train)
        
        # Calculate and print accuracy
        accuracy = self.model.score(X_test, y_test)
        print(f"Model accuracy: {accuracy:.2f}", file=sys.stderr)
        return True
    
    def predict_stage(self, features):
        """Predict crop stage for new data"""
        if self.model is None:
            print("Model is not loaded", file=sys.stderr)
            return None
        
        try:
            # Convert crop name to lowercase and trim
            crop_name = features['crop'].lower().strip()
            days = int(features['days_since_planting'])
            
            # Transform crop name using the saved encoder
            try:
                crop_encoded = self.crop_encoder.transform([crop_name])[0]
            except ValueError:
                print(f"Unknown crop: {crop_name}", file=sys.stderr)
                return None
            
            # Create feature array
            feature_array = np.array([[crop_encoded, days]])
            print(f"Feature array: {feature_array}", file=sys.stderr)
            
            # Make prediction
            prediction = self.model.predict(feature_array)
            # Get prediction probabilities
            probabilities = self.model.predict_proba(feature_array)[0]
            
            # Convert prediction back to original label
            stage = self.label_encoder.inverse_transform(prediction)[0]
            
            # Create probability dictionary
            all_probabilities = {}
            for i, label in enumerate(self.label_encoder.classes_):
                all_probabilities[label] = float(probabilities[i])
            
            result = {
                "stage": stage,
                "confidence": float(probabilities[prediction[0]]),
                "all_probabilities": all_probabilities
            }
            
            print(f"Prediction result: {json.dumps(result)}", file=sys.stderr)
            return result
            
        except Exception as e:
            print(f"Error during prediction: {str(e)}", file=sys.stderr)
            return None
    
    def save_model(self, model_path):
        """Save the trained model"""
        if self.model is None:
            return False
        
        try:
            # Get the absolute path for saving the model
            current_dir = os.path.dirname(os.path.abspath(__file__))
            model_file_path = os.path.join(current_dir, 'crop_stage_model.joblib')
            print(f"Saving model to: {model_file_path}", file=sys.stderr)
            
            joblib.dump({
                'model': self.model,
                'label_encoder': self.label_encoder,
                'crop_encoder': self.crop_encoder,
                'features': self.features.columns.tolist()
            }, model_file_path)
            return True
        except Exception as e:
            print(f"Error saving model: {str(e)}", file=sys.stderr)
            return False
    
    def load_model(self, model_path):
        """Load a saved model"""
        try:
            # Get the absolute path for loading the model
            current_dir = os.path.dirname(os.path.abspath(__file__))
            model_file_path = os.path.join(current_dir, 'crop_stage_model.joblib')
            print(f"Loading model from: {model_file_path}", file=sys.stderr)
            
            saved_data = joblib.load(model_file_path)
            self.model = saved_data['model']
            self.label_encoder = saved_data['label_encoder']
            
            # Handle the case where crop_encoder might not exist in older models
            if 'crop_encoder' in saved_data:
                self.crop_encoder = saved_data['crop_encoder']
            else:
                # If crop_encoder doesn't exist, we need to retrain the model
                print("Crop encoder not found in saved model. Please retrain the model.", file=sys.stderr)
                return False
                
            self.features = saved_data['features']
            return True
        except Exception as e:
            print(f"Error loading model: {str(e)}", file=sys.stderr)
            return False

def main():
    parser = argparse.ArgumentParser(description='Crop Stage Predictor')
    parser.add_argument('--train', action='store_true', help='Train the model')
    parser.add_argument('--predict', type=str, help='Make a prediction with the given features')
    args = parser.parse_args()

    predictor = CropStagePredictor()
    model_path = "crop_stage_model.joblib"

    if args.train:
        # Train the model
        if predictor.load_data("farmer_guide_crop_dataset.xlsx"):
            if predictor.train_model():
                predictor.save_model(model_path)
                print(json.dumps({"status": "success", "message": "Model trained successfully"}))
            else:
                print(json.dumps({"status": "error", "message": "Failed to train model"}))
        else:
            print(json.dumps({"status": "error", "message": "Failed to load data"}))
    
    elif args.predict:
        # Make a prediction
        try:
            features = json.loads(args.predict)
            print(f"Received features: {features}", file=sys.stderr)
            
            if predictor.load_model(model_path):
                prediction = predictor.predict_stage(features)
                if prediction:
                    print(json.dumps({
                        "success": True,
                        "prediction": prediction
                    }))
                else:
                    print(json.dumps({
                        "success": False,
                        "error": "Failed to make prediction"
                    }))
            else:
                print(json.dumps({
                    "success": False,
                    "error": "Failed to load model"
                }))
        except Exception as e:
            print(json.dumps({
                "success": False,
                "error": str(e)
            }))
    
    else:
        print(json.dumps({
            "success": False,
            "error": "No action specified"
        }))

if __name__ == "__main__":
    main() 