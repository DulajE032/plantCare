import { DiseaseRecommendation, ScanResult, HistoryItem } from "./types"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// Helper to get headers with JWT token
function getHeaders(extraHeaders: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = { ...extraHeaders }
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token")
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }
  }
  return headers
}

export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: getHeaders()
  })
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
    headers: getHeaders()
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
    headers: getHeaders()
  })
  if (!res.ok) {
    throw new Error("Failed to delete history item.")
  }
  return res.json()
}

export async function clearHistory(): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/history`, {
    method: "DELETE",
    headers: getHeaders()
  })
  if (!res.ok) {
    throw new Error("Failed to clear history.")
  }
  return res.json()
}

// User Authentication API
export async function loginUser(email: string, password: string): Promise<{ access_token: string }> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.detail || "Invalid login credentials")
  }
  const data = await res.json()
  if (typeof window !== "undefined") {
    localStorage.setItem("token", data.access_token)
  }
  return data
}

export async function registerUser(email: string, fullName: string, password: string): Promise<any> {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, full_name: fullName, password })
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.detail || "Registration failed")
  }
  return res.json()
}

export async function getProfile(): Promise<any> {
  return fetcher<any>("/api/auth/profile")
}

export async function forgotPassword(email: string): Promise<any> {
  const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.detail || "Failed to request password reset")
  }
  return res.json()
}

export async function resetPassword(token: string, newPassword: string): Promise<any> {
  const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, new_password: newPassword })
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.detail || "Failed to reset password")
  }
  return res.json()
}

// Admin APIs
export async function getAdminUsers(): Promise<any[]> {
  return fetcher<any[]>("/api/admin/users")
}

export async function getAdminReports(): Promise<any> {
  return fetcher<any>("/api/admin/reports")
}

export async function adminCreateDisease(disease: any): Promise<any> {
  const res = await fetch(`${API_BASE}/api/admin/diseases`, {
    method: "POST",
    headers: getHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(disease)
  })
  if (!res.ok) {
    throw new Error("Failed to create/update disease record.")
  }
  return res.json()
}

export async function adminDeleteDisease(id: string): Promise<any> {
  const res = await fetch(`${API_BASE}/api/admin/diseases/${id}`, {
    method: "DELETE",
    headers: getHeaders()
  })
  if (!res.ok) {
    throw new Error("Failed to delete disease record.")
  }
  return res.json()
}

// Articles APIs
export async function getArticles(): Promise<any[]> {
  return fetcher<any[]>("/api/articles")
}

export async function getArticleById(id: string): Promise<any> {
  return fetcher<any>(`/api/articles/${id}`)
}

export async function createArticle(title: string, content: string, author: string, tags: string[]): Promise<any> {
  const res = await fetch(`${API_BASE}/api/articles`, {
    method: "POST",
    headers: getHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ title, content, author, tags })
  })
  if (!res.ok) {
    throw new Error("Failed to create article.")
  }
  return res.json()
}

export async function updateArticle(id: string, title: string, content: string, author: string, tags: string[]): Promise<any> {
  const res = await fetch(`${API_BASE}/api/articles/${id}`, {
    method: "PUT",
    headers: getHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ title, content, author, tags })
  })
  if (!res.ok) {
    throw new Error("Failed to update article.")
  }
  return res.json()
}

export async function deleteArticle(id: string): Promise<any> {
  const res = await fetch(`${API_BASE}/api/articles/${id}`, {
    method: "DELETE",
    headers: getHeaders()
  })
  if (!res.ok) {
    throw new Error("Failed to delete article.")
  }
  return res.json()
}
