"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Share2, RefreshCw, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ConfidenceBar } from "@/components/result/ConfidenceBar"
import { SeverityBadge } from "@/components/result/SeverityBadge"
import { RecommendationPanel } from "@/components/result/RecommendationPanel"
import { ResultSkeleton } from "@/components/skeletons/ResultSkeleton"
import { getDiseaseBySlug } from "@/lib/api"
import { AlternativePrediction, DiseaseRecommendation, ScanResult } from "@/lib/types"

interface ResultPageProps {
  params: Promise<{ id: string }>
}

export default function ResultPage({ params }: ResultPageProps) {
  const router = useRouter()
  const resolvedParams = use(params)
  const [loading, setLoading] = useState(true)
  const [disease, setDisease] = useState<DiseaseRecommendation | null>(null)
  const [scanImageUrl, setScanImageUrl] = useState<string | null>(null)
  const [alternatives, setAlternatives] = useState<AlternativePrediction[]>([])
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function loadResult() {
      try {
        // 1. Try to get the full scan result from sessionStorage (set by scan page)
        const stored = sessionStorage.getItem("lastScanResult")
        if (stored) {
          const scanResult: ScanResult = JSON.parse(stored)
          setDisease(scanResult.recommendation)
          setScanImageUrl(scanResult.imageUrl)
          if (scanResult.alternatives) {
            setAlternatives(scanResult.alternatives)
          }
          setLoading(false)
          return
        }

        // 2. Fallback: fetch disease info from backend by slug
        const data = await getDiseaseBySlug(resolvedParams.id)
        setDisease(data)
      } catch (err) {
        console.error("Failed to load result:", err)
      } finally {
        setLoading(false)
      }
    }

    loadResult()
  }, [resolvedParams.id])

  const handleSave = () => {
    if (!disease) return
    
    // Save to localStorage history
    const history = JSON.parse(localStorage.getItem("plant_history") || "[]")
    const exists = history.some((item: any) => item.id === disease.id)
    
    if (!exists) {
      const newItem = {
        id: `scan-${Date.now()}`,
        thumbnailUrl: disease.imageUrl || "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=200",
        diseaseName: disease.disease,
        confidence: disease.confidence,
        severity: disease.severity,
        scannedAt: new Date().toISOString()
      }
      localStorage.setItem("plant_history", JSON.stringify([newItem, ...history]))
    }
    setSaved(true)
  }

  const handleShare = async () => {
    if (!disease) return
    const shareData = {
      title: `Plant Disease Diagnosis - ${disease.disease}`,
      text: `My plant was diagnosed with ${disease.disease} (${disease.confidence}% confidence). Here is the treatment recommendation.`,
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(window.location.href)
        alert("Link copied to clipboard!")
      }
    } catch (err) {
      console.error("Error sharing:", err)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 py-4">
        <div className="flex items-center gap-2 mb-2">
          <Button variant="ghost" size="icon" disabled className="rounded-xl">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-md animate-pulse" />
        </div>
        <ResultSkeleton />
      </div>
    )
  }

  if (!disease) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-zinc-500">Diagnosis result not found.</p>
        <Link href="/scan">
          <Button>Back to Scan</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 py-4">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <Link href="/scan" className="flex items-center gap-2 text-zinc-650 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span className="font-semibold text-sm">New Scan</span>
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Sticky Image and Base info) */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-6">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-zinc-250/50 dark:border-zinc-800 shadow-md">
            {(scanImageUrl || disease.imageUrl) ? (
              <Image
                src={scanImageUrl || disease.imageUrl || ""}
                alt={disease.disease}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 400px"
                priority
                unoptimized
              />
            ) : (
              <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                <span className="text-zinc-400 text-sm">No image available</span>
              </div>
            )}
          </div>
          
          <Card className="border border-zinc-100 dark:border-zinc-800 p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{disease.cropType} Crop</span>
                <h1 className="text-2xl font-extrabold text-zinc-950 dark:text-zinc-50 leading-tight">{disease.disease}</h1>
              </div>
              <SeverityBadge severity={disease.severity} />
            </div>

            {disease.disease.toLowerCase().includes("healthy") && (
              <div className="p-4 bg-green-50 border border-green-200 dark:bg-green-950/30 dark:border-green-900/30 rounded-xl text-green-800 dark:text-green-300 text-sm font-semibold flex items-center gap-2">
                <span>✅ Your plant is healthy! No diseases detected.</span>
              </div>
            )}

            <ConfidenceBar confidence={disease.confidence} />

            {disease.confidence !== undefined && disease.confidence < 60 && (
              <div className="p-4 bg-amber-50 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-900/30 rounded-xl text-amber-900 dark:text-amber-300 text-sm font-semibold flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                <span>Uncertain Diagnosis (&lt; 60% confidence). Please take a clearer photo under good lighting.</span>
              </div>
            )}

            {/* Actions Row */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button
                variant={saved ? "secondary" : "outline"}
                className={`rounded-xl h-11 font-semibold flex items-center justify-center gap-2 border-zinc-200 dark:border-zinc-800`}
                onClick={handleSave}
              >
                <Save className={`h-4 w-4 ${saved ? "fill-green-600 text-green-600" : ""}`} />
                <span>{saved ? "Saved" : "Save Result"}</span>
              </Button>
              <Button
                variant="outline"
                className="rounded-xl h-11 font-semibold flex items-center justify-center gap-2 border-zinc-200 dark:border-zinc-800"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </Button>
            </div>
            <div className="flex gap-2">
              <Link href="/scan" className="flex-1">
                <Button className="w-full rounded-xl h-11 bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center justify-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  <span>Scan Another</span>
                </Button>
              </Link>
              <Button
                variant="outline"
                className="rounded-xl h-11 font-semibold border-zinc-200 dark:border-zinc-800 px-4"
                onClick={() => window.print()}
                title="Download PDF Report"
              >
                <span>Export PDF</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl text-zinc-400 hover:text-red-500"
                onClick={() => alert("Feedback submitted! Thank you.")}
                title="Report Incorrect Result"
              >
                <AlertTriangle className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column (Recommendations) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="border border-zinc-100 dark:border-zinc-800 rounded-2xl p-6 bg-white dark:bg-zinc-900/50 shadow-sm space-y-6">
            <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <h2 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">Diagnosis Results & Guidance</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Please review the recommended action plan below.</p>
            </div>
            <RecommendationPanel recommendation={disease} />
          </div>

          {/* Alternative Diagnoses */}
          {alternatives.length > 0 && (
            <div className="border border-zinc-100 dark:border-zinc-800 rounded-2xl p-6 bg-white dark:bg-zinc-900/50 shadow-sm space-y-4">
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Other Possible Diagnoses</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">The AI also considered these alternatives. Tap to view details.</p>
              </div>
              <div className="space-y-3">
                {alternatives.map((alt) => (
                  <Link key={alt.slug} href={`/diseases/${alt.slug}`}>
                    <div className="flex items-center justify-between p-4 border border-zinc-100 dark:border-zinc-800 rounded-xl hover:shadow-sm hover:border-zinc-200 dark:hover:border-zinc-700 transition-all bg-zinc-50/50 dark:bg-zinc-950/30">
                      <div className="space-y-0.5">
                        <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{alt.disease}</h4>
                        <span className="text-xs text-zinc-400">{alt.cropType} Crop</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-bold ${
                          alt.confidence >= 20 ? 'text-amber-600 dark:text-amber-400' : 'text-zinc-400'
                        }`}>
                          {alt.confidence}%
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                          alt.severity === 'severe' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400' :
                          alt.severity === 'moderate' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400' :
                          'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400'
                        }`}>
                          {alt.severity}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
