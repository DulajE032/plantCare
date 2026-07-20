import pytest
from unittest.mock import AsyncMock, MagicMock
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db

@pytest.fixture
def mock_db():
    session = MagicMock(spec=AsyncSession)
    session.execute = AsyncMock()
    session.commit = AsyncMock()
    session.refresh = AsyncMock()
    session.add = MagicMock()
    return session

@pytest.fixture(autouse=True)
def override_db(mock_db):
    from app.main import app
    app.dependency_overrides[get_db] = lambda: mock_db
    yield
    app.dependency_overrides.clear()

@pytest.fixture
def mock_classifier(monkeypatch):
    from app.services.classifier import classifier
    mock_pred = MagicMock(return_value=("tomato-late-blight", 95.5))
    monkeypatch.setattr(classifier, "predict", mock_pred)
    return mock_pred
