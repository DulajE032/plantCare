from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
from app.db_models import HistoryItem

router = APIRouter()

@router.get("/history")
async def get_history(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(HistoryItem).order_by(HistoryItem.scannedAt.desc()).limit(100))
    items = result.scalars().all()
    return items
