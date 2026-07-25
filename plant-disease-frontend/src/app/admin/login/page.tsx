"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { loginUser, getProfile } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Shield, AlertCircle, ArrowRight } from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await loginUser(email, password)
      const profile = await getProfile()
      if (profile.role !== "admin") {
        localStorage.removeItem("token")
        setError("Access denied. This portal is reserved for administrators.")
        return
      }
      router.push("/admin")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Invalid administrator credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-zinc-950 border border-zinc-800 p-8 rounded-2xl shadow-2xl text-zinc-100">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 text-emerald-500 font-bold text-2xl">
            <Shield className="h-8 w-8 text-emerald-500" />
            <span>PlantCare Admin</span>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-50">
            Sign in to Admin Dashboard
          </h2>
          <p className="text-sm text-zinc-400">
            For farmers, please use the{" "}
            <Link href="/login" className="font-semibold text-emerald-400 hover:text-emerald-350">
              Farmer Login Portal
            </Link>
          </p>
        </div>

        {error && (
          <div className="flex gap-2 p-3 bg-red-950/40 border border-red-900/50 rounded-xl text-red-400 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-zinc-300 mb-1">
                Admin Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="h-11 rounded-xl border-zinc-800 bg-zinc-900 text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:ring-emerald-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-semibold text-zinc-300">
                  Password
                </label>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="h-11 rounded-xl border-zinc-800 bg-zinc-900 text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:ring-emerald-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-900/20 font-semibold text-base flex items-center justify-center gap-2"
          >
            {loading ? "Verifying..." : "Access Dashboard"}
            <ArrowRight className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  )
}
