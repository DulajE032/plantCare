"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Camera, Brain, ClipboardCheck, Leaf, Sparkles, CloudSun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import useSWR from "swr"
import { RecommendationPanel } from "@/components/result/RecommendationPanel"
import { mockDiseases } from "@/lib/mock-data"
import { getDiseases } from "@/lib/api"

export default function Home() {
  const { data: diseases } = useSWR("/diseases", () => getDiseases(), { revalidateOnFocus: false })
  const sampleDisease = (diseases && diseases.length > 0) 
    ? { ...diseases[0], confidence: 94 } // Add mock confidence for preview
    : mockDiseases[0] // Tomato Late Blight fallback

  const steps = [
    {
      icon: Camera,
      title: "Upload a Photo",
      desc: "Take a picture of the infected plant leaf using your phone or upload an existing image from your gallery.",
      color: "text-blue-500 bg-blue-50 dark:bg-blue-950/30",
    },
    {
      icon: Brain,
      title: "AI Analyzes Image",
      desc: "Our deep learning models scan the image instantly to recognize patterns of disease with high confidence.",
      color: "text-purple-500 bg-purple-50 dark:bg-purple-950/30",
    },
    {
      icon: ClipboardCheck,
      title: "Get Recommendations",
      desc: "Receive actionable steps, including chemical & organic treatments, prevention plans, and common causes.",
      color: "text-green-500 bg-green-50 dark:bg-green-950/30",
    },
  ]

  const popularChips = [
    { name: "Tomato Late Blight", slug: "tomato-late-blight" },
    { name: "Potato Early Blight", slug: "potato-early-blight" },
    { name: "Corn Common Rust", slug: "corn-common-rust" },
    { name: "Grape Black Rot", slug: "grape-black-rot" },
  ]

  return (
    <div className="space-y-20 pb-12">
      {/* Weather Alert Widget Banner */}
      <div className="p-4 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border border-amber-200/50 dark:border-amber-900/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl">
            <CloudSun className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">High Humidity Alert • Disease Risk Warning</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Current damp weather conditions increase fungal spore spread (Late Blight & Powdery Mildew).</p>
          </div>
        </div>
        <Link href="/scan">
          <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold whitespace-nowrap">
            Check Crop Health
          </Button>
        </Link>
      </div>

      {/* 1. Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-4 lg:pt-10">
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <Badge className="bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900/40 px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Next-Gen Crop Protection</span>
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 leading-tight">
            Identify Plant Diseases <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">Instantly</span>
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto lg:mx-0">
            Upload a photo of your crop to get an AI-powered diagnosis, confidence assessment, and customized treatment recommendations in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
            <Link href="/scan">
              <Button size="lg" className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg shadow-green-600/20 px-8 py-6 text-base font-semibold group transition-all">
                <span>Scan Your Plant</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/diseases">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-zinc-200 dark:border-zinc-800 rounded-xl px-8 py-6 text-base font-semibold">
                Browse Library
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Graphic Card */}
        <div className="lg:col-span-5 relative flex justify-center">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-green-500 to-emerald-400 opacity-20 blur-2xl dark:opacity-30"></div>
          <div className="relative border border-zinc-100 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-xl w-full max-w-md">
            <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center border border-zinc-100 dark:border-zinc-850">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              {/* Dynamic Scanning Line Simulation */}
              <div className="absolute inset-x-0 top-0 h-0.5 bg-green-500 shadow-[0_0_10px_#22c55e] animate-[bounce_3s_infinite]"></div>
              <Leaf className="h-20 w-20 text-green-500/80 dark:text-green-400/80 animate-pulse" />
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Scanning Leaf Area...</span>
                <Badge variant="outline" className="text-green-600 dark:text-green-400 bg-green-50/50 dark:bg-green-950/20 border-green-200/50">Active</Badge>
              </div>
              <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full rounded-full w-[80%] animate-[pulse_2s_infinite]"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. How It Works Section */}
      <section className="space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-zinc-950 dark:text-zinc-50">How It Works</h2>
          <p className="text-zinc-500 dark:text-zinc-400">Diagnosis and recommendation in 3 simple steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <Card key={idx} className="border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-green-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <CardContent className="p-6 space-y-4">
                  <div className={`p-3 rounded-xl w-fit ${step.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{step.title}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{step.desc}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* 3. Sample Result Preview (Core Feature) */}
      <section className="space-y-8 bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-850 p-8 rounded-2xl">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <Badge className="bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">Live Preview</Badge>
          <h2 className="text-3xl font-bold text-zinc-950 dark:text-zinc-50">See a Diagnosis Output</h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            This is what you get after scanning a crop. Actionable treatment advice is compiled instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
          {/* Mock Left Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-zinc-200/60 dark:border-zinc-800 shadow-md">
              <Image
                src={sampleDisease.imageUrl || ""}
                alt="Late Blight leaf sample"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>
            <Card className="border border-zinc-100 dark:border-zinc-800 p-6 shadow-sm">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-xl text-zinc-900 dark:text-zinc-100">{sampleDisease.disease}</h3>
                  <Badge variant="destructive" className="bg-red-500 hover:bg-red-600 text-white capitalize rounded-full px-3">
                    {sampleDisease.severity}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500 dark:text-zinc-450 font-medium">Confidence Score</span>
                    <span className="text-green-600 dark:text-green-400 font-bold">{sampleDisease.confidence}%</span>
                  </div>
                  <div className="w-full bg-zinc-100 dark:bg-zinc-850 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full rounded-full" style={{ width: `${sampleDisease.confidence}%` }}></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Real Reusable Panel Right Column */}
          <div className="lg:col-span-7">
            <RecommendationPanel recommendation={sampleDisease} />
          </div>
        </div>
      </section>

      {/* 4. Disease Chips Row */}
      <section className="text-center space-y-6">
        <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">Supported Disease Library Details</h3>
        <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto px-4">
          {popularChips.map((chip, idx) => (
            <Link key={idx} href={`/diseases/${chip.slug}`}>
              <Badge variant="secondary" className="px-4 py-2 text-sm rounded-full bg-white dark:bg-zinc-900 hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-950/20 dark:hover:text-green-450 border border-zinc-200 dark:border-zinc-850 cursor-pointer shadow-sm transition-all">
                {chip.name}
              </Badge>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Footer CTA */}
      <section className="relative rounded-2xl bg-gradient-to-tr from-green-900 to-emerald-800 dark:from-green-950 dark:to-emerald-900 text-white p-8 md:p-12 overflow-hidden text-center shadow-lg">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>
        <div className="relative max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold">Ready to Protect Your Crops?</h2>
          <p className="text-green-100 max-w-md mx-auto text-sm md:text-base leading-relaxed">
            Get instant, deep analysis of plant diseases using our modern, accurate AI vision engine.
          </p>
          <div className="pt-2">
            <Link href="/scan">
              <Button size="lg" className="bg-white hover:bg-green-50 text-green-900 font-semibold px-8 py-5 rounded-xl shadow-lg">
                Scan Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
