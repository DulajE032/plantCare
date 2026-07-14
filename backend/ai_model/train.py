import os
import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

from download_data import get_dataset_path
from utils import extract_features

def train_model():
    dataset_path = get_dataset_path()
    
    X = [] # This will hold our feature vectors
    y = [] # This will hold our text labels (e.g., "Tomato___Late_blight")
    
    print("⏳ Extracting features from images... (This may take a while for 3GB!)")
    
    # Loop through every class folder
    for class_name in os.listdir(dataset_path):
        class_dir = os.path.join(dataset_path, class_name)
        
        if not os.path.isdir(class_dir):
            continue
            
        print(f"Processing class: {class_name}...")
        
        # Loop through images in the class folder
        # For testing speed, you can slice the list: os.listdir(class_dir)[:100]
        for img_name in os.listdir(class_dir):
            img_path = os.path.join(class_dir, img_name)
            
            features = extract_features(img_path)
            if features is not None:
                X.append(features)
                y.append(class_name)

    X = np.array(X)
    
    # Convert text labels to integers
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)
    
    print("🔀 Splitting data for validation...")
    X_train, X_val, y_train, y_val = train_test_split(X, y_encoded, test_size=0.2, random_state=42)
    
    print("🧠 Training Random Forest Classifier...")
    model = RandomForestClassifier(n_estimators=100, n_jobs=-1, random_state=42)
    model.fit(X_train, y_train)
    
    print("📊 Evaluating model...")
    y_pred = model.predict(X_val)
    accuracy = accuracy_score(y_val, y_pred)
    print(f"✅ Validation Accuracy: {accuracy * 100:.2f}%")
    
    # Save the trained model and label encoder to the models/ folder
    os.makedirs("models", exist_ok=True)
    joblib.dump(model, "models/disease_rf_model.pkl")
    joblib.dump(label_encoder, "models/label_encoder.pkl")
    print("💾 Model and Encoder saved successfully in models/ directory!")

if __name__ == "__main__":
    train_model()