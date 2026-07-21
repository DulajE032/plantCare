"use client"

import { useEffect, useState } from "react"
import { WifiOff } from "lucide-react"

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsOffline(!navigator.onLine)

      const handleOnline = () => setIsOffline(false)
      const handleOffline = () => setIsOffline(true)

      window.addEventListener("online", handleOnline)
      window.addEventListener("offline", handleOffline)

      return () => {
        window.removeEventListener("online", handleOnline)
        window.removeEventListener("offline", handleOffline)
      }
    }
  }, [])

  if (!isOffline) return null

  return (
    <div className="bg-red-600 text-white text-xs font-semibold py-2 px-4 flex items-center justify-center gap-2 animate-slide-in">
      <WifiOff className="h-4 w-4 animate-pulse" />
      <span>You are currently offline. Some features might not work properly.</span>
    </div>
  )
}
