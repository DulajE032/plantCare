from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from app.database import get_db
from app.db_models import Disease
from app.schemas.models import DiseaseRecommendation

router = APIRouter()

@router.get("/diseases", response_model=List[DiseaseRecommendation])
async def list_diseases(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Disease))
    return result.scalars().all()

@router.get("/diseases/{slug}", response_model=DiseaseRecommendation)
async def disease_detail(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Disease).where(Disease.slug == slug))
    disease = result.scalars().first()
    if not disease:
        raise HTTPException(404, "Disease not found")
    return disease