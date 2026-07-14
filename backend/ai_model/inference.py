import joblib
import numpy as np
from utils import extract_features

class DiseaseClassifier:
    def __init__(self, model_path: str = "models/disease_rf_model.pkl", encoder_path: str = "models/label_encoder.pkl"):
        # Load the trained ML model and the label encoder
        self.model = joblib.load(model_path)
        self.encoder = joblib.load(encoder_path)

    def predict(self, image_bytes: bytes):
        # 1. Extract features using the exact same logic as training
        features = extract_features(image_bytes, is_bytes=True)
        
        if features is None:
            raise ValueError("Could not read image bytes.")
            
        # Reshape to a 2D array [1, num_features] because scikit-learn expects 2D
        features_2d = features.reshape(1, -1)
        
        # 2. Predict the probabilities for all classes
        probabilities = self.model.predict_proba(features_2d)[0]
        
        # 3. Get the highest probability and its corresponding class index
        max_prob_index = np.argmax(probabilities)
        confidence = probabilities[max_prob_index]
        
        # 4. Convert the integer index back to a text label (e.g., "Tomato___Late_blight")
        predicted_class = self.encoder.inverse_transform([max_prob_index])[0]
        
        # Return the label and the confidence as a percentage
        return predicted_class, round(confidence * 100, 2)