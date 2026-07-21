"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { resetPassword } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sprout, AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [token, setToken] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      await resetPassword(token, password)
      setSuccess("Password has been successfully reset. Redirecting to login...")
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (err: any) {
      setError(err.message || "Failed to reset password. Please check your token.")
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
            Set New Password
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Enter your reset token and your new password below.
          </p>
        </div>

        {error && (
          <div className="flex gap-2 p-3 bg-red-50 border border-red-200 dark:bg-red-950/20 dark:border-red-900/30 rounded-xl text-red-800 dark:text-red-400 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex gap-2 p-3 bg-green-50 border border-green-200 dark:bg-green-950/20 dark:border-green-900/30 rounded-xl text-green-800 dark:text-green-400 text-sm">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="token" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Reset Token
              </label>
              <Input
                id="token"
                name="token"
                type="text"
                required
                className="h-11 rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                New Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="h-11 rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Confirm New Password
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="h-11 rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading || !!success}
            className="w-full h-11 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg shadow-green-600/10 font-semibold text-base flex items-center justify-center gap-2"
          >
            {loading ? "Resetting..." : "Reset Password"}
            <ArrowRight className="h-5 w-5" />
          </Button>
          
          <div className="text-center mt-4">
            <Link href="/login" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
              Back to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
