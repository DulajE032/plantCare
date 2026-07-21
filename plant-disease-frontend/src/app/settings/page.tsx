"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Settings, Shield, Bell, Eye, Volume2 } from "lucide-react"

export default function SettingsPage() {
  const [theme, setTheme] = useState("light")
  const [notifications, setNotifications] = useState(true)
  const [backendUrl, setBackendUrl] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const activeTheme = document.documentElement.classList.contains("dark") ? "dark" : "light"
      setTheme(activeTheme)
      setBackendUrl(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000")
    }
  }, [])

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light"
    setTheme(nextTheme)
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  return (
    <div className="space-y-8 py-4 max-w-2xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
          <Settings className="h-7 w-7 text-green-600 dark:text-green-400" />
          <span>Settings</span>
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base">
          Manage your application preferences, appearance, and configurations.
        </p>
      </div>

      <Card className="border border-zinc-100 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900/50 rounded-2xl overflow-hidden">
        <CardContent className="p-6 divide-y divide-zinc-100 dark:divide-zinc-850 space-y-6">
          {/* Appearance setting */}
          <div className="flex items-center justify-between pb-6 pt-2">
            <div className="space-y-1">
              <h2 className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 text-base">
                <Eye className="h-5 w-5 text-green-600" />
                <span>Appearance</span>
              </h2>
              <p className="text-xs text-zinc-500">Toggle dark mode configuration for the interface</p>
            </div>
            <Button variant="outline" className="rounded-xl border-zinc-200 dark:border-zinc-800" onClick={toggleTheme}>
              {theme === "light" ? "Switch to Dark" : "Switch to Light"}
            </Button>
          </div>

          {/* Notifications setting */}
          <div className="flex items-center justify-between py-6">
            <div className="space-y-1">
              <h2 className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 text-base">
                <Bell className="h-5 w-5 text-green-600" />
                <span>Notifications</span>
              </h2>
              <p className="text-xs text-zinc-500">Receive alert warnings when disease is detected</p>
            </div>
            <Button
              variant={notifications ? "default" : "outline"}
              className="rounded-xl"
              onClick={() => setNotifications(!notifications)}
            >
              {notifications ? "Enabled" : "Disabled"}
            </Button>
          </div>

          {/* Backend Info setting */}
          <div className="py-6 space-y-3">
            <div className="space-y-1">
              <h2 className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 text-base">
                <Shield className="h-5 w-5 text-green-600" />
                <span>Backend URL Config</span>
              </h2>
              <p className="text-xs text-zinc-500">Target host url address of the PlantCare AI server</p>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-100 dark:border-zinc-850 text-xs font-mono text-zinc-600 dark:text-zinc-400">
              {backendUrl}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
