"use client"

import { DiseaseRecommendation } from "@/lib/types"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { AlertCircle, CheckCircle, Info, ShieldAlert } from "lucide-react"

interface RecommendationPanelProps {
  recommendation: DiseaseRecommendation
  showConfidenceWarning?: boolean
}

export function RecommendationPanel({ recommendation, showConfidenceWarning = false }: RecommendationPanelProps) {
  const warningNeeded = showConfidenceWarning || (recommendation.confidence !== undefined && recommendation.confidence < 60)

  return (
    <div className="space-y-6">
      {/* Confidence Warning Banner */}
      {warningNeeded && (
        <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/30 rounded-xl text-amber-800 dark:text-amber-400">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-semibold">Low confidence diagnosis.</span> The AI is less than 60% confident in this result. Please review carefully; recommendations may not fully apply.
          </div>
        </div>
      )}

      {/* Accordions */}
      <Accordion type="multiple" className="w-full space-y-4" defaultValue={["description", "treatment"]}>
        {/* 1. Description */}
        <AccordionItem value="description" className="border border-zinc-100 dark:border-zinc-800 rounded-xl px-4 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
          <AccordionTrigger className="hover:no-underline py-4 text-zinc-900 dark:text-zinc-100 font-semibold flex gap-2.5 items-center">
            <Info className="h-5 w-5 text-blue-500 shrink-0" />
            <span>Disease Description</span>
          </AccordionTrigger>
          <AccordionContent className="text-zinc-600 dark:text-zinc-300 leading-relaxed pb-4">
            {recommendation.description}
          </AccordionContent>
        </AccordionItem>

        {/* 2. Causes */}
        {recommendation.causes && recommendation.causes.length > 0 && (
          <AccordionItem value="causes" className="border border-zinc-100 dark:border-zinc-800 rounded-xl px-4 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
            <AccordionTrigger className="hover:no-underline py-4 text-zinc-900 dark:text-zinc-100 font-semibold flex gap-2.5 items-center">
              <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0" />
              <span>Common Causes</span>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <ul className="list-disc pl-5 space-y-2 text-zinc-600 dark:text-zinc-300">
                {recommendation.causes.map((cause, index) => (
                  <li key={index} className="leading-relaxed">{cause}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* 3. Treatment */}
        {recommendation.treatment && recommendation.treatment.length > 0 && (
          <AccordionItem value="treatment" className="border border-zinc-100 dark:border-zinc-800 rounded-xl px-4 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
            <AccordionTrigger className="hover:no-underline py-4 text-zinc-900 dark:text-zinc-100 font-semibold flex gap-2.5 items-center">
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
              <span>Actionable Treatment Steps</span>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <ol className="list-decimal pl-5 space-y-3 text-zinc-600 dark:text-zinc-300">
                {recommendation.treatment.map((step, index) => (
                  <li key={index} className="leading-relaxed pl-1">
                    <span className="font-medium text-zinc-800 dark:text-zinc-200">{step.split(" - ")[0]}</span>
                    {step.includes(" - ") ? ` - ${step.split(" - ").slice(1).join(" - ")}` : step}
                  </li>
                ))}
              </ol>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* 4. Prevention */}
        {recommendation.prevention && recommendation.prevention.length > 0 && (
          <AccordionItem value="prevention" className="border border-zinc-100 dark:border-zinc-800 rounded-xl px-4 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
            <AccordionTrigger className="hover:no-underline py-4 text-zinc-900 dark:text-zinc-100 font-semibold flex gap-2.5 items-center">
              <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
              <span>Prevention Measures</span>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <ul className="list-disc pl-5 space-y-2 text-zinc-600 dark:text-zinc-300">
                {recommendation.prevention.map((prev, index) => (
                  <li key={index} className="leading-relaxed">{prev}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  )
}
