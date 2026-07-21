from sqlalchemy import Column, String, Float, DateTime, Text, JSON, ForeignKey
from sqlalchemy.orm import relationship
import datetime
from app.database import Base

class Disease(Base):
    __tablename__ = "diseases"

    id = Column(String, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True)
    disease = Column(String)
    severity = Column(String)
    description = Column(Text)
    causes = Column(JSON)      # List of strings
    treatment = Column(JSON)   # List of strings
    prevention = Column(JSON)  # List of strings
    cropType = Column(String)

class HistoryItem(Base):
    __tablename__ = "history_items"

    id = Column(String, primary_key=True, index=True)
    imageUrl = Column(String, nullable=True)
    thumbnailUrl = Column(String, nullable=True)
    diseaseName = Column(String)
    confidence = Column(Float)
    severity = Column(String)
    scannedAt = Column(DateTime, default=datetime.datetime.utcnow)
