"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ScanLine } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SeverityBadge } from "@/components/result/SeverityBadge"
import { RecommendationPanel } from "@/components/result/RecommendationPanel"
import { ResultSkeleton } from "@/components/skeletons/ResultSkeleton"
import { getDiseaseBySlug } from "@/lib/api"
import { DiseaseRecommendation } from "@/lib/types"

interface DiseaseDetailPageProps {
  params: Promise<{ slug: string }>
}

export default function DiseaseDetailPage({ params }: DiseaseDetailPageProps) {
  const resolvedParams = use(params)
  const [loading, setLoading] = useState(true)
  const [disease, setDisease] = useState<DiseaseRecommendation | null>(null)

  useEffect(() => {
    async function loadDisease() {
      try {
        const data = await getDiseaseBySlug(resolvedParams.slug)
        setDisease(data)
      } catch (err) {
        console.error("Failed to load disease:", err)
      } finally {
        setLoading(false)
      }
    }

    loadDisease()
  }, [resolvedParams.slug])

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
        <p className="text-zinc-500">Disease details not found.</p>
        <Link href="/diseases">
          <Button>Back to Library</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 py-4">
      {/* Header Back Link */}
      <div>
        <Link href="/diseases" className="flex items-center gap-2 text-zinc-650 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 w-fit">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span className="font-semibold text-sm">Library Index</span>
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Sticky Image and Base info) */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-6">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-zinc-250/50 dark:border-zinc-800 shadow-md">
            <Image
              src={disease.imageUrl || "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=600"}
              alt={disease.disease}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 400px"
              priority
              unoptimized
            />
          </div>
          
          <Card className="border border-zinc-100 dark:border-zinc-800 p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{disease.cropType} Crop</span>
                <h1 className="text-2xl font-extrabold text-zinc-950 dark:text-zinc-50 leading-tight">{disease.disease}</h1>
              </div>
              <SeverityBadge severity={disease.severity} />
            </div>

            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-6">
              <Link href="/scan">
                <Button className="w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-green-650/15">
                  <ScanLine className="h-5 w-5" />
                  <span>Scan Your Plant Leaf</span>
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Right Column (Recommendations) */}
        <div className="lg:col-span-7">
          <div className="border border-zinc-100 dark:border-zinc-800 rounded-2xl p-6 bg-white dark:bg-zinc-900/50 shadow-sm space-y-6">
            <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <h2 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">Reference Guide & Treatment</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Full description, causes, and step-by-step guidance for agricultural management.</p>
            </div>
            <RecommendationPanel recommendation={disease} />
          </div>
        </div>
      </div>
    </div>
  )
}
