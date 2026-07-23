from pydantic import BaseModel, EmailStr
from typing import List, Optional
import datetime

class DiseaseRecommendation(BaseModel):
    id: str
    disease: str
    slug: str
    severity: str
    description: str
    causes: List[str]
    treatment: List[str]
    prevention: List[str]
    cropType: str
    confidence: Optional[float] = None

class AlternativePrediction(BaseModel):
    slug: str
    disease: str
    confidence: float
    severity: str
    cropType: str

class ScanResult(BaseModel):
    id: str
    imageUrl: Optional[str] = None
    recommendation: DiseaseRecommendation
    alternatives: List[AlternativePrediction] = []
    scannedAt: str

class HistoryItem(BaseModel):
    id: str
    thumbnailUrl: Optional[str] = None
    diseaseName: str
    confidence: float
    severity: str
    scannedAt: str
    user_id: Optional[str] = None

# User Schemas
class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    role: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[str] = None
    role: Optional[str] = None

# Article Schemas
class ArticleCreate(BaseModel):
    title: str
    content: str
    author: str
    tags: List[str] = []

class ArticleResponse(BaseModel):
    id: str
    title: str
    content: str
    author: str
    tags: List[str]
    created_at: datetime.datetime

    class Config:
        from_attributes = True