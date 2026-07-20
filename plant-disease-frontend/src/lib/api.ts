import { DiseaseRecommendation, ScanResult, HistoryItem } from "./types"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`)
  if (!res.ok) {
    throw new Error(`API error: ${res.statusText}`)
  }
  return res.json() as Promise<T>
}

export async function predictDisease(image: File): Promise<ScanResult> {
  const formData = new FormData()
  formData.append("file", image)

  const res = await fetch(`${API_BASE}/predict`, {
    method: "POST",
    body: formData,
  })

  if (!res.ok) {
    throw new Error("Failed to analyze image. Please try again.")
  }

  return res.json() as Promise<ScanResult>
}

export async function getDiseases(): Promise<DiseaseRecommendation[]> {
  return fetcher<DiseaseRecommendation[]>("/diseases")
}

export async function getDiseaseBySlug(slug: string): Promise<DiseaseRecommendation> {
  return fetcher<DiseaseRecommendation>(`/diseases/${slug}`)
}

export async function getHistory(): Promise<HistoryItem[]> {
  return fetcher<HistoryItem[]>("/history")
}

export async function deleteHistoryItem(id: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/history/${id}`, {
    method: "DELETE",
  })
  if (!res.ok) {
    throw new Error("Failed to delete history item.")
  }
  return res.json()
}

export async function clearHistory(): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/history`, {
    method: "DELETE",
  })
  if (!res.ok) {
    throw new Error("Failed to clear history.")
  }
  return res.json()
}
