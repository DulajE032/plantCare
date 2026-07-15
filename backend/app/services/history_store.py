import json
from pathlib import Path
from threading import Lock

_path = Path("app/data/history.json")
_lock = Lock()

if not _path.exists():
    _path.write_text("[]")

def add_scan(item: dict):
    with _lock:
        history = json.loads(_path.read_text())
        history.insert(0, item)
        _path.write_text(json.dumps(history[:100]))  # cap stored history

def get_history():
    return json.loads(_path.read_text())