"use client"

import { useEffect, useState } from "react"

interface ConfidenceBarProps {
  confidence: number
}

export function ConfidenceBar({ confidence }: ConfidenceBarProps) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    // Animate fill on mount
    const timer = setTimeout(() => setWidth(confidence), 100)
    return () => clearTimeout(timer)
  }, [confidence])

  const getBarColor = (val: number) => {
    if (val >= 80) return "bg-green-500 shadow-[0_0_8px_#22c55e/30]"
    if (val >= 60) return "bg-amber-500 shadow-[0_0_8px_#f59e0b/30]"
    return "bg-rose-500 shadow-[0_0_8px_#f43f5e/30]"
  }

  const getTextColor = (val: number) => {
    if (val >= 80) return "text-green-600 dark:text-green-400"
    if (val >= 60) return "text-amber-600 dark:text-amber-400"
    return "text-rose-600 dark:text-rose-400"
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm font-semibold">
        <span className="text-zinc-500 dark:text-zinc-400">Diagnosis Confidence</span>
        <span className={`${getTextColor(confidence)} text-base font-extrabold`}>{confidence}%</span>
      </div>
      <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-3 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${getBarColor(confidence)}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  )
}
