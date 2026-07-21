from sqlalchemy import Column, String, Float, DateTime, Text, JSON, ForeignKey
from sqlalchemy.orm import relationship
import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="farmer")  # farmer, expert, admin
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    reset_token = Column(String, nullable=True, index=True)
    reset_token_expires = Column(DateTime, nullable=True)

    scans = relationship("HistoryItem", back_populates="user", cascade="all, delete-orphan")

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

class Article(Base):
    __tablename__ = "articles"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    author = Column(String, nullable=False)
    tags = Column(JSON)        # List of strings
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class HistoryItem(Base):
    __tablename__ = "history_items"

    id = Column(String, primary_key=True, index=True)
    imageUrl = Column(String, nullable=True)
    thumbnailUrl = Column(String, nullable=True)
    diseaseName = Column(String)
    confidence = Column(Float)
    severity = Column(String)
    scannedAt = Column(DateTime, default=datetime.datetime.utcnow)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)

    user = relationship("User", back_populates="scans")
