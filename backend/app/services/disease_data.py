import json
from pathlib import Path
from app.config import settings

_db_path = Path(settings.disease_db_path)
_disease_db = json.loads(_db_path.read_text())

def get_all_diseases():
    return list(_disease_db.values())

def get_disease(slug: str):
    return _disease_db.get(slug)

def is_known_slug(slug: str) -> bool:
    return slug in _disease_db