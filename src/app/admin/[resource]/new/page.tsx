import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { getResource } from "@/admin/registry"
import { ResourceForm } from "@/admin/ui/resource-form"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ resource: string }>
}): Promise<Metadata> {
  const { resource } = await params
  const config = getResource(resource)
  return { title: config ? `Yangi ${config.label.toLowerCase()}` : "Yangi" }
}

export default async function NewResourcePage({
  params,
}: {
  params: Promise<{ resource: string }>
}) {
  const { resource } = await params
  const config = getResource(resource)
  if (!config) notFound()

  return (
    <div className="flex w-full max-w-3xl flex-col gap-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Yangi {config.label.toLowerCase()}
        </h1>
        <p className="text-sm text-muted-foreground">
          Yangi {config.label.toLowerCase()} qo&apos;shish uchun quyidagi formani to&apos;ldiring.
        </p>
      </div>
      {/* key={resource} — boshqa resursning "yangi" sahifasiga o'tganda
          forma qiymatlari "yopishib" qolmasligi uchun remount qilamiz. */}
      <ResourceForm key={resource} resourceName={resource} />
    </div>
  )
}
