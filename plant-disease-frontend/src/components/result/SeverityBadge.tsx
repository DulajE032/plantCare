import { Badge } from "@/components/ui/badge"

interface SeverityBadgeProps {
  severity: "low" | "moderate" | "severe"
}

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  const getStyles = (val: "low" | "moderate" | "severe") => {
    switch (val) {
      case "low":
        return "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400 border-green-200 dark:border-green-900/40 hover:bg-green-50"
      case "moderate":
        return "bg-amber-50 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200 dark:border-amber-900/40 hover:bg-amber-50"
      case "severe":
        return "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-450 border-rose-200 dark:border-rose-900/40 hover:bg-rose-50 font-bold"
    }
  }

  return (
    <Badge variant="outline" className={`${getStyles(severity)} capitalize px-3 py-1 rounded-full text-xs font-semibold`}>
      {severity} Severity
    </Badge>
  )
}
