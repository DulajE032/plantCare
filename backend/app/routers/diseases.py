from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from app.database import get_db
from app.db_models import Disease
from app.schemas.models import DiseaseRecommendation

from typing import List, Optional

router = APIRouter()

@router.get("/diseases", response_model=List[DiseaseRecommendation])
async def list_diseases(
    cropType: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    query = select(Disease)
    if cropType:
        query = query.where(Disease.cropType.ilike(f"%{cropType}%"))
    if search:
        query = query.where(
            (Disease.disease.ilike(f"%{search}%")) | 
            (Disease.description.ilike(f"%{search}%"))
        )
    
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/diseases/{slug}", response_model=DiseaseRecommendation)
async def disease_detail(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Disease).where(Disease.slug == slug))
    disease = result.scalars().first()
    if not disease:
        raise HTTPException(404, "Disease not found")
    return disease