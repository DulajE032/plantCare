"""
Seed script: Populate the PostgreSQL `diseases` table from class_names.json.

Usage:
    cd backend
    python -m app.seed_diseases

This script:
  1. Reads class_names.json to get all model class names
  2. Converts each to a clean slug and human-readable name
  3. Inserts a Disease record into PostgreSQL for each class
  4. Skips "healthy" classes (they don't need treatment info)

Run this ONCE after training your model and before using the /predict endpoint.
"""

import asyncio
import json
from pathlib import Path

from sqlalchemy.future import select

from app.config import settings
from app.database import engine, AsyncSessionLocal, Base
from app.db_models import Disease


def slug_from_class_name(class_name: str) -> str:
    """Convert 'Tomato___Late_blight' → 'tomato-late-blight'"""
    return class_name.lower().replace("___", "-").replace("_", "-")


def human_name_from_class_name(class_name: str) -> str:
    """Convert 'Tomato___Late_blight' → 'Tomato Late Blight'"""
    return class_name.replace("___", " ").replace("_", " ").title()


def crop_type_from_class_name(class_name: str) -> str:
    """Extract crop type: 'Tomato___Late_blight' → 'Tomato'"""
    parts = class_name.split("___")
    return parts[0].replace("_", " ").title()


def is_healthy_class(class_name: str) -> bool:
    """Check if this is a 'healthy' class (no disease)."""
    return "healthy" in class_name.lower()


# Default disease info templates per severity
SEVERITY_MAP = {
    "blight": "severe",
    "rot": "severe",
    "virus": "severe",
    "mosaic": "moderate",
    "wilt": "severe",
    "rust": "moderate",
    "spot": "moderate",
    "scab": "moderate",
    "mold": "moderate",
    "mildew": "moderate",
    "curl": "moderate",
    "canker": "severe",
    "blast": "severe",
    "burn": "moderate",
    "streak": "moderate",
}


def guess_severity(class_name: str) -> str:
    """Guess severity based on disease keywords."""
    lower = class_name.lower()
    for keyword, severity in SEVERITY_MAP.items():
        if keyword in lower:
            return severity
    return "moderate"


async def seed():
    # 1. Read class names
    class_names_path = Path(settings.class_names_path)
    if not class_names_path.exists():
        print(f"ERROR: {class_names_path} not found!")
        print("Train your model first (python train.py) to generate class_names.json")
        return

    class_names = json.loads(class_names_path.read_text())
    print(f"Found {len(class_names)} classes in {class_names_path}")

    # 2. Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # 3. Insert diseases
    async with AsyncSessionLocal() as session:
        inserted = 0
        skipped_healthy = 0
        skipped_existing = 0

        for class_name in class_names:
            # Skip healthy classes — they don't need disease records
            if is_healthy_class(class_name):
                skipped_healthy += 1
                print(f"  SKIP (healthy): {class_name}")
                continue

            slug = slug_from_class_name(class_name)
            human_name = human_name_from_class_name(class_name)
            crop = crop_type_from_class_name(class_name)
            severity = guess_severity(class_name)

            # Check if already exists
            result = await session.execute(
                select(Disease).where(Disease.slug == slug)
            )
            if result.scalars().first():
                skipped_existing += 1
                print(f"  EXISTS: {slug}")
                continue

            disease = Disease(
                id=slug,
                slug=slug,
                disease=human_name,
                severity=severity,
                description=f"{human_name} is a plant disease affecting {crop} crops. "
                            f"Early identification and proper treatment are essential to prevent crop loss.",
                causes=[
                    f"Pathogen infection commonly found in {crop} plants.",
                    "Favorable environmental conditions (humidity, temperature).",
                    "Spread through wind, water, or contaminated tools.",
                ],
                treatment=[
                    "Remove and destroy infected plant parts immediately.",
                    "Apply appropriate fungicide or treatment as recommended for this disease.",
                    "Improve air circulation and reduce moisture around plants.",
                ],
                prevention=[
                    "Use disease-resistant crop varieties when available.",
                    "Practice crop rotation (avoid planting same family in same spot for 2-3 years).",
                    "Maintain proper spacing between plants for good airflow.",
                    "Water at the base of plants; avoid wetting foliage.",
                ],
                cropType=crop,
            )

            session.add(disease)
            inserted += 1
            print(f"  INSERT: {slug} ({crop} — {severity})")

        await session.commit()

        print(f"\n--- Seed Complete ---")
        print(f"  Inserted:         {inserted}")
        print(f"  Skipped (healthy): {skipped_healthy}")
        print(f"  Skipped (exists):  {skipped_existing}")
        print(f"  Total classes:     {len(class_names)}")


if __name__ == "__main__":
    asyncio.run(seed())
