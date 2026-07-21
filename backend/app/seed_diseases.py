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


# Detailed real-world details for common diseases to make the app premium
DISEASE_DETAILS = {
    "apple-apple-scab": {
        "description": "Apple scab is a serious disease of apple trees caused by the fungus Venturia inaequalis. It causes olive-green to black velvety spots on leaves and scabby lesions on fruit, making it unmarketable.",
        "causes": [
            "Fungal spores of Venturia inaequalis overwintering in fallen leaves.",
            "Prolonged periods of leaf wetness and mild temperatures (15-25°C) in spring.",
            "Lack of proper sanitation and removal of infected crop debris."
        ],
        "treatment": [
            "Apply fungicides such as captan, myclobutanil, or copper sprays.",
            "Rake and destroy fallen leaves in autumn to reduce spore load.",
            "Prune branches to improve air circulation and rapid foliage drying."
        ],
        "prevention": [
            "Plant scab-resistant apple cultivars.",
            "Ensure proper tree spacing for maximum sunlight and ventilation.",
            "Apply lime sulfur during the dormant season to kill overwintering fungi."
        ]
    },
    "tomato-late-blight": {
        "description": "Late blight is a highly destructive disease affecting tomatoes and potatoes, caused by the oomycete pathogen Phytophthora infestans. It can wipe out entire fields within days under cool, wet conditions.",
        "causes": [
            "Oomycete pathogen Phytophthora infestans surviving in infected tubers or tomato debris.",
            "Cool temperatures and high humidity (wet weather).",
            "Windblown sporangia spreading from adjacent fields."
        ],
        "treatment": [
            "Remove and destroy infected plant parts immediately. Do not compost them.",
            "Apply copper-based fungicides or chlorothalonil to protect remaining healthy tissue.",
            "Increase spacing and prune lower leaves to reduce relative humidity in the canopy."
        ],
        "prevention": [
            "Use certified disease-free seeds and resistant tomato varieties.",
            "Avoid overhead watering; use drip irrigation to keep leaves dry.",
            "Practice strict crop rotation, avoiding planting tomatoes near potatoes."
        ]
    },
    "potato-early-blight": {
        "description": "Early blight is a common disease of potatoes caused by the fungus Alternaria solani. It produces characteristic dark, concentric 'target' spots on older leaves, causing them to yellow and die.",
        "causes": [
            "Fungal spores of Alternaria solani overwintering in crop residues or soil.",
            "Alternating wet and dry conditions on leaves.",
            "Nutrient stress or physical damage weakening the plants."
        ],
        "treatment": [
            "Apply fungicides containing mancozeb, chlorothalonil, or azoxystrobin.",
            "Prune heavily infected lower leaves to restrict upward fungal spread.",
            "Maintain optimal fertilization to support plant vigor."
        ],
        "prevention": [
            "Plant resistant potato varieties and practice 3-year crop rotation.",
            "Ensure excellent drainage and adequate spacing to promote foliage drying.",
            "Clean up and dispose of all crop residues at the end of the season."
        ]
    },
    "grape-black-rot": {
        "description": "Black rot is caused by the fungus Guignardia bidwellii. It infects all green parts of the grape vine, causing red-brown leaf spots and shriveling grapes into hard, black mummies.",
        "causes": [
            "Fungal spores overwintering in mummified berries and cane lesions.",
            "Warm, wet spring weather promoting spore release.",
            "Inadequate pruning or dense vine canopy retaining moisture."
        ],
        "treatment": [
            "Prune out diseased canes and remove mummified berries from vines.",
            "Apply fungicides containing myclobutanil or mancozeb from bud break until bloom.",
            "Remove wild grapevines in the vicinity that could harbor the fungus."
        ],
        "prevention": [
            "Choose a planting site with full sun and excellent air drainage.",
            "Keep vines trained on trellis systems and prune regularly to maximize light and airflow.",
            "Keep the ground clean beneath vines, cultivating or mulching to bury leaf debris."
        ]
    },
    "corn-maize-common-rust": {
        "description": "Common rust is caused by the fungus Puccinia sorghi. It causes powdery, cinnamon-brown pustules on both upper and lower leaf surfaces. While visually alarming, it rarely causes severe yield loss in field corn.",
        "causes": [
            "Spores carried by wind from southern overwintering regions.",
            "Cool temperatures (16-23°C) and high relative humidity/dew."
        ],
        "treatment": [
            "Fungicide treatment is rarely economical for field corn, but may be used on sweet corn or seed production fields if spotted early.",
            "Ensure balanced soil fertilization to support overall plant vigor."
        ],
        "prevention": [
            "Plant rust-resistant corn hybrids (the most effective defense).",
            "Manage planting dates to avoid cool, damp windows during early growth stages."
        ]
    }
}


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

            # Check if we have specific details mapped for this disease
            if slug in DISEASE_DETAILS:
                details = DISEASE_DETAILS[slug]
                description = details["description"]
                causes = details["causes"]
                treatment = details["treatment"]
                prevention = details["prevention"]
            else:
                # Generic fallback templates
                description = f"{human_name} is a plant disease affecting {crop} crops. Early identification and proper treatment are essential to prevent crop loss."
                causes = [
                    f"Pathogen infection commonly found in {crop} plants.",
                    "Favorable environmental conditions (humidity, temperature).",
                    "Spread through wind, water, or contaminated tools.",
                ]
                treatment = [
                    "Remove and destroy infected plant parts immediately.",
                    "Apply appropriate fungicide or treatment as recommended for this disease.",
                    "Improve air circulation and reduce moisture around plants.",
                ]
                prevention = [
                    "Use disease-resistant crop varieties when available.",
                    "Practice crop rotation (avoid planting same family in same spot for 2-3 years).",
                    "Maintain proper spacing between plants for good airflow.",
                    "Water at the base of plants; avoid wetting foliage.",
                ]

            disease = Disease(
                id=slug,
                slug=slug,
                disease=human_name,
                severity=severity,
                description=description,
                causes=causes,
                treatment=treatment,
                prevention=prevention,
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
