import pytest
from httpx import AsyncClient
from unittest.mock import MagicMock
from app.main import app
from app.db_models import User, Article
from app.services.auth_utils import create_access_token

@pytest.fixture
def expert_token():
    return create_access_token(data={"sub": "expert-123", "role": "expert"})

@pytest.fixture
def farmer_token():
    return create_access_token(data={"sub": "farmer-123", "role": "farmer"})

@pytest.mark.asyncio
async def test_list_articles(mock_db):
    article = Article(id="art-1", title="Title", content="Content", author="Author", tags=["tag"])
    mock_db.execute.return_value.scalars.return_value.all.return_value = [article]

    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/api/articles")

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["title"] == "Title"

@pytest.mark.asyncio
async def test_create_article_as_expert(mock_db, expert_token):
    expert_user = User(id="expert-123", email="expert@example.com", full_name="Expert", role="expert")
    
    def mock_execute_side_effect(query, *args, **kwargs):
        mock_res = MagicMock()
        q_str = str(query).lower()
        if "users" in q_str:
            mock_res.scalars.return_value.first.return_value = expert_user
        else:
            mock_res.scalars.return_value.first.return_value = None
        return mock_res

    mock_db.execute.side_effect = mock_execute_side_effect

    async with AsyncClient(app=app, base_url="http://test") as ac:
        headers = {"Authorization": f"Bearer {expert_token}"}
        payload = {
            "title": "New Article",
            "content": "Description of disease",
            "author": "Dr. Smith",
            "tags": ["tomato"]
        }
        response = await ac.post("/api/articles", json=payload, headers=headers)

    assert response.status_code == 201
    assert response.json()["title"] == "New Article"
    assert response.json()["author"] == "Dr. Smith"

@pytest.mark.asyncio
async def test_create_article_as_farmer_forbidden(mock_db, farmer_token):
    farmer_user = User(id="farmer-123", email="farmer@example.com", full_name="Farmer", role="farmer")
    
    def mock_execute_side_effect(query, *args, **kwargs):
        mock_res = MagicMock()
        q_str = str(query).lower()
        if "users" in q_str:
            mock_res.scalars.return_value.first.return_value = farmer_user
        else:
            mock_res.scalars.return_value.first.return_value = None
        return mock_res

    mock_db.execute.side_effect = mock_execute_side_effect

    async with AsyncClient(app=app, base_url="http://test") as ac:
        headers = {"Authorization": f"Bearer {farmer_token}"}
        payload = {
            "title": "New Article",
            "content": "Description",
            "author": "Dr. Smith",
            "tags": []
        }
        response = await ac.post("/api/articles", json=payload, headers=headers)

    assert response.status_code == 403
