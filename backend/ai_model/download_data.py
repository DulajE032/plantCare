import kagglehub
import os

def get_dataset_path():
    print("Checking for dataset (downloading if necessary)...")
    # This downloads the ~3GB dataset and returns the local cache path
    base_path = kagglehub.dataset_download("vipoooool/new-plant-diseases-dataset")
    
    # The dataset usually contains a 'New Plant Diseases Dataset(Augmented)' folder
    # We want to locate the 'train' directory inside it.
    train_path = os.path.join(base_path, "New Plant Diseases Dataset(Augmented)", "New Plant Diseases Dataset(Augmented)", "train")
    
    # Fallback just in case the folder structure is slightly different
    if not os.path.exists(train_path):
        train_path = os.path.join(base_path, "train")
        
    print(f"✅ Training data located at: {train_path}")
    return train_path

if __name__ == "__main__":
    get_dataset_path()