import sys
import json
import numpy as np
from crop_recommender import CropRecommender

def predict(features):
    try:
        # Initialize the recommender
        recommender = CropRecommender()
        
        # Load the trained model
        if not recommender.load_model():
            return json.dumps({
                'error': 'Failed to load the model'
            })
        
        # Convert features to numpy array
        features_array = np.array([features])
        
        # Make prediction
        prediction = recommender.predict(features_array)
        probabilities = recommender.predict_proba(features_array)
        
        # Get class probabilities
        class_probs = {}
        for label, prob in zip(recommender.model.classes_, probabilities[0]):
            class_probs[label] = float(prob)
        
        return json.dumps({
            'prediction': prediction[0],
            'probabilities': class_probs
        })
        
    except Exception as e:
        return json.dumps({
            'error': str(e)
        })

if __name__ == "__main__":
    # Get features from command line argument
    if len(sys.argv) > 1:
        features = json.loads(sys.argv[1])
        result = predict(features)
        print(result)
    else:
        print(json.dumps({
            'error': 'No features provided'
        })) 