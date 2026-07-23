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
        "description": "Apple scab is a serious fungal disease caused by Venturia inaequalis. It causes olive-green to black velvety spots on leaves and scabby lesions on fruit, rendering fruit unmarketable.",
        "causes": [
            "Venturia inaequalis fungal spores overwintering in fallen leaves.",
            "Prolonged leaf wetness and temperatures between 15°C and 25°C.",
            "Inadequate autumn foliage cleanup and sanitation."
        ],
        "treatment": [
            "Apply fungicides such as captan, myclobutanil, or copper hydroxide sprays.",
            "Rake and burn or destroy fallen leaves in autumn to eliminate overwintering spores.",
            "Prune canopy branches to improve air circulation and speed up leaf drying."
        ],
        "prevention": [
            "Plant scab-resistant apple cultivars like Liberty, Enterprise, or Freedom.",
            "Ensure wide tree spacing for adequate sunlight and airflow.",
            "Apply dormant lime-sulfur sprays in late winter."
        ]
    },
    "apple-black-rot": {
        "description": "Black rot is caused by the fungus Botryosphaeria obtusa. It affects fruit, leaves (causing frog-eye leaf spot), and branches (causing cankers).",
        "causes": [
            "Overwintering fungal spores in dead wood, mummified fruit, and branch cankers.",
            "Warm, wet weather during early fruit development."
        ],
        "treatment": [
            "Prune out dead or diseased wood and cankers during winter pruning.",
            "Apply protective fungicides containing captan or thiophanate-methyl."
        ],
        "prevention": [
            "Remove mummified apples from trees and orchard floors.",
            "Maintain overall tree health through balanced fertilization and watering."
        ]
    },
    "apple-cedar-apple-rust": {
        "description": "Cedar apple rust is a fungal disease caused by Gymnosporangium juniperi-virginianae that requires both apple trees and Eastern red cedar trees to complete its life cycle.",
        "causes": [
            "Fungal spores carried by spring wind from galls on nearby red cedar trees.",
            "Moist spring weather during early leaf unfolding."
        ],
        "treatment": [
            "Apply myclobutanil or immunox fungicides starting at pink bud stage.",
            "Remove nearby Eastern red cedar trees within a 1-2 mile radius if possible."
        ],
        "prevention": [
            "Plant rust-resistant apple varieties.",
            "Avoid planting apple trees near ornamental junipers or cedars."
        ]
    },
    "cherry-including-sour-powdery-mildew": {
        "description": "Powdery mildew on cherries is caused by Podosphaera clandestina. It affects young leaves and fruit, coating them in white powdery fungal growth.",
        "causes": [
            "High humidity accompanied by warm dry day temperatures.",
            "Dense canopy shading reducing light penetration."
        ],
        "treatment": [
            "Apply sulfur-based or potassium bicarbonate fungicides at first sign.",
            "Prune tree canopy to increase sunlight penetration."
        ],
        "prevention": [
            "Avoid excessive nitrogen fertilization which promotes lush susceptible growth.",
            "Maintain open tree canopy structures."
        ]
    },
    "corn-maize-cercospora-leaf-spot-gray-leaf-spot": {
        "description": "Gray leaf spot is a severe fungal disease of corn caused by Cercospora zeae-maydis, producing rectangular, tan-to-gray lesions bounded by leaf veins.",
        "causes": [
            "High humidity and prolonged leaf wetness.",
            "Continuous corn cropping with minimal tillage leaving infected residue."
        ],
        "treatment": [
            "Apply foliar fungicides such as azoxystrobin or pyraclostrobin at tasseling stage."
        ],
        "prevention": [
            "Rotate crops with non-host plants like soybeans or alfalfa.",
            "Plant resistant corn hybrids."
        ]
    },
    "corn-maize-common-rust": {
        "description": "Common rust is caused by Puccinia sorghi, producing cinnamon-brown powdery pustules on both upper and lower leaf surfaces.",
        "causes": [
            "Windborne spores transported from southern regions.",
            "Cool temperatures (16-23°C) with high relative humidity."
        ],
        "treatment": [
            "Fungicides like triazoles can be applied on high-value seed or sweet corn if caught early."
        ],
        "prevention": [
            "Plant rust-resistant corn hybrids.",
            "Manage planting dates to avoid high moisture periods during early growth."
        ]
    },
    "corn-maize-northern-leaf-blight": {
        "description": "Northern corn leaf blight (Exserohilum turcicum) creates long, elliptical, grayish-green to tan lesions on corn leaves.",
        "causes": [
            "Fungal spores overwintering in corn crop debris.",
            "Moderate temperatures (18-27°C) and heavy dew."
        ],
        "treatment": [
            "Apply quinone outside inhibitor (QoI) or demethylation inhibitor (DMI) fungicides."
        ],
        "prevention": [
            "Practice 2-year crop rotation.",
            "Incorporate crop residues by clean plowing where appropriate."
        ]
    },
    "grape-black-rot": {
        "description": "Black rot is caused by Guignardia bidwellii. It infects leaves and causes grapes to shrivel into hard, black, wrinkled mummies.",
        "causes": [
            "Spores overwintering in mummified berries and cane lesions.",
            "Warm, wet spring weather during early shoot growth."
        ],
        "treatment": [
            "Prune infected canes and remove mummified berries from vines.",
            "Apply myclobutanil or mancozeb sprays from bud break through bloom."
        ],
        "prevention": [
            "Train vines on trellis systems for maximum sun and air exposure.",
            "Destroy wild grapevines near the vineyard."
        ]
    },
    "grape-esca-black-measles": {
        "description": "Esca or Black Measles is a complex trunk disease caused by fungi like Phaeomoniella chlamydospora, leading to tiger-stripe leaf symptoms and spotted berries.",
        "causes": [
            "Fungal infection entering through winter pruning wounds.",
            "Water stress in hot weather accentuating symptoms."
        ],
        "treatment": [
            "Prune out infected cordons or trunks well below visible rot.",
            "Protect fresh pruning wounds with paint or wound sealants."
        ],
        "prevention": [
            "Delay pruning until late winter to minimize wound infection windows."
        ]
    },
    "grape-leaf-blight-isariopsis-leaf-spot": {
        "description": "Isariopsis leaf spot produces dark brown lesions with yellow halos on grape foliage, leading to premature defoliation.",
        "causes": [
            "Pseudocercospora vitis spores surviving in fallen foliage.",
            "Humid, warm canopy environments."
        ],
        "treatment": [
            "Apply copper or mancozeb sprays during shoot development."
        ],
        "prevention": [
            "Keep canopy open with leaf pulling around cluster zones."
        ]
    },
    "orange-haunglongbing-citrus-greening": {
        "description": "Citrus Greening (HLB) is a devastating bacterial disease spread by the Asian citrus psyllid, causing asymmetrical blotchy mottling on leaves and bitter, misshapen fruit.",
        "causes": [
            "Candidatus Liberibacter asiaticus bacteria transmitted by Asian citrus psyllids.",
            "Infected nursery stock movement."
        ],
        "treatment": [
            "No cure exists once infected; remove and destroy infected trees to protect surrounding orchards.",
            "Apply systemic insecticides to control vector psyllid populations."
        ],
        "prevention": [
            "Plant only certified disease-free nursery stock.",
            "Monitor psyllid traps regularly."
        ]
    },
    "peach-bacterial-spot": {
        "description": "Bacterial spot (Xanthomonas arboricola pv. pruni) causes leaf spots, shot-holes, and pitted fruit on peaches.",
        "causes": [
            "Bacterial overwintering in twig lesions and buds.",
            "Frequent spring rains with warm winds."
        ],
        "treatment": [
            "Apply copper sprays during dormant and early blossom stages.",
            "Use oxytetracycline applications during post-bloom wet weather."
        ],
        "prevention": [
            "Select resistant cultivars such as Candor or Reliance."
        ]
    },
    "pepper-bell-bacterial-spot": {
        "description": "Bacterial spot on bell peppers causes small water-soaked leaf spots that turn brown and lead to leaf drop and fruit scab.",
        "causes": [
            "Xanthomonas bacteria carried on infected seed.",
            "Splashing rainwater and overhead irrigation."
        ],
        "treatment": [
            "Apply copper hydroxide mixed with mancozeb to combat copper resistance."
        ],
        "prevention": [
            "Use seed treated with hot water or chlorine solution.",
            "Avoid working in pepper fields when foliage is wet."
        ]
    },
    "potato-early-blight": {
        "description": "Early blight (Alternaria solani) causes dark, concentric target-pattern spots on older potato leaves.",
        "causes": [
            "Alternaria fungal spores in soil and crop debris.",
            "Alternating wet and dry periods."
        ],
        "treatment": [
            "Apply chlorothalonil, mancozeb, or strobilurin fungicides."
        ],
        "prevention": [
            "Practice 3-year crop rotation with non-solanaceous crops."
        ]
    },
    "potato-late-blight": {
        "description": "Late blight (Phytophthora infestans) is a water mold disease causing rapid dark water-soaked leaf decay and tuber rot.",
        "causes": [
            "Cool, wet weather with humidity > 90%.",
            "Infected seed tubers or volunteer plants."
        ],
        "treatment": [
            "Apply copper-based or systemic fungicides like ridomil or fluazinam immediately."
        ],
        "prevention": [
            "Destroy volunteer potato plants and cull piles."
        ]
    },
    "squash-powdery-mildew": {
        "description": "Powdery mildew creates a white talcum-powder-like coating on squash leaves, causing premature yellowing and death.",
        "causes": [
            "Podosphaera xanthii spores spread by air currents.",
            "Shaded foliage and dense canopy."
        ],
        "treatment": [
            "Apply neem oil, potassium bicarbonate, or sulfur sprays at first sign."
        ],
        "prevention": [
            "Plant resistant squash varieties."
        ]
    },
    "strawberry-leaf-scorch": {
        "description": "Leaf scorch (Diplocarpon earlianum) produces small purplish spots on strawberry leaves that enlarge and turn dark brown.",
        "causes": [
            "Fungal spores splashing from leaf debris during rains."
        ],
        "treatment": [
            "Apply captan or thiram fungicides post-harvest."
        ],
        "prevention": [
            "Renovate strawberry beds after harvest by mowing and removing old foliage."
        ]
    },
    "tomato-bacterial-spot": {
        "description": "Bacterial spot on tomato causes small dark spots on leaves and fruit, leading to defoliation and sunscald.",
        "causes": [
            "Xanthomonas species spread by splashing water and tools."
        ],
        "treatment": [
            "Apply copper bactericides combined with mancozeb."
        ],
        "prevention": [
            "Use drip irrigation instead of overhead sprinklers."
        ]
    },
    "tomato-early-blight": {
        "description": "Tomato early blight causes dark brown target-ring spots on foliage starting from the bottom of the plant.",
        "causes": [
            "Alternaria solani spores in crop debris."
        ],
        "treatment": [
            "Prune infected bottom leaves and apply copper fungicides."
        ],
        "prevention": [
            "Mulch around tomato plant bases to prevent soil splashing."
        ]
    },
    "tomato-late-blight": {
        "description": "Tomato late blight causes large water-soaked greasy gray lesions on leaves and firm brown rot on fruit.",
        "causes": [
            "Phytophthora infestans spores transported by wind."
        ],
        "treatment": [
            "Destroy heavily infected plants; spray remaining with copper fungicides."
        ],
        "prevention": [
            "Plant certified disease-free transplants."
        ]
    },
    "tomato-leaf-mold": {
        "description": "Leaf mold (Passalora fulva) causes pale green to yellow spots on upper leaf surfaces and velvety olive-green fungus underneath.",
        "causes": [
            "High relative humidity (> 85%) inside greenhouses or dense gardens."
        ],
        "treatment": [
            "Increase ventilation and apply copper fungicides."
        ],
        "prevention": [
            "Keep greenhouse humidity below 85%."
        ]
    },
    "tomato-septoria-leaf-spot": {
        "description": "Septoria leaf spot causes numerous tiny circular spots with dark borders and gray centers on lower tomato leaves.",
        "causes": [
            "Septoria lycopersici fungal spores in soil debris."
        ],
        "treatment": [
            "Apply chlorothalonil or copper sprays every 7-10 days during rainy weather."
        ],
        "prevention": [
            "Stake and prune tomato plants for upright growth."
        ]
    },
    "tomato-spider-mites-two-spotted-spider-mite": {
        "description": "Two-spotted spider mites suck sap from leaves, causing fine yellow stippling, leaf bronzing, and delicate webbing.",
        "causes": [
            "Hot, dry, dusty environmental conditions."
        ],
        "treatment": [
            "Spray foliage thoroughly with insecticidal soap, neem oil, or miticides."
        ],
        "prevention": [
            "Keep plant leaves hosed down periodically to increase humidity."
        ]
    },
    "tomato-target-spot": {
        "description": "Target spot (Corynespora cassiicola) creates brown leaf spots with light brown centers and yellow halos.",
        "causes": [
            "Fungal spores in plant debris under warm humid conditions."
        ],
        "treatment": [
            "Apply strobilurin or azoxystrobin fungicides."
        ],
        "prevention": [
            "Maintain crop rotation schedules."
        ]
    },
    "tomato-tomato-yellow-leaf-curl-virus": {
        "description": "Tomato Yellow Leaf Curl Virus (TYLCV) causes severe stunting, erect cupped yellow leaves, and failure to set fruit.",
        "causes": [
            "Virus transmitted by Bemisia tabaci whiteflies."
        ],
        "treatment": [
            "No chemical cure; remove infected plants immediately and control whitefly vectors with neem or systemic insecticides."
        ],
        "prevention": [
            "Use insect netting and yellow sticky traps to catch whiteflies."
        ]
    },
    "tomato-tomato-mosaic-virus": {
        "description": "Tomato mosaic virus causes light and dark green mottled mosaic patterns on leaves, leaf distortion, and stunted growth.",
        "causes": [
            "Mechanically transmitted via hands, pruning tools, and tobacco products."
        ],
        "treatment": [
            "Remove infected plants immediately. Disinfect tools with 10% bleach solution."
        ],
        "prevention": [
            "Wash hands thoroughly before handling plants, especially smokers."
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
            existing_disease = result.scalars().first()

            # Check if we have specific details mapped for this disease
            if slug in DISEASE_DETAILS:
                details = DISEASE_DETAILS[slug]
                description = details["description"]
                causes = details["causes"]
                treatment = details["treatment"]
                prevention = details["prevention"]
            else:
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

            if existing_disease:
                existing_disease.disease = human_name
                existing_disease.severity = severity
                existing_disease.description = description
                existing_disease.causes = causes
                existing_disease.treatment = treatment
                existing_disease.prevention = prevention
                existing_disease.cropType = crop
                skipped_existing += 1
                print(f"  UPDATED: {slug}")
                continue

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
