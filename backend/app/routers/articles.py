from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete
from typing import List
import uuid

from app.database import get_db
from app.db_models import Article, User
from app.schemas.models import ArticleCreate, ArticleResponse
from app.services.auth_utils import get_current_expert_or_admin

router = APIRouter(prefix="/api/articles", tags=["articles"])

@router.get("", response_model=List[ArticleResponse])
async def list_articles(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Article).order_by(Article.created_at.desc()))
    return result.scalars().all()

@router.get("/{id}", response_model=ArticleResponse)
async def get_article(id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Article).where(Article.id == id))
    article = result.scalars().first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article

@router.post("", response_model=ArticleResponse, status_code=status.HTTP_201_CREATED)
async def create_article(
    article_in: ArticleCreate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_expert_or_admin)
):
    db_article = Article(
        id=f"art-{uuid.uuid4().hex[:12]}",
        title=article_in.title,
        content=article_in.content,
        author=article_in.author,
        tags=article_in.tags,
    )
    db.add(db_article)
    await db.commit()
    await db.refresh(db_article)
    return db_article

@router.put("/{id}", response_model=ArticleResponse)
async def update_article(
    id: str,
    article_in: ArticleCreate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_expert_or_admin)
):
    result = await db.execute(select(Article).where(Article.id == id))
    article = result.scalars().first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")

    article.title = article_in.title
    article.content = article_in.content
    article.author = article_in.author
    article.tags = article_in.tags

    await db.commit()
    await db.refresh(article)
    return article

@router.delete("/{id}")
async def delete_article(
    id: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_expert_or_admin)
):
    result = await db.execute(select(Article).where(Article.id == id))
    article = result.scalars().first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")

    await db.execute(delete(Article).where(Article.id == id))
    await db.commit()
    return {"message": f"Article {id} deleted successfully"}
