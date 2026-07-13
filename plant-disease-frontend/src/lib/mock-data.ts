import { DiseaseRecommendation, ScanResult, HistoryItem } from "./types"

export const mockDiseases: DiseaseRecommendation[] = [
  {
    id: "tomato-late-blight",
    disease: "Tomato Late Blight",
    slug: "tomato-late-blight",
    confidence: 94,
    severity: "severe",
    description: "Late blight is a highly destructive disease of tomatoes and potatoes caused by the oomycete Phytophthora infestans. It thrives in cool, wet weather and can rapidly destroy entire crops if left untreated.",
    causes: [
      "Infection by the water mold pathogen Phytophthora infestans.",
      "Cool, wet weather conditions (high humidity and temperatures between 15-22°C).",
      "Spore transmission via wind currents or water splashes."
    ],
    treatment: [
      "Remove and destroy infected plant parts immediately. Do not compost them.",
      "Apply protective copper-based fungicides or chlorothalonil according to label instructions.",
      "Improve air circulation around plants by pruning lower leaves and staking vines."
    ],
    prevention: [
      "Plant certified disease-free seeds and resistant cultivars.",
      "Avoid overhead watering; use drip irrigation to keep foliage dry.",
      "Practice crop rotation, avoiding planting solanaceous crops (tomatoes, potatoes, peppers) in the same soil for at least 3 years."
    ],
    cropType: "Tomato",
    imageUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "potato-early-blight",
    disease: "Potato Early Blight",
    slug: "potato-early-blight",
    confidence: 88,
    severity: "moderate",
    description: "Early blight is caused by the fungus Alternaria solani. It manifests as dark, concentric 'target' spots on older leaves, eventually leading to leaf drop and reduced tuber yield.",
    causes: [
      "Fungal pathogen Alternaria solani surviving in crop debris.",
      "Alternating wet and dry conditions on foliage.",
      "Nutrient-deficient or stressed plants are more susceptible."
    ],
    treatment: [
      "Apply appropriate fungicides (such as mancozeb or azoxystrobin) at first sign of infection.",
      "Remove heavily spotted lower foliage to prevent upward spread.",
      "Maintain optimal soil fertility with balanced nitrogen and potassium levels."
    ],
    prevention: [
      "Ensure proper spacing to promote rapid foliage drying.",
      "Practice 2-year crop rotation with non-host crops.",
      "Clean up all crop residue at the end of the harvest season."
    ],
    cropType: "Potato",
    imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "grape-black-rot",
    disease: "Grape Black Rot",
    slug: "grape-black-rot",
    confidence: 45, // low confidence sample
    severity: "moderate",
    description: "Black rot is caused by the fungus Guignardia bidwellii. It infects all green parts of the vine, causing red-brown leaf spots and shriveling grapes into hard, black mummies.",
    causes: [
      "Fungal spores overwintering in mummified berries and cane lesions.",
      "Warm, wet spring weather promoting spore release.",
      "Inadequate pruning or dense vine canopy retaining moisture."
    ],
    treatment: [
      "Prune out diseased canes and remove mummified berries from vines.",
      "Apply fungicides containing myclobutanil or mancozeb from bud break until bloom.",
      "Remove wild grapevines in the vicinity that could harbor the fungus."
    ],
    prevention: [
      "Choose a planting site with full sun and excellent air drainage.",
      "Keep vines trained on trellis systems and prune regularly to maximize light and airflow.",
      "Keep the ground clean beneath vines, cultivating or mulching to bury leaf debris."
    ],
    cropType: "Grape",
    imageUrl: "https://images.unsplash.com/photo-1533604179065-3bfe9505967b?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "corn-common-rust",
    disease: "Corn Common Rust",
    slug: "corn-common-rust",
    confidence: 91,
    severity: "low",
    description: "Common rust is caused by the fungus Puccinia sorghi. It causes powdery, cinnamon-brown pustules on both upper and lower leaf surfaces. While visually alarming, it rarely causes severe yield loss in field corn.",
    causes: [
      "Spares carried by wind from southern overwintering regions.",
      "Cool temperatures (16-23°C) and high relative humidity/dew."
    ],
    treatment: [
      "Fungicide treatment is rarely economical for field corn, but may be used on sweet corn or seed production fields if spotted early.",
      "Ensure balanced soil fertilization to support overall plant vigor."
    ],
    prevention: [
      "Plant rust-resistant corn hybrids (the most effective defense).",
      "Manage planting dates to avoid cool, damp windows during early growth stages."
    ],
    cropType: "Corn",
    imageUrl: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=800"
  }
]

export const mockScans: ScanResult[] = [
  {
    id: "scan-1",
    imageUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=800",
    recommendation: mockDiseases[0],
    scannedAt: new Date(Date.now() - 3600000 * 24).toISOString() // 1 day ago
  },
  {
    id: "scan-2",
    imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=800",
    recommendation: mockDiseases[1],
    scannedAt: new Date(Date.now() - 3600000 * 48).toISOString() // 2 days ago
  }
]

export const mockHistory: HistoryItem[] = mockScans.map(scan => ({
  id: scan.id,
  thumbnailUrl: scan.imageUrl,
  diseaseName: scan.recommendation.disease,
  confidence: scan.recommendation.confidence,
  severity: scan.recommendation.severity,
  scannedAt: scan.scannedAt
}))
