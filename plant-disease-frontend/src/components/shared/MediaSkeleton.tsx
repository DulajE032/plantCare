import { Skeleton } from "@/components/ui/skeleton"

export function MediaSkeleton({ className }: { className?: string }) {
  return <Skeleton className={`w-full aspect-square rounded-lg ${className}`} />
}
