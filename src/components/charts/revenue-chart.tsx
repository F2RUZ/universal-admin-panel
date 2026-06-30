"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

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
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { revenueByMonth } from "@/lib/data"

const chartConfig = {
  daromad: { label: "Daromad", color: "var(--chart-1)" },
  xarajat: { label: "Xarajat", color: "var(--chart-3)" },
} satisfies ChartConfig

export function RevenueChart() {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Daromad dinamikasi</CardTitle>
        <CardDescription>
          So’nggi 12 oy bo’yicha daromad va xarajatlar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[280px] w-full">
          <AreaChart data={revenueByMonth} margin={{ left: 4, right: 12, top: 8 }}>
            <defs>
              <linearGradient id="fillDaromad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-daromad)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-daromad)" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="fillXarajat" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-xarajat)" stopOpacity={0.7} />
                <stop offset="95%" stopColor="var(--color-xarajat)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={48}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="xarajat"
              type="natural"
              fill="url(#fillXarajat)"
              stroke="var(--color-xarajat)"
              stackId="a"
            />
            <Area
              dataKey="daromad"
              type="natural"
              fill="url(#fillDaromad)"
              stroke="var(--color-daromad)"
              stackId="b"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
