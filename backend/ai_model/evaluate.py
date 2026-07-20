"""
Evaluate the trained model against the validation set.

Handles the case where the validation folder may have fewer classes
than class_names.json (e.g., 26 folders vs 38 trained classes).
We remap ImageFolder indices → training indices so predictions match.

Usage:
    cd ai_model
    python evaluate.py
"""
import torch, json, sys
from torchvision import datasets, transforms, models
from torch import nn
from sklearn.metrics import classification_report, confusion_matrix
import numpy as np

val_tf = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
])

# Load validation dataset and the authoritative class list from training
val_ds = datasets.ImageFolder("datasset/valid", transform=val_tf)
class_names = json.load(open("class_names.json"))

# Build mapping: class_name → training index (0..37)
train_class_to_idx = {name: idx for idx, name in enumerate(class_names)}

# Build mapping: ImageFolder index (0..25) → training index (0..37)
# ImageFolder assigns its own indices based on sorted folder names.
# We need to convert those to the training indices.
folder_idx_to_train_idx = {}
for folder_name, folder_idx in val_ds.class_to_idx.items():
    if folder_name in train_class_to_idx:
        folder_idx_to_train_idx[folder_idx] = train_class_to_idx[folder_name]
    else:
        print(f"WARNING: Folder '{folder_name}' not found in class_names.json — skipping")

print(f"Model classes (class_names.json): {len(class_names)}")
print(f"Validation folders found: {len(val_ds.classes)}")

missing = set(class_names) - set(val_ds.classes)
if missing:
    print(f"Classes missing from validation set ({len(missing)}): {sorted(missing)}")
print()

# Load model
model = models.mobilenet_v3_large(weights=None)
model.classifier[3] = nn.Linear(model.classifier[3].in_features, len(class_names))
model.load_state_dict(torch.load("models/best_model.pth", map_location="cpu"))
model.eval()

# Run predictions
y_true, y_pred = [], []
total = len(val_ds)
with torch.no_grad():
    for i, (image, folder_label) in enumerate(val_ds):
        # Remap folder label → training label
        train_label = folder_idx_to_train_idx.get(folder_label)
        if train_label is None:
            continue  # skip unknown folders

        pred = model(image.unsqueeze(0)).argmax(dim=1).item()
        y_true.append(train_label)
        y_pred.append(pred)

        if (i + 1) % 500 == 0 or (i + 1) == total:
            print(f"  Evaluated {i + 1}/{total} images...", flush=True)

print(f"\nTotal images evaluated: {len(y_true)}")
correct = sum(1 for t, p in zip(y_true, y_pred) if t == p)
print(f"Overall Accuracy: {correct}/{len(y_true)} = {correct / len(y_true) * 100:.2f}%\n")

# Classification report — only include classes that appear in y_true or y_pred
present_labels = sorted(set(y_true) | set(y_pred))
present_names = [class_names[i] for i in present_labels]

print(classification_report(
    y_true,
    y_pred,
    labels=present_labels,
    target_names=present_names,
    zero_division=0
))