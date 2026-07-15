from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Request
import time
import uuid
import os
import logging
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.services.classifier import classifier
from app.config import settings
from app.database import get_db
from app.db_models import Disease, HistoryItem

logger = logging.getLogger(__name__)

router = APIRouter()

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

@router.post("/predict")
async def predict(
    request: Request,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(400, "Invalid file type. Use JPEG, PNG, or WEBP.")

    contents = await file.read()
    if len(contents) == 0:
        raise HTTPException(400, "Empty file.")
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(400, "File too large. Maximum size is 10 MB.")

    # 1. Prediction
    try:
        pred_slug, confidence = classifier.predict(contents)
    except Exception as e:
        logger.error(f"Inference failed: {e}")
        raise HTTPException(500, f"Inference failed: {e}")

    # 2. Get Disease Info from DB
    result = await db.execute(select(Disease).where(Disease.slug == pred_slug))
    disease_info = result.scalars().first()

    if not disease_info:
        logger.error(f"Unknown class '{pred_slug}' — not found in diseases table.")
        raise HTTPException(500, f"Model predicted unknown class '{pred_slug}' — check diseases in DB.")

    # 3. Save Image
    ext = file.filename.split(".")[-1] if file.filename and "." in file.filename else "jpg"
    unique_filename = f"{uuid.uuid4().hex}.{ext}"
    media_path = os.path.join(settings.media_dir, unique_filename)

    with open(media_path, "wb") as f:
        f.write(contents)

    # Build the image URL using the actual backend server URL
    base_url = str(request.base_url).rstrip("/")
    image_url = f"{base_url}/media/{unique_filename}"

    # 4. Save History to DB
    history_id = f"scan-{int(time.time() * 1000)}"
    new_history = HistoryItem(
        id=history_id,
        imageUrl=image_url,
        thumbnailUrl=image_url,
        diseaseName=disease_info.disease,
        confidence=confidence,
        severity=disease_info.severity,
    )

    db.add(new_history)
    await db.commit()
    await db.refresh(new_history)

    # 5. Return Response
    response = {
        "id": new_history.id,
        "imageUrl": new_history.imageUrl,
        "recommendation": {
            "id": disease_info.id,
            "disease": disease_info.disease,
            "slug": disease_info.slug,
            "severity": disease_info.severity,
            "description": disease_info.description,
            "causes": disease_info.causes,
            "treatment": disease_info.treatment,
            "prevention": disease_info.prevention,
            "cropType": disease_info.cropType,
            "confidence": confidence,
        },
        "scannedAt": new_history.scannedAt.isoformat() + "Z" if new_history.scannedAt else None,
    }

    logger.info(f"Prediction: {pred_slug} ({confidence}%) — scan {history_id}")
    return response