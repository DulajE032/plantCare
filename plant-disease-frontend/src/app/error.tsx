"use client"

import { useEffect } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Uncaught frontend error:", error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 space-y-6">
      <div className="p-4 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-full">
        <AlertTriangle className="h-12 w-12" />
      </div>
      
      <div className="space-y-2 max-w-md">
        <h1 className="text-2xl font-extrabold text-zinc-950 dark:text-zinc-50 tracking-tight">
          Something went wrong
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          An unexpected error occurred while loading this page. Please try refreshing or restarting the application.
        </p>
        {error.message && (
          <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-left text-xs font-mono text-zinc-650 dark:text-zinc-400 overflow-auto max-h-32">
            {error.message}
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <Button
          onClick={() => reset()}
          className="bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold flex items-center gap-2 h-11 px-6 shadow-md"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Try Again</span>
        </Button>
        <Button
          variant="outline"
          onClick={() => window.location.href = "/"}
          className="border-zinc-200 dark:border-zinc-800 rounded-xl font-semibold h-11 px-6"
        >
          Go Home
        </Button>
      </div>
    </div>
  )
}
