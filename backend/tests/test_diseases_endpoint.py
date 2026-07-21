import pytest
from httpx import AsyncClient
from unittest.mock import MagicMock
from app.main import app
from app.db_models import Disease

@pytest.mark.asyncio
async def test_list_diseases(mock_db):
    mock_disease = Disease(
        id="tomato-late-blight",
        slug="tomato-late-blight",
        disease="Tomato Late Blight",
        severity="severe",
        description="Destructive disease",
        cropType="Tomato"
    )
    
    mock_result = MagicMock()
    mock_result.scalars().all.return_value = [mock_disease]
    mock_db.execute.return_value = mock_result
    
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/diseases")
        
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["slug"] == "tomato-late-blight"

@pytest.mark.asyncio
async def test_get_disease_detail(mock_db):
    mock_disease = Disease(
        id="tomato-late-blight",
        slug="tomato-late-blight",
        disease="Tomato Late Blight",
        severity="severe",
        description="Destructive disease",
        cropType="Tomato"
    )
    
    mock_result = MagicMock()
    mock_result.scalars().first.return_value = mock_disease
    mock_db.execute.return_value = mock_result
    
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/diseases/tomato-late-blight")
        
    assert response.status_code == 200
    data = response.json()
    assert data["slug"] == "tomato-late-blight"
    assert data["disease"] == "Tomato Late Blight"

@pytest.mark.asyncio
async def test_get_disease_detail_not_found(mock_db):
    mock_result = MagicMock()
    mock_result.scalars().first.return_value = None
    mock_db.execute.return_value = mock_result
    
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/diseases/invalid-slug")
        
    assert response.status_code == 404
