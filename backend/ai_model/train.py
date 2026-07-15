import torch, json
from torch import nn, optim
from torchvision import datasets, transforms, models
from torch.utils.data import DataLoader

train_tf = transforms.Compose([
    transforms.RandomResizedCrop(224),
    transforms.RandomHorizontalFlip(),
    transforms.ColorJitter(0.2, 0.2, 0.2),
    transforms.ToTensor(),
    transforms.Normalize([0.485,0.456,0.406], [0.229,0.224,0.225]),
])
val_tf = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485,0.456,0.406], [0.229,0.224,0.225]),
])

train_ds = datasets.ImageFolder("datasset/train", transform=train_tf)
val_ds   = datasets.ImageFolder("datasset/valid", transform=val_tf)
json.dump(train_ds.classes, open("class_names.json", "w"))

train_loader = DataLoader(train_ds, batch_size=32, shuffle=True, num_workers=2)
val_loader   = DataLoader(val_ds, batch_size=32)

model = models.mobilenet_v3_large(weights="IMAGENET1K_V1")
in_features = model.classifier[3].in_features
model.classifier[3] = nn.Linear(in_features, len(train_ds.classes))

optimizer = optim.Adam(model.parameters(), lr=1e-4)
criterion = nn.CrossEntropyLoss()

best_acc = 0.0
EPOCHS = 15

for epoch in range(EPOCHS):
    model.train()
    running_loss = 0.0
    for images, labels in train_loader:
        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        running_loss += loss.item()

    model.eval()
    correct, total = 0, 0
    with torch.no_grad():
        for images, labels in val_loader:
            preds = model(images).argmax(dim=1)
            correct += (preds == labels).sum().item()
            total += labels.size(0)
    val_acc = correct / total
    print(f"Epoch {epoch+1}/{EPOCHS} — loss: {running_loss/len(train_loader):.4f} — val acc: {val_acc:.3f}")

    if val_acc > best_acc:
        best_acc = val_acc
        torch.save(model.state_dict(), "models/best_model.pth")
        print(f"  ↳ saved new best model ({val_acc:.3f})")

print(f"Training complete. Best val acc: {best_acc:.3f}")