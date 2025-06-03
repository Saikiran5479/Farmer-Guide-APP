import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib
import json
import sys

class CropStagePredictor:
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.stages = ['Germination', 'Vegetative', 'Flowering', 'Fruiting', 'Maturity']
        
    def preprocess_features(self, features):
        # Convert input features to numpy array
        # Features should include: temperature, humidity, soil_moisture, days_planted, etc.
        return np.array([[
            features['temperature'],
            features['humidity'],
            features['soil_moisture'],
            features['days_planted'],
            features['light_intensity']
        ]])
    
    def predict_stage(self, features):
        # Preprocess features
        X = self.preprocess_features(features)
        
        # Make prediction
        prediction = self.model.predict(X)[0]
        probability = self.model.predict_proba(X)[0]
        
        return {
            'stage': self.stages[prediction],
            'confidence': float(max(probability)),
            'all_probabilities': {
                stage: float(prob) for stage, prob in zip(self.stages, probability)
            }
        }

def main():
    # Read input features from command line
    features = json.loads(sys.argv[1])
    
    # Initialize predictor
    predictor = CropStagePredictor()
    
    # Make prediction
    result = predictor.predict_stage(features)
    
    # Output result as JSON
    print(json.dumps(result))

if __name__ == "__main__":
    main() 