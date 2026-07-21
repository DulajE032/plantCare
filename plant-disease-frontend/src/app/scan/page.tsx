"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ImageUploader } from "@/components/scan/ImageUploader"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Sprout, HelpCircle, CheckCircle2, ChevronRight, AlertCircle } from "lucide-react"
import { predictDisease } from "@/lib/api"

import { useEffect } from "react"

export default function ScanPage() {
  const router = useRouter()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [status, setStatus] = useState<"idle" | "selected" | "uploading">("idle")
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  // Listen to clipboard paste events (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return
      
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile()
          if (file) {
            handleImageSelected(file)
            break
          }
        }
      }
    }
    
    window.addEventListener("paste", handlePaste)
    return () => window.removeEventListener("paste", handlePaste)
  }, [])

  const handleImageSelected = (file: File) => {
    setSelectedFile(file)
    setStatus("selected")
    setError(null)
    setProgress(0)
  }

  const handleImageRemoved = () => {
    setSelectedFile(null)
    setStatus("idle")
    setError(null)
    setProgress(0)
  }

  const handleAnalyze = async () => {
    if (!selectedFile) return

    setStatus("uploading")
    setError(null)
    setProgress(10)

    // Simulate progress bar increase
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 10 : prev))
    }, 150)

    try {
      const result = await predictDisease(selectedFile)
      setProgress(100)
      clearInterval(interval)
      // Store the full result so the result page can display it
      sessionStorage.setItem("lastScanResult", JSON.stringify(result))
      router.push(`/result/${result.recommendation.slug}`)
    } catch (err) {
      clearInterval(interval)
      setProgress(0)
      setError("Failed to analyze image. Please make sure the backend server is running.")
      setStatus("selected")
    }
  }

  const tips = [
    {
      title: "Use good lighting",
      desc: "Avoid direct bright sunlight or deep shadows. Indirect daytime natural light is best for leaf detailing.",
    },
    {
      title: "Focus on the affected area",
      desc: "Make sure the camera is focused on the infected spots or discoloration. Keep the leaf centered and flat if possible.",
    },
    {
      title: "Include edge of healthy tissues",
      desc: "Showing the boundary where the healthy leaf meets the diseased portion helps the AI analyze lesion boundaries.",
    },
  ]

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-4">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-zinc-950 dark:text-zinc-50 flex items-center justify-center gap-2">
          <Sprout className="h-7 w-7 text-green-600 dark:text-green-400" />
          <span>Identify Plant Issue</span>
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto text-sm sm:text-base">
          Submit a high-quality picture of the diseased crop leaves to view recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Upload Column */}
        <div className="md:col-span-7 space-y-6">
          <ImageUploader
            onImageSelected={handleImageSelected}
            onImageRemoved={handleImageRemoved}
            status={status}
          />

          {status === "uploading" && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-zinc-500">
                <span>Uploading and Analyzing Image...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-green-650 h-full rounded-full transition-all duration-150" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="flex gap-2 p-3 bg-amber-50 border border-amber-250 dark:bg-amber-950/20 dark:border-amber-900/30 rounded-xl text-amber-800 dark:text-amber-400 text-sm">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Desktop Inline Action Button */}
          {selectedFile && (
            <div className="hidden md:block">
              <Button
                onClick={handleAnalyze}
                disabled={status === "uploading"}
                className="w-full h-14 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg font-semibold text-base flex items-center justify-center gap-2"
              >
                {status === "uploading" ? "Analyzing Crop Leaf..." : "Analyze Disease"}
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>

        {/* Tips Column */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-zinc-900 dark:text-zinc-100 text-base mb-4 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span>Scanning Tips</span>
            </h2>
            <Accordion type="single" collapsible className="w-full space-y-2" defaultValue="tip-0">
              {tips.map((tip, idx) => (
                <AccordionItem
                  key={idx}
                  value={`tip-${idx}`}
                  className="border border-zinc-100 dark:border-zinc-800 rounded-xl px-4 bg-zinc-50/30 dark:bg-zinc-950/20 overflow-hidden"
                >
                  <AccordionTrigger className="hover:no-underline py-3 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-650" />
                      <span>{tip.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed pb-3">
                    {tip.desc}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>

      {/* Mobile Fixed Bottom Submit Panel */}
      {selectedFile && (
        <div className="md:hidden fixed bottom-16 left-0 right-0 p-4 bg-white/95 dark:bg-zinc-950/95 border-t border-zinc-100 dark:border-zinc-805 backdrop-blur-md z-40">
          <Button
            onClick={handleAnalyze}
            disabled={status === "uploading"}
            className="w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            {status === "uploading" ? "Analyzing Crop Leaf..." : "Analyze Disease"}
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  )
}
