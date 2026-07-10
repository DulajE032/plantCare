import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function HistoryItemSkeleton() {
  return (
    <Card className="p-4 border border-zinc-100 dark:border-zinc-800 shadow-sm flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <Skeleton className="w-16 h-16 rounded-lg flex-shrink-0" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </Card>
  )
}
