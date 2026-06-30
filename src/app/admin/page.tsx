import type { Metadata } from "next"

import { ResourceStats } from "@/admin/ui/resource-stats"
import { RevenueChart } from "@/components/charts/revenue-chart"
import { VisitorsChart } from "@/components/charts/visitors-chart"
import { TrafficChart } from "@/components/charts/traffic-chart"
import { RecentSales } from "@/components/dashboard/recent-sales"

export const metadata: Metadata = {
  title: "Boshqaruv paneli",
}

export default function AdminOverviewPage() {
  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Xush kelibsiz 👋</h1>
        <p className="text-sm text-muted-foreground">
          Tizimingizdagi barcha resurslarning umumiy holati bir joyda.
        </p>
      </div>

      {/* Jonli resurs hisoblari (registry'dan avtomatik) */}
      <ResourceStats />

      {/* Grafiklar */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <RevenueChart />
        <TrafficChart />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <VisitorsChart />
        <div className="lg:col-span-2">
          <RecentSales />
        </div>
      </div>
    </>
  )
}
