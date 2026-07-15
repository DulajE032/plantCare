import torch, json
from torchvision import datasets, transforms, models
from torch import nn
from sklearn.metrics import classification_report

val_tf = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485,0.456,0.406], [0.229,0.224,0.225]),
])
val_ds = datasets.ImageFolder("datasset/valid", transform=val_tf)
class_names = json.load(open("class_names.json"))

model = models.mobilenet_v3_large(weights=None)
model.classifier[3] = nn.Linear(model.classifier[3].in_features, len(class_names))
model.load_state_dict(torch.load("models/best_model.pth", map_location="cpu"))
model.eval()

y_true, y_pred = [], []
with torch.no_grad():
    for image, label in val_ds:
        pred = model(image.unsqueeze(0)).argmax(dim=1).item()
        y_true.append(label)
        y_pred.append(pred)

print(classification_report(y_true, y_pred, target_names=class_names))