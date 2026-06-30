import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { getResource } from "@/admin/registry"
import { ResourceTable } from "@/admin/ui/resource-table"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ resource: string }>
}): Promise<Metadata> {
  const { resource } = await params
  const config = getResource(resource)
  return { title: config?.labelPlural ?? "Resurs" }
}

export default async function ResourceListPage({
  params,
}: {
  params: Promise<{ resource: string }>
}) {
  const { resource } = await params
  const config = getResource(resource)
  if (!config) notFound()

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{config.labelPlural}</h1>
        {config.description && (
          <p className="text-sm text-muted-foreground">{config.description}</p>
        )}
      </div>
      {/* key={resource} — resurslar orasida o'tganda jadval state'i (sahifa/filtr/sort)
          "yopishib" qolmasligi uchun remount qilamiz. */}
      <ResourceTable key={resource} resourceName={resource} />
    </div>
  )
}
