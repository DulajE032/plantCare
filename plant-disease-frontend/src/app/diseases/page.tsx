"use client"

import { useEffect, useState } from "react"
import { Search, Library } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DiseaseCard } from "@/components/shared/DiseaseCard"
import { EmptyState } from "@/components/shared/EmptyState"
import { DiseaseCardSkeleton } from "@/components/skeletons/DiseaseCardSkeleton"
import { mockDiseases } from "@/lib/mock-data"
import { DiseaseRecommendation } from "@/lib/types"

export default function DiseaseLibraryPage() {
  const [search, setSearch] = useState("")
  const [selectedCrop, setSelectedCrop] = useState("All")
  const [loading, setLoading] = useState(true)
  const [diseases, setDiseases] = useState<DiseaseRecommendation[]>([])

  useEffect(() => {
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      setDiseases(mockDiseases)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const crops = ["All", ...Array.from(new Set(mockDiseases.map((d) => d.cropType)))]

  const filteredDiseases = diseases.filter((d) => {
    const matchesSearch = d.disease.toLowerCase().includes(search.toLowerCase()) || 
                          d.description.toLowerCase().includes(search.toLowerCase())
    const matchesCrop = selectedCrop === "All" || d.cropType === selectedCrop
    return matchesSearch && matchesCrop
  })

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
          <Library className="h-7 w-7 text-green-600 dark:text-green-400" />
          <span>Disease Library</span>
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-md text-sm sm:text-base">
          Browse plant diseases, diagnostic guides, treatment options, and preventive strategies.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
          <Input
            type="search"
            placeholder="Search diseases or keywords..."
            className="pl-11 h-12 rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Crop filter chips */}
        <div className="flex flex-wrap gap-2 pt-1">
          {crops.map((crop) => (
            <Button
              key={crop}
              variant={selectedCrop === crop ? "default" : "outline"}
              onClick={() => setSelectedCrop(crop)}
              className={`rounded-full px-5 py-1.5 h-9 font-semibold text-xs transition-all ${
                selectedCrop === crop
                  ? "bg-green-600 hover:bg-green-700 text-white shadow-sm"
                  : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-650 hover:bg-zinc-50 dark:text-zinc-450 dark:hover:bg-zinc-850"
              }`}
            >
              {crop}
            </Button>
          ))}
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <DiseaseCardSkeleton key={idx} />
          ))}
        </div>
      ) : filteredDiseases.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDiseases.map((disease) => (
            <DiseaseCard key={disease.id} disease={disease} />
          ))}
        </div>
      ) : (
        <div className="py-12">
          <EmptyState
            title="No diseases found"
            description="Try adjusting your keywords or changing the selected crop filter."
          />
        </div>
      )}
    </div>
  )
}
