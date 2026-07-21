from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete
from typing import List, Optional
from app.database import get_db
from app.db_models import HistoryItem, User
from app.schemas.models import HistoryItem as HistoryItemSchema
from app.services.auth_utils import get_current_user

router = APIRouter()

@router.get("/history", response_model=List[HistoryItemSchema])
async def get_history(
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    user_id = current_user.id if current_user else None
    result = await db.execute(
        select(HistoryItem)
        .where(HistoryItem.user_id == user_id)
        .order_by(HistoryItem.scannedAt.desc())
        .limit(100)
    )
    items = result.scalars().all()
    return items

@router.delete("/history/{id}")
async def delete_history_item(
    id: str,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    user_id = current_user.id if current_user else None
    result = await db.execute(select(HistoryItem).where(HistoryItem.id == id))
    item = result.scalars().first()
    
    if not item:
        raise HTTPException(status_code=404, detail="History item not found")
        
    if item.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to delete this history item"
        )
        
    await db.execute(delete(HistoryItem).where(HistoryItem.id == id))
    await db.commit()
    return {"message": f"Scan {id} deleted successfully"}

@router.delete("/history")
async def clear_history(
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    user_id = current_user.id if current_user else None
    await db.execute(delete(HistoryItem).where(HistoryItem.user_id == user_id))
    await db.commit()
    return {"message": "All scan history cleared successfully"}
