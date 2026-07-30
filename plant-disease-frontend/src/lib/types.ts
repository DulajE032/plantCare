export interface DiseaseRecommendation {
  id: string;
  disease: string;
  slug: string;
  confidence: number;
  severity: "low" | "moderate" | "severe";
  description: string;
  causes: string[];
  treatment: string[];
  prevention: string[];
  cropType: string;
  imageUrl?: string;
}

export interface AlternativePrediction {
  slug: string;
  disease: string;
  confidence: number;
  severity: "low" | "moderate" | "severe";
  cropType: string;
}

export interface ScanResult {
  id: string;
  imageUrl: string;
  recommendation: DiseaseRecommendation;
  alternatives: AlternativePrediction[];
  scannedAt: string;
}

export interface HistoryItem {
  id: string;
  thumbnailUrl: string;
  diseaseName: string;
  confidence: number;
  severity: "low" | "moderate" | "severe";
  scannedAt: string;
}
