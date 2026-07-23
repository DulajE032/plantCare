import torch, json, io
from torch import nn
from torchvision import models, transforms
from PIL import Image
from pathlib import Path
from app.config import settings

_class_names = json.loads(Path(settings.class_names_path).read_text())

_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485,0.456,0.406], [0.229,0.224,0.225]),
])

class DiseaseClassifier:
    def __init__(self):
        self.model = models.mobilenet_v3_large(weights=None)
        in_features = self.model.classifier[3].in_features
        self.model.classifier[3] = nn.Linear(in_features, len(_class_names))
        state_dict = torch.load(settings.model_path, map_location="cpu")
        self.model.load_state_dict(state_dict)
        self.model.eval()

    def _to_slug(self, raw_name: str) -> str:
        """Convert raw class name to clean slug: 'Tomato___Late_blight' → 'tomato-late-blight'"""
        return raw_name.lower().replace("___", "-").replace("_", "-")

    def predict(self, image_bytes: bytes):
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        tensor = _transform(image).unsqueeze(0)
        with torch.no_grad():
            probs = torch.nn.functional.softmax(self.model(tensor)[0], dim=0)
            confidence, idx = torch.max(probs, dim=0)
        raw_name = _class_names[idx.item()]
        slug = self._to_slug(raw_name)
        return slug, round(confidence.item() * 100, 2)

    def predict_top_k(self, image_bytes: bytes, k: int = 3):
        """Return top-k predictions as list of (slug, confidence%) tuples."""
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        tensor = _transform(image).unsqueeze(0)
        with torch.no_grad():
            probs = torch.nn.functional.softmax(self.model(tensor)[0], dim=0)
            top_conf, top_idx = torch.topk(probs, k=min(k, len(_class_names)))

        results = []
        for i in range(top_conf.size(0)):
            raw_name = _class_names[top_idx[i].item()]
            slug = self._to_slug(raw_name)
            conf = round(top_conf[i].item() * 100, 2)
            results.append((slug, conf))
        return results

# Loaded once at process startup — not per-request
classifier = DiseaseClassifier()