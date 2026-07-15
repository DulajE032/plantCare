from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)

from app.config import settings
from app.routers import predict, diseases, history
from app.database import engine, Base

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure media directory exists
    os.makedirs(settings.media_dir, exist_ok=True)
    # Create DB tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(title="PlantCare AI Backend", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"message": "An internal server error occurred.", "details": str(exc)},
    )

# Mount media directory for image serving
app.mount("/media", StaticFiles(directory=settings.media_dir), name="media")

app.include_router(predict.router)
app.include_router(diseases.router)
app.include_router(history.router)

@app.get("/")
def root():
    return {"message": "PlantCare AI Backend is running."}