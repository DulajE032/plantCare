from pydantic import BaseModel
from typing import List, Optional

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

class ScanResult(BaseModel):
    id: str
    imageUrl: Optional[str] = None
    recommendation: DiseaseRecommendation
    scannedAt: str

class HistoryItem(BaseModel):
    id: str
    thumbnailUrl: Optional[str] = None
    diseaseName: str
    confidence: float
    severity: str
    scannedAt: str