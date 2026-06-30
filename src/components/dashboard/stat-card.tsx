"use client"

import { ArrowDownRight, ArrowUpRight } from "lucide-react"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useCountUp } from "@/hooks/use-count-up"
import type { Kpi } from "@/lib/data"

// "$48,210" / "4.85%" kabi qiymatdan raqamni va prefiks/suffiksni ajratamiz,
// shunda faqat son qismini animatsiya qilamiz.
function parseValue(raw: string) {
  const match = raw.match(/-?[\d,.]+/)
  if (!match) return { prefix: raw, num: 0, suffix: "", decimals: 0 }
  const numStr = match[0].replace(/,/g, "")
  const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0
  return {
    prefix: raw.slice(0, match.index),
    num: parseFloat(numStr),
    suffix: raw.slice((match.index ?? 0) + match[0].length),
    decimals,
  }
}

export function StatCard({ kpi, index = 0 }: { kpi: Kpi; index?: number }) {
  const { prefix, num, suffix, decimals } = parseValue(kpi.value)
  const animated = useCountUp(num, { decimals, duration: 1100 + index * 120 })
  const up = kpi.trend === "up"

  return (
    <Card
      className="animate-in fade-in slide-in-from-bottom-3 fill-mode-both gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5"
      style={{ animationDelay: `${index * 90}ms`, animationDuration: "600ms" }}
    >
      <CardHeader>
        <CardDescription>{kpi.label}</CardDescription>
        <CardTitle className="text-3xl font-semibold tabular-nums tracking-tight">
          {prefix}
          {animated.toLocaleString("en-US", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })}
          {suffix}
        </CardTitle>
        <div className="mt-1 flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn(
              "gap-1 rounded-full",
              up
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400"
            )}
          >
            {up ? (
              <ArrowUpRight className="size-3.5" />
            ) : (
              <ArrowDownRight className="size-3.5" />
            )}
            {up ? "+" : ""}
            {kpi.delta}%
          </Badge>
          <span className="text-xs text-muted-foreground">{kpi.hint}</span>
        </div>
      </CardHeader>
    </Card>
  )
}
