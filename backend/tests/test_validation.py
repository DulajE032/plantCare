import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_predict_invalid_file_type():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        files = {"file": ("test.pdf", b"fake_pdf_bytes", "application/pdf")}
        response = await ac.post("/predict", files=files)
        
    assert response.status_code == 400
    assert "Invalid file type" in response.json()["detail"]

@pytest.mark.asyncio
async def test_predict_empty_file():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        files = {"file": ("test.jpg", b"", "image/jpeg")}
        response = await ac.post("/predict", files=files)
        
    assert response.status_code == 400
    assert "Empty file" in response.json()["detail"]

@pytest.mark.asyncio
async def test_predict_oversized_file():
    # 10 MB limit is MAX_FILE_SIZE. Let's send 11 MB.
    oversized_data = b"x" * (10 * 1024 * 1024 + 100)
    async with AsyncClient(app=app, base_url="http://test") as ac:
        files = {"file": ("test.jpg", oversized_data, "image/jpeg")}
        response = await ac.post("/predict", files=files)
        
    assert response.status_code == 400
    assert "File too large" in response.json()["detail"]
