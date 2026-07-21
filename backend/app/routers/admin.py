from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func, delete
from typing import List

from app.database import get_db
from app.db_models import User, HistoryItem, Disease
from app.schemas.models import UserResponse, DiseaseRecommendation
from app.services.auth_utils import get_current_admin

router = APIRouter(prefix="/api/admin", tags=["admin"])

@router.get("/users", response_model=List[UserResponse])
async def list_users(
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    result = await db.execute(select(User).order_by(User.created_at.desc()))
    return result.scalars().all()

@router.get("/reports")
async def get_reports(
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    # Total Users count
    users_count_res = await db.execute(select(func.count(User.id)))
    total_users = users_count_res.scalar() or 0

    # Total Scans count
    scans_count_res = await db.execute(select(func.count(HistoryItem.id)))
    total_scans = scans_count_res.scalar() or 0

    # Scans by severity
    severity_res = await db.execute(
        select(HistoryItem.severity, func.count(HistoryItem.id))
        .group_by(HistoryItem.severity)
    )
    scans_by_severity = {row[0]: row[1] for row in severity_res.all()}

    # Scans by disease name
    disease_res = await db.execute(
        select(HistoryItem.diseaseName, func.count(HistoryItem.id))
        .group_by(HistoryItem.diseaseName)
        .order_by(func.count(HistoryItem.id).desc())
        .limit(10)
    )
    scans_by_disease = {row[0]: row[1] for row in disease_res.all()}

    return {
        "total_users": total_users,
        "total_scans": total_scans,
        "scans_by_severity": scans_by_severity,
        "scans_by_disease": scans_by_disease
    }

@router.post("/diseases", response_model=DiseaseRecommendation, status_code=status.HTTP_201_CREATED)
async def create_or_update_disease(
    disease_in: DiseaseRecommendation,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    result = await db.execute(select(Disease).where(Disease.id == disease_in.id))
    db_disease = result.scalars().first()

    if db_disease:
        # Update existing
        db_disease.slug = disease_in.slug
        db_disease.disease = disease_in.disease
        db_disease.severity = disease_in.severity
        db_disease.description = disease_in.description
        db_disease.causes = disease_in.causes
        db_disease.treatment = disease_in.treatment
        db_disease.prevention = disease_in.prevention
        db_disease.cropType = disease_in.cropType
    else:
        # Create new
        db_disease = Disease(
            id=disease_in.id,
            slug=disease_in.slug,
            disease=disease_in.disease,
            severity=disease_in.severity,
            description=disease_in.description,
            causes=disease_in.causes,
            treatment=disease_in.treatment,
            prevention=disease_in.prevention,
            cropType=disease_in.cropType
        )
        db.add(db_disease)

    await db.commit()
    await db.refresh(db_disease)
    return db_disease

@router.delete("/diseases/{id}")
async def delete_disease(
    id: str,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    result = await db.execute(select(Disease).where(Disease.id == id))
    disease = result.scalars().first()
    if not disease:
        raise HTTPException(status_code=404, detail="Disease not found")
        
    await db.execute(delete(Disease).where(Disease.id == id))
    await db.commit()
    return {"message": f"Disease {id} deleted successfully"}
