import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_predict_healthy_success(mock_db, monkeypatch):
    # Mock classifier to return a healthy prediction
    from app.services.classifier import classifier
    monkeypatch.setattr(classifier, "predict", lambda x: ("tomato-healthy", 99.1))
    
    async with AsyncClient(app=app, base_url="http://test") as ac:
        files = {"file": ("test.jpg", b"fake_image_bytes", "image/jpeg")}
        response = await ac.post("/predict", files=files)
        
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert data["recommendation"]["disease"] == "Healthy Tomato"
    assert data["recommendation"]["slug"] == "tomato-healthy"
    assert data["recommendation"]["severity"] == "low"
    assert data["recommendation"]["cropType"] == "Tomato"
    assert len(data["recommendation"]["prevention"]) > 0
    assert len(data["recommendation"]["treatment"]) == 0
    assert len(data["recommendation"]["causes"]) == 0
