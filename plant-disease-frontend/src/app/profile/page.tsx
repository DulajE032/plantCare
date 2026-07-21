"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getProfile, getHistory } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { User, LogOut, Shield, History, Calendar, Mail } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      try {
        const userProfile = await getProfile()
        setProfile(userProfile)
        
        const userHistory = await getHistory()
        setHistory(userHistory)
      } catch (err) {
        console.error("Not authenticated:", err)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/login")
    router.refresh()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
          <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
          <div className="h-4 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
        </div>
      </div>
    )
  }

  if (!profile) return null

  return (
    <div className="space-y-8 py-4 max-w-4xl mx-auto">
      {/* Header Panel */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 rounded-2xl">
            <User className="h-10 w-10" />
          </div>
          <div className="space-y-1 text-center md:text-left">
            <h1 className="text-2xl font-extrabold text-zinc-950 dark:text-zinc-50">{profile.full_name}</h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-500 dark:text-zinc-400 justify-center md:justify-start">
              <span className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {profile.email}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 capitalize">
                <Shield className="h-4 w-4 text-green-600" />
                {profile.role}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {profile.role === "admin" && (
            <Link href="/admin">
              <Button variant="outline" className="border-zinc-200 dark:border-zinc-800 rounded-xl font-semibold">
                Admin Panel
              </Button>
            </Link>
          )}
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-red-500 hover:text-red-650 hover:bg-red-50/50 rounded-xl font-semibold flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Log Out</span>
          </Button>
        </div>
      </div>

      {/* Grid details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-zinc-100 dark:border-zinc-800 shadow-sm col-span-1">
          <CardContent className="p-6 space-y-4">
            <h2 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-600" />
              <span>Details</span>
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-zinc-50 dark:border-zinc-850 pb-2">
                <span className="text-zinc-500">Joined Since</span>
                <span className="font-medium text-zinc-800 dark:text-zinc-200">
                  {new Date(profile.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between border-b border-zinc-50 dark:border-zinc-850 pb-2">
                <span className="text-zinc-500">Account Role</span>
                <span className="font-medium text-zinc-800 dark:text-zinc-200 capitalize">{profile.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Total Scans</span>
                <span className="font-bold text-green-600 dark:text-green-400">{history.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Scans Column */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-green-600" />
            <h2 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">Your Recent Scans</h2>
          </div>

          {history.length > 0 ? (
            <div className="space-y-3">
              {history.slice(0, 5).map((item) => (
                <Link key={item.id} href={`/result/${item.diseaseName.toLowerCase().replace(/\s+/g, "-")}`}>
                  <Card className="hover:shadow-md transition-all border border-zinc-100 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900/50">
                    <CardContent className="p-4 flex items-center gap-4 justify-between">
                      <div className="flex items-center gap-3">
                        <img src={item.thumbnailUrl} alt={item.diseaseName} className="w-12 h-12 object-cover rounded-lg border border-zinc-100" />
                        <div>
                          <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm leading-snug">{item.diseaseName}</h3>
                          <span className="text-xs text-zinc-400">
                            Confidence: {item.confidence}% • {new Date(item.scannedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
                        {item.severity}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
              {history.length > 5 && (
                <div className="text-center pt-2">
                  <Link href="/history">
                    <Button variant="ghost" className="text-green-600 font-semibold rounded-xl">
                      View All History
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <Card className="border border-zinc-100 dark:border-zinc-800 p-8 text-center bg-white dark:bg-zinc-900/50 rounded-xl">
              <p className="text-zinc-500 text-sm mb-4">You haven't scanned any plant leaves yet.</p>
              <Link href="/scan">
                <Button className="bg-green-600 hover:bg-green-700 text-white rounded-xl">
                  Scan Now
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
