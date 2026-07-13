import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ResultSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Image & Confidence */}
      <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-6">
        <Card className="overflow-hidden border-none shadow-none bg-transparent">
          <Skeleton className="w-full aspect-square rounded-2xl" />
        </Card>
        <Card className="border border-zinc-100 dark:border-zinc-800 p-6 space-y-4 shadow-sm">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-6 w-12" />
            </div>
            <Skeleton className="h-3 w-full rounded-full" />
          </div>
          <div className="flex items-center space-y-1">
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </Card>
      </div>

      {/* Right Column: Recommendations */}
      <div className="lg:col-span-7 space-y-6">
        <Card className="border border-zinc-100 dark:border-zinc-800 shadow-sm p-6 space-y-6">
          <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>

          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border border-zinc-100 dark:border-zinc-800 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-4" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-[90%]" />
                  <Skeleton className="h-3 w-[75%]" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
