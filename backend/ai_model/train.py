import torch, json, os
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

if __name__ == "__main__":
    os.makedirs("models", exist_ok=True)
    print("Loading datasets from 'datasset' folder...")
    train_ds = datasets.ImageFolder("datasset/train", transform=train_tf)
    val_ds   = datasets.ImageFolder("datasset/valid", transform=val_tf)
    json.dump(train_ds.classes, open("class_names.json", "w"))
    print(f"Loaded {len(train_ds)} training images and {len(val_ds)} validation images across {len(train_ds.classes)} classes.")

    train_loader = DataLoader(train_ds, batch_size=32, shuffle=True, num_workers=0)
    val_loader   = DataLoader(val_ds, batch_size=32)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")

    print("Loading MobileNetV3 model weights (may download weights if run for the first time)...")
    model = models.mobilenet_v3_large(weights="IMAGENET1K_V1")
    in_features = model.classifier[3].in_features
    model.classifier[3] = nn.Linear(in_features, len(train_ds.classes))
    model = model.to(device)
    print("Model initialized. Starting training...")

    optimizer = optim.Adam(model.parameters(), lr=1e-4)
    criterion = nn.CrossEntropyLoss()

    best_acc = 0.0
    EPOCHS = 15

    for epoch in range(EPOCHS):
        model.train()
        running_loss = 0.0
        total_batches = len(train_loader)
        
        for batch_idx, (images, labels) in enumerate(train_loader):
            images, labels = images.to(device), labels.to(device)
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            running_loss += loss.item()
            
            if (batch_idx + 1) % 50 == 0 or (batch_idx + 1) == total_batches:
                print(f"Epoch {epoch+1}/{EPOCHS} — Batch {batch_idx+1}/{total_batches} — Current Loss: {running_loss/(batch_idx+1):.4f}")

        model.eval()
        correct, total = 0, 0
        with torch.no_grad():
            for images, labels in val_loader:
                images, labels = images.to(device), labels.to(device)
                preds = model(images).argmax(dim=1)
                correct += (preds == labels).sum().item()
                total += labels.size(0)
        val_acc = correct / total
        print(f"Epoch {epoch+1}/{EPOCHS} Complete — Avg Loss: {running_loss/total_batches:.4f} — Val Acc: {val_acc:.3f}")

        if val_acc > best_acc:
            best_acc = val_acc
            torch.save(model.state_dict(), "models/best_model.pth")
            print(f"  ↳ saved new best model ({val_acc:.3f})")

    print(f"Training complete. Best val acc: {best_acc:.3f}")
