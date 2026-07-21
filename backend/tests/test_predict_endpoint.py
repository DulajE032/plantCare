import pytest
from httpx import AsyncClient
from unittest.mock import MagicMock
from app.main import app
from app.db_models import Disease

@pytest.mark.asyncio
async def test_predict_disease_success(mock_db, mock_classifier):
    # Mock database lookup for a diseased plant
    mock_disease = Disease(
        id="tomato-late-blight",
        slug="tomato-late-blight",
        disease="Tomato Late Blight",
        severity="severe",
        description="Destructive disease",
        causes=["Fungus"],
        treatment=["Fungicide"],
        prevention=["Rotation"],
        cropType="Tomato"
    )
    
    mock_result = MagicMock()
    mock_result.scalars().first.return_value = mock_disease
    mock_db.execute.return_value = mock_result
    
    async with AsyncClient(app=app, base_url="http://test") as ac:
        files = {"file": ("test.jpg", b"fake_image_bytes", "image/jpeg")}
        response = await ac.post("/predict", files=files)
        
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert "imageUrl" in data
    assert data["recommendation"]["disease"] == "Tomato Late Blight"
    assert data["recommendation"]["slug"] == "tomato-late-blight"
    assert data["recommendation"]["severity"] == "severe"
    assert data["recommendation"]["confidence"] == 95.5
