import { AlertCircle, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 border border-red-100 dark:border-red-950/30 rounded-2xl bg-red-50/30 dark:bg-red-950/10 max-w-md mx-auto space-y-4 text-center">
      <div className="flex items-center gap-2.5 text-red-650 dark:text-red-405">
        <AlertCircle className="h-6 w-6 shrink-0" />
        <span className="font-bold text-sm">Operation Failed</span>
      </div>
      <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
        {message || "An error occurred while connecting to the server. Please check your connection and try again."}
      </p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          size="sm"
          className="rounded-xl border-red-200 hover:bg-red-50 hover:text-red-750 dark:border-red-900/40 dark:hover:bg-red-950/20 dark:hover:text-red-400 font-semibold flex items-center gap-1.5"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Try Again</span>
        </Button>
      )}
    </div>
  )
}
