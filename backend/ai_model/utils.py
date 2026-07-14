import cv2
import numpy as np

def extract_features(image_path_or_bytes, is_bytes=False):
    """
    Reads an image, converts it to HSV, and extracts a color histogram.
    Returns a flat 1D numpy array of numbers.
    """
    if is_bytes:
        # Decode image from bytes (used later in the FastAPI backend)
        nparr = np.frombuffer(image_path_or_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    else:
        # Read from file path (used during training)
        img = cv2.imread(image_path_or_bytes)

    if img is None:
        return None

    # 1. Resize to standardize processing speed (e.g., 224x224)
    img = cv2.resize(img, (224, 224))

    # 2. Convert BGR (OpenCV default) to HSV (Hue, Saturation, Value)
    hsv_img = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

    # 3. Calculate Histogram across Hue and Saturation channels
    # 32 bins for Hue, 32 bins for Saturation
    hist = cv2.calcHist([hsv_img], [0, 1], None, [32, 32], [0, 180, 0, 256])

    # 4. Normalize the histogram (so lighting changes don't ruin the prediction)
    cv2.normalize(hist, hist)

    # 5. Flatten the 2D matrix into a 1D vector (array of numbers)
    return hist.flatten()