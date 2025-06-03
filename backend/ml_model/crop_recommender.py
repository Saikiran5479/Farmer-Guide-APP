import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib
import matplotlib.pyplot as plt
import seaborn as sns

class CropRecommender:
    def __init__(self):
        self.model = RandomForestClassifier(
            n_estimators=100,
            random_state=42,
            n_jobs=-1,
            class_weight='balanced'
        )
        self.scaler = StandardScaler()
        self.feature_names = None
        
    def prepare_data(self, data_path):
        """
        Prepare and preprocess the data from Excel file
        """
        try:
            # Read Excel file
            df = pd.read_excel(data_path)
            
            # Store feature names
            self.feature_names = [col for col in df.columns if col != 'label']
            
            # Separate features and target
            X = df[self.feature_names]
            y = df['label']
            
            # Scale the features
            X_scaled = self.scaler.fit_transform(X)
            
            return train_test_split(X_scaled, y, test_size=0.2, random_state=42)
        except Exception as e:
            print(f"Error preparing data: {str(e)}")
            return None, None, None, None

    def train(self, X_train, y_train):
        """Train the model"""
        try:
            self.model.fit(X_train, y_train)
            return True
        except Exception as e:
            print(f"Error training model: {str(e)}")
            return False

    def predict(self, features):
        """Make predictions for new data"""
        try:
            # Scale the input features
            scaled_features = self.scaler.transform(features)
            return self.model.predict(scaled_features)
        except Exception as e:
            print(f"Error making predictions: {str(e)}")
            return None

    def predict_proba(self, features):
        """Get probability estimates for each class"""
        try:
            scaled_features = self.scaler.transform(features)
            return self.model.predict_proba(scaled_features)
        except Exception as e:
            print(f"Error getting probability estimates: {str(e)}")
            return None

    def evaluate(self, X_test, y_test):
        """Evaluate model performance"""
        try:
            y_pred = self.predict(X_test)
            accuracy = accuracy_score(y_test, y_pred)
            report = classification_report(y_test, y_pred)
            
            # Create confusion matrix
            cm = confusion_matrix(y_test, y_pred)
            plt.figure(figsize=(10, 8))
            sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
            plt.title('Confusion Matrix')
            plt.ylabel('True Label')
            plt.xlabel('Predicted Label')
            plt.savefig('confusion_matrix.png')
            plt.close()
            
            return accuracy, report
        except Exception as e:
            print(f"Error evaluating model: {str(e)}")
            return None, None

    def feature_importance(self):
        """Get and plot feature importance"""
        try:
            importance = self.model.feature_importances_
            indices = np.argsort(importance)[::-1]
            
            plt.figure(figsize=(10, 6))
            plt.title('Feature Importance')
            plt.bar(range(len(importance)), importance[indices])
            plt.xticks(range(len(importance)), [self.feature_names[i] for i in indices], rotation=45)
            plt.tight_layout()
            plt.savefig('feature_importance.png')
            plt.close()
            
            return dict(zip(self.feature_names, importance))
        except Exception as e:
            print(f"Error getting feature importance: {str(e)}")
            return None

    def save_model(self, model_path='crop_model.joblib'):
        """Save the trained model"""
        try:
            joblib.dump({
                'model': self.model,
                'scaler': self.scaler,
                'feature_names': self.feature_names
            }, model_path)
            return True
        except Exception as e:
            print(f"Error saving model: {str(e)}")
            return False

    def load_model(self, model_path='crop_model.joblib'):
        """Load a trained model"""
        try:
            saved_model = joblib.load(model_path)
            self.model = saved_model['model']
            self.scaler = saved_model['scaler']
            self.feature_names = saved_model['feature_names']
            return True
        except Exception as e:
            print(f"Error loading model: {str(e)}")
            return False

if __name__ == "__main__":
    # Example usage
    recommender = CropRecommender()
    
    # You would need to provide your dataset path here
    # X_train, X_test, y_train, y_test = recommender.prepare_data('farmer_guide_crop_dataset.xlsx')
    
    # Train the model
    # recommender.train(X_train, y_train)
    
    # Evaluate the model
    # accuracy, report = recommender.evaluate(X_test, y_test)
    # print(f"Model Accuracy: {accuracy}")
    # print("\nClassification Report:")
    # print(report)
    
    # Get feature importance
    # importance = recommender.feature_importance()
    # print("\nFeature Importance:")
    # for feature, imp in sorted(importance.items(), key=lambda x: x[1], reverse=True):
    #     print(f"{feature}: {imp:.4f}")
    
    # Save the model
    # recommender.save_model() 