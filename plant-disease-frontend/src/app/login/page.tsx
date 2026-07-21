"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { loginUser } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sprout, AlertCircle, ArrowRight } from "lucide-react"

export default function LoginPage() {
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
      router.push("/profile")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Invalid email or password.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-8 rounded-2xl shadow-xl">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 text-green-600 dark:text-green-500 font-bold text-2xl">
            <Sprout className="h-8 w-8" />
            <span>PlantCare AI</span>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Sign in to your account
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Or{" "}
            <Link href="/register" className="font-semibold text-green-600 hover:text-green-500 dark:text-green-500">
              create a new account
            </Link>
          </p>
        </div>

        {error && (
          <div className="flex gap-2 p-3 bg-red-50 border border-red-200 dark:bg-red-950/20 dark:border-red-900/30 rounded-xl text-red-800 dark:text-red-400 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="h-11 rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Password
                </label>
                <Link href="/forgot-password" className="text-sm font-medium text-green-600 hover:text-green-500 dark:text-green-500">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="h-11 rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg shadow-green-600/10 font-semibold text-base flex items-center justify-center gap-2"
          >
            {loading ? "Signing in..." : "Sign In"}
            <ArrowRight className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  )
}
