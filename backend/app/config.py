import os
from pathlib import Path
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    base_dir: str = str(Path(__file__).resolve().parent.parent)
    frontend_origin: str = "http://localhost:3000"
    model_path: str = "ai_model/models/best_model.pth"
    class_names_path: str = "ai_model/class_names.json"
    
    # Postgres Database Config
    database_url: str = "postgresql+asyncpg://postgres:dulaj16376@localhost:5432/plantcare"
    
    # Media Config
    media_dir: str = "media"

    # JWT Config
    jwt_secret_key: str = "plantcare_super_secret_key_change_me_in_production"
    jwt_algorithm: str = "HS256"

    class Config:
        env_file = os.path.join(Path(__file__).resolve().parent.parent, ".env")

settings = Settings()