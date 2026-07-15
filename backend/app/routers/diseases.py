from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
from app.db_models import Disease

router = APIRouter()

@router.get("/diseases")
async def list_diseases(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Disease))
    return result.scalars().all()

@router.get("/diseases/{slug}")
async def disease_detail(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Disease).where(Disease.slug == slug))
    disease = result.scalars().first()
    if not disease:
        raise HTTPException(404, "Disease not found")
    return disease