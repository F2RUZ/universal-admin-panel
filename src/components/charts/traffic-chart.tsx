"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { trafficSources } from "@/lib/data"

const chartConfig = {
  value: { label: "Tashriflar" },
  organik: { label: "Organik", color: "var(--chart-1)" },
  ijtimoiy: { label: "Ijtimoiy", color: "var(--chart-2)" },
  reklama: { label: "Reklama", color: "var(--chart-3)" },
  togridan: { label: "To'g'ridan", color: "var(--chart-4)" },
  boshqa: { label: "Boshqa", color: "var(--chart-5)" },
} satisfies ChartConfig

export function TrafficChart() {
  const total = React.useMemo(
    () => trafficSources.reduce((sum, s) => sum + s.value, 0),
    []
  )

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Trafik manbalari</CardTitle>
        <CardDescription>So’nggi 30 kun</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[260px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={trafficSources}
              dataKey="value"
              nameKey="source"
              innerRadius={62}
              strokeWidth={4}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {total.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) + 22}
                          className="fill-muted-foreground text-xs"
                        >
                          Tashriflar
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
