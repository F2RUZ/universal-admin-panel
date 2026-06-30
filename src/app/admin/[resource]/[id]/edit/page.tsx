import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { getResource } from "@/admin/registry"
import { ResourceForm } from "@/admin/ui/resource-form"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ resource: string; id: string }>
}): Promise<Metadata> {
  const { resource } = await params
  const config = getResource(resource)
  return { title: config ? `${config.label}ni tahrirlash` : "Tahrirlash" }
}

export default async function EditResourcePage({
  params,
}: {
  params: Promise<{ resource: string; id: string }>
}) {
  const { resource, id } = await params
  const config = getResource(resource)
  if (!config) notFound()

  return (
    <div className="flex w-full max-w-3xl flex-col gap-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {config.label}ni tahrirlash
        </h1>
        <p className="text-sm text-muted-foreground">
          O&apos;zgartirishlarni kiritib, saqlang.
        </p>
      </div>
      <ResourceForm key={`${resource}-${id}`} resourceName={resource} id={id} />
    </div>
  )
}
