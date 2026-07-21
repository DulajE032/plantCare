import pytest
from httpx import AsyncClient
from unittest.mock import MagicMock
from app.main import app
from app.db_models import User
from app.services.auth_utils import get_password_hash

@pytest.mark.asyncio
async def test_register_user_success(mock_db):
    # Mock no existing user
    mock_db.execute.return_value.scalars.return_value.first.return_value = None
    
    async with AsyncClient(app=app, base_url="http://test") as ac:
        payload = {
            "email": "test@example.com",
            "full_name": "Test User",
            "password": "password123"
        }
        response = await ac.post("/api/auth/register", json=payload)
        
    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    assert data["email"] == "test@example.com"
    assert data["full_name"] == "Test User"
    assert data["role"] == "admin" # Since it is the first user registered in mock

@pytest.mark.asyncio
async def test_register_user_duplicate_email(mock_db):
    # Mock existing user
    existing = User(email="test@example.com", full_name="Existing", hashed_password="hashed")
    mock_db.execute.return_value.scalars.return_value.first.return_value = existing
    
    async with AsyncClient(app=app, base_url="http://test") as ac:
        payload = {
            "email": "test@example.com",
            "full_name": "Test User",
            "password": "password123"
        }
        response = await ac.post("/api/auth/register", json=payload)
        
    assert response.status_code == 400
    assert response.json()["detail"] == "A user with this email already exists."

@pytest.mark.asyncio
async def test_login_success(mock_db):
    # Mock existing user
    password = "password123"
    hashed = get_password_hash(password)
    user = User(id="user-123", email="test@example.com", full_name="Test User", hashed_password=hashed, role="farmer")
    
    mock_db.execute.return_value.scalars.return_value.first.return_value = user
    
    async with AsyncClient(app=app, base_url="http://test") as ac:
        payload = {
            "email": "test@example.com",
            "password": password
        }
        response = await ac.post("/api/auth/login", json=payload)
        
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

@pytest.mark.asyncio
async def test_login_invalid_password(mock_db):
    # Mock existing user
    hashed = get_password_hash("correct_password")
    user = User(id="user-123", email="test@example.com", full_name="Test User", hashed_password=hashed, role="farmer")
    
    mock_db.execute.return_value.scalars.return_value.first.return_value = user
    
    async with AsyncClient(app=app, base_url="http://test") as ac:
        payload = {
            "email": "test@example.com",
            "password": "wrong_password"
        }
        response = await ac.post("/api/auth/login", json=payload)
        
        
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"

@pytest.mark.asyncio
async def test_forgot_password_success(mock_db):
    user = User(id="user-123", email="test@example.com", full_name="Test User", hashed_password="hashed", role="farmer")
    mock_db.execute.return_value.scalars.return_value.first.return_value = user

    async with AsyncClient(app=app, base_url="http://test") as ac:
        payload = {"email": "test@example.com"}
        response = await ac.post("/api/auth/forgot-password", json=payload)

    assert response.status_code == 200
    assert "reset_token" in response.json()
    assert response.json()["message"] == "Password reset email sent"
    assert user.reset_token is not None

@pytest.mark.asyncio
async def test_forgot_password_user_not_found(mock_db):
    mock_db.execute.return_value.scalars.return_value.first.return_value = None

    async with AsyncClient(app=app, base_url="http://test") as ac:
        payload = {"email": "test@example.com"}
        response = await ac.post("/api/auth/forgot-password", json=payload)

    assert response.status_code == 200
    assert "reset_token" not in response.json()
    assert response.json()["message"] == "If an account with that email exists, a reset link has been sent."

@pytest.mark.asyncio
async def test_reset_password_success(mock_db):
    import datetime
    token = "valid_token"
    user = User(
        id="user-123", 
        email="test@example.com", 
        full_name="Test User", 
        hashed_password="hashed", 
        role="farmer",
        reset_token=token,
        reset_token_expires=datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    )
    mock_db.execute.return_value.scalars.return_value.first.return_value = user

    async with AsyncClient(app=app, base_url="http://test") as ac:
        payload = {"token": token, "new_password": "newpassword123"}
        response = await ac.post("/api/auth/reset-password", json=payload)

    assert response.status_code == 200
    assert response.json()["message"] == "Password reset successful"
    assert user.reset_token is None
    assert user.reset_token_expires is None

@pytest.mark.asyncio
async def test_reset_password_invalid_token(mock_db):
    import datetime
    token = "invalid_token"
    user = User(
        id="user-123", 
        email="test@example.com", 
        full_name="Test User", 
        hashed_password="hashed", 
        role="farmer",
        reset_token="valid_token",
        reset_token_expires=datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    )
    mock_db.execute.return_value.scalars.return_value.first.return_value = user

    async with AsyncClient(app=app, base_url="http://test") as ac:
        payload = {"token": token, "new_password": "newpassword123"}
        response = await ac.post("/api/auth/reset-password", json=payload)

    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid or expired reset token"
