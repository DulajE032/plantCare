import pytest
from httpx import AsyncClient
from unittest.mock import MagicMock
from app.main import app
from app.db_models import HistoryItem

@pytest.mark.asyncio
async def test_get_history(mock_db):
    mock_history = HistoryItem(
        id="scan-12345",
        imageUrl="http://test/media/image.jpg",
        thumbnailUrl="http://test/media/image.jpg",
        diseaseName="Tomato Late Blight",
        confidence=92.5,
        severity="severe"
    )
    
    mock_result = MagicMock()
    mock_result.scalars().all.return_value = [mock_history]
    mock_db.execute.return_value = mock_result
    
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/history")
        
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["id"] == "scan-12345"
    assert data[0]["diseaseName"] == "Tomato Late Blight"
