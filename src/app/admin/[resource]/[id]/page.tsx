import { notFound } from "next/navigation"

import { getResource } from "@/admin/registry"
import { ResourceDetail } from "@/admin/ui/resource-detail"

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ resource: string; id: string }>
}) {
  const { resource, id } = await params
  const config = getResource(resource)
  if (!config) notFound()

  return <ResourceDetail key={`${resource}-${id}`} resourceName={resource} id={id} />
}
