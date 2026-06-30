"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { Card, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { resources } from "@/admin/registry"
import { useList } from "@/admin/hooks"
import type { ResourceConfig } from "@/admin/types"

function StatItem({ res, index }: { res: ResourceConfig; index: number }) {
  const { total, loading } = useList(res.name, {
    pagination: { page: 1, perPage: 1 },
  })

  return (
    <Link href={`/admin/${res.name}`} className="group">
      <Card
        className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both gap-0 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
        style={{ animationDelay: `${index * 80}ms`, animationDuration: "500ms" }}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
              <res.icon className="size-5" />
            </div>
            <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{res.labelPlural}</p>
          {loading ? (
            <Skeleton className="mt-1 h-8 w-16" />
          ) : (
            <p className="text-2xl font-semibold tabular-nums tracking-tight">
              {total.toLocaleString()}
            </p>
          )}
        </CardHeader>
      </Card>
    </Link>
  )
}

export function ResourceStats() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {resources.map((res, i) => (
        <StatItem key={res.name} res={res} index={i} />
      ))}
    </div>
  )
}
