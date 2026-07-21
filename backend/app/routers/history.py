from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete
from typing import List
from app.database import get_db
from app.db_models import HistoryItem
from app.schemas.models import HistoryItem as HistoryItemSchema

router = APIRouter()

@router.get("/history", response_model=List[HistoryItemSchema])
async def get_history(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(HistoryItem).order_by(HistoryItem.scannedAt.desc()).limit(100))
    items = result.scalars().all()
    return items

@router.delete("/history/{id}")
async def delete_history_item(id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(HistoryItem).where(HistoryItem.id == id))
    item = result.scalars().first()
    if not item:
        raise HTTPException(status_code=404, detail="History item not found")
    await db.execute(delete(HistoryItem).where(HistoryItem.id == id))
    await db.commit()
    return {"message": f"Scan {id} deleted successfully"}

@router.delete("/history")
async def clear_history(db: AsyncSession = Depends(get_db)):
    await db.execute(delete(HistoryItem))
    await db.commit()
    return {"message": "All scan history cleared successfully"}
