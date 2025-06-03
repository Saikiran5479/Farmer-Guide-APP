from crop_recommender import CropRecommender
import numpy as np
import pandas as pd
from sklearn.metrics import accuracy_score, classification_report
import matplotlib.pyplot as plt
import seaborn as sns

def main():
    # Initialize the recommender
    recommender = CropRecommender()
    
    # Prepare the data
    print("Loading and preparing data...")
    X_train, X_test, y_train, y_test = recommender.prepare_data('farmer_guide_crop_dataset.xlsx')
    
    if X_train is None:
        print("Failed to prepare data")
        return
    
    # Train the model
    print("\nTraining the model...")
    if recommender.train(X_train, y_train):
        print("Model trained successfully!")
        
        # Evaluate the model
        print("\nEvaluating model performance...")
        accuracy, report = recommender.evaluate(X_test, y_test)
        print(f"\nModel Accuracy: {accuracy:.2f}")
        print("\nClassification Report:")
        print(report)
        
        # Get feature importance
        print("\nAnalyzing feature importance...")
        importance = recommender.feature_importance()
        if importance:
            print("\nFeature Importance:")
            for feature, imp in sorted(importance.items(), key=lambda x: x[1], reverse=True):
                print(f"{feature}: {imp:.4f}")
        
        # Save the model
        print("\nSaving the model...")
        if recommender.save_model():
            print("Model saved successfully!")
        
        # Example predictions
        print("\nMaking example predictions...")
        # Get a few random samples from the test set
        sample_indices = np.random.choice(len(X_test), min(5, len(X_test)), replace=False)
        sample_features = X_test[sample_indices]
        sample_labels = y_test.iloc[sample_indices]
        
        predictions = recommender.predict(sample_features)
        probabilities = recommender.predict_proba(sample_features)
        
        print("\nExample Predictions:")
        for i, (true_label, pred_label, probs) in enumerate(zip(sample_labels, predictions, probabilities)):
            print(f"\nSample {i+1}:")
            print(f"True Label: {true_label}")
            print(f"Predicted Label: {pred_label}")
            print("Class Probabilities:")
            for label, prob in zip(recommender.model.classes_, probs):
                print(f"  {label}: {prob:.4f}")
    
    else:
        print("Failed to train the model")

if __name__ == "__main__":
    main() 