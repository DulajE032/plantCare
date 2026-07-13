import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function DiseaseCardSkeleton() {
  return (
    <Card className="overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-sm">
      <Skeleton className="w-full aspect-video" />
      <CardHeader className="p-4 pb-2">
        <Skeleton className="h-4 w-[70%]" />
        <Skeleton className="h-3 w-[40%] mt-2" />
      </CardHeader>
      <CardContent className="px-4 pb-3 pt-0">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-[90%] mt-2" />
      </CardContent>
      <CardFooter className="px-4 pb-4 pt-0 flex justify-between items-center">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-4 w-12" />
      </CardFooter>
    </Card>
  )
}
