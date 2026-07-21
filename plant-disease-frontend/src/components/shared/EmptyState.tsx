import { Inbox } from "lucide-react"

interface EmptyStateProps {
  title: string
  description: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white/40 dark:bg-zinc-950/20 max-w-md mx-auto space-y-3">
      <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-full text-zinc-400">
        <Inbox className="h-8 w-8" />
      </div>
      <div className="space-y-1">
        <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base">{title}</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
