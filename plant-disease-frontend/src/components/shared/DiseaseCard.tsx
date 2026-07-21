import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SeverityBadge } from "@/components/result/SeverityBadge"
import { DiseaseRecommendation } from "@/lib/types"

interface DiseaseCardProps {
  disease: DiseaseRecommendation
}

export function DiseaseCard({ disease }: DiseaseCardProps) {
  return (
    <Link href={`/diseases/${disease.slug}`} className="block group">
      <Card className="overflow-hidden h-full border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-zinc-200 dark:hover:border-zinc-700 transition-all rounded-2xl flex flex-col bg-white dark:bg-zinc-900/50">
        {/* Image wrapper */}
        <div className="relative aspect-video w-full overflow-hidden bg-zinc-50 dark:bg-zinc-950">
          {disease.imageUrl ? (
            <Image
              src={disease.imageUrl}
              alt={disease.disease}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-350 dark:text-zinc-700">No Image</div>
          )}
        </div>

        {/* Content */}
        <CardHeader className="p-4 pb-2 space-y-1">
          <div className="flex justify-between items-center gap-2">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{disease.cropType}</span>
            <SeverityBadge severity={disease.severity} />
          </div>
          <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 leading-snug group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
            {disease.disease}
          </h3>
        </CardHeader>

        <CardContent className="px-4 pb-4 pt-0 flex-grow">
          <p className="text-sm text-zinc-500 dark:text-zinc-450 line-clamp-2 leading-relaxed">
            {disease.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
