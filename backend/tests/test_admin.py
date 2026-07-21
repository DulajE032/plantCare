import pytest
from httpx import AsyncClient
from unittest.mock import MagicMock
from app.main import app
from app.db_models import User, Disease
from app.services.auth_utils import create_access_token

@pytest.fixture
def admin_token():
    # Subject id is sub
    return create_access_token(data={"sub": "admin-123", "role": "admin"})

@pytest.fixture
def farmer_token():
    return create_access_token(data={"sub": "farmer-123", "role": "farmer"})

@pytest.mark.asyncio
async def test_list_users_as_admin(mock_db, admin_token):
    admin_user = User(id="admin-123", email="admin@example.com", full_name="Admin", role="admin")
    mock_db.execute.return_value.scalars.return_value.all.return_value = [admin_user]
    mock_db.execute.return_value.scalars.return_value.first.return_value = admin_user

    async with AsyncClient(app=app, base_url="http://test") as ac:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = await ac.get("/api/admin/users", headers=headers)

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["email"] == "admin@example.com"

@pytest.mark.asyncio
async def test_list_users_as_farmer_forbidden(mock_db, farmer_token):
    farmer_user = User(id="farmer-123", email="farmer@example.com", full_name="Farmer", role="farmer")
    mock_db.execute.return_value.scalars.return_value.first.return_value = farmer_user

    async with AsyncClient(app=app, base_url="http://test") as ac:
        headers = {"Authorization": f"Bearer {farmer_token}"}
        response = await ac.get("/api/admin/users", headers=headers)

    assert response.status_code == 403
    assert "privileges" in response.json()["detail"]

@pytest.mark.asyncio
async def test_create_disease_as_admin(mock_db, admin_token):
    admin_user = User(id="admin-123", email="admin@example.com", full_name="Admin", role="admin")
    mock_db.execute.return_value.scalars.return_value.first.return_value = admin_user # Mock first for token check, second returns None for create
    
    # We need mock_db.execute to return admin_user on token verification, but None for select(Disease)
    def mock_execute_side_effect(query, *args, **kwargs):
        mock_res = MagicMock()
        # Simple query string checking to decide what to return
        q_str = str(query).lower()
        if "users" in q_str:
            mock_res.scalars.return_value.first.return_value = admin_user
        else:
            mock_res.scalars.return_value.first.return_value = None
        return mock_res

    mock_db.execute.side_effect = mock_execute_side_effect

    async with AsyncClient(app=app, base_url="http://test") as ac:
        headers = {"Authorization": f"Bearer {admin_token}"}
        payload = {
            "id": "new-disease",
            "slug": "new-disease",
            "disease": "New Disease",
            "severity": "low",
            "description": "desc",
            "causes": ["cause"],
            "treatment": ["treat"],
            "prevention": ["prevent"],
            "cropType": "Crop"
        }
        response = await ac.post("/api/admin/diseases", json=payload, headers=headers)

    assert response.status_code == 201
    assert response.json()["disease"] == "New Disease"
