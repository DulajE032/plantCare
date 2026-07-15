"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Clock, ArrowRight, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SeverityBadge } from "@/components/result/SeverityBadge"
import { EmptyState } from "@/components/shared/EmptyState"
import { HistoryItemSkeleton } from "@/components/skeletons/HistoryItemSkeleton"
import { getHistory } from "@/lib/api"
import { HistoryItem } from "@/lib/types"

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await getHistory()
        setHistory(data)
      } catch (err) {
        console.error("Failed to load history:", err)
        // Fallback: try localStorage
        const stored = localStorage.getItem("plant_history")
        if (stored) {
          setHistory(JSON.parse(stored))
        }
      } finally {
        setLoading(false)
      }
    }

    loadHistory()
  }, [])

  const deleteItem = (id: string, e: React.MouseEvent) => {
    e.preventDefault() // prevent navigating
    const updated = history.filter((item) => item.id !== id)
    setHistory(updated)
    localStorage.setItem("plant_history", JSON.stringify(updated))
  }

  const clearAll = () => {
    if (confirm("Are you sure you want to clear all scan history?")) {
      setHistory([])
      localStorage.removeItem("plant_history")
    }
  }

  const formatDate = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
            <Clock className="h-7 w-7 text-green-600 dark:text-green-400" />
            <span>Scan History</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base">
            Review your previously diagnosed crops and treatment plans.
          </p>
        </div>

        {history.length > 0 && !loading && (
          <Button variant="ghost" onClick={clearAll} className="text-red-500 hover:text-red-600 hover:bg-red-50/50 text-sm font-semibold rounded-xl">
            Clear All
          </Button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4 max-w-3xl">
          {Array.from({ length: 4 }).map((_, idx) => (
            <HistoryItemSkeleton key={idx} />
          ))}
        </div>
      ) : history.length > 0 ? (
        <div className="space-y-4 max-w-3xl">
          {history.map((item) => (
            <Link key={item.id} href={`/result/${item.diseaseName.toLowerCase().replace(/\s+/g, "-")}`}>
              <Card className="hover:shadow-md hover:border-zinc-200 dark:hover:border-zinc-700 transition-all border border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900/50">
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-850">
                      <img src={item.thumbnailUrl} alt={item.diseaseName} className="object-cover w-full h-full" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base leading-snug">{item.diseaseName}</h3>
                      <div className="flex items-center gap-2 text-xs text-zinc-400">
                        <span>Confidence: <span className="font-semibold text-zinc-655">{item.confidence}%</span></span>
                        <span>•</span>
                        <span>{formatDate(item.scannedAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <SeverityBadge severity={item.severity} />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-zinc-400 hover:text-red-500 rounded-xl"
                      onClick={(e) => deleteItem(item.id, e)}
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </Button>
                    <ArrowRight className="h-5 w-5 text-zinc-300 hidden sm:block" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-12">
          <EmptyState
            title="No scan history yet"
            description="Your diagnosed plants will appear here. Start by scanning your first crop leaf!"
          />
          <div className="mt-6 flex justify-center">
            <Link href="/scan">
              <Button className="bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold">
                Scan Plant Leaf
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
