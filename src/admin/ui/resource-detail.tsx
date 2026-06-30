"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Pencil, Trash2, ArrowLeft } from "lucide-react"
import { toast } from "sonner"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

import { getResource } from "@/admin/registry"
import { useOne, useMutations } from "@/admin/hooks"
import { FieldValueView } from "./field-value"
import { DeleteDialog } from "./delete-dialog"
import { initials } from "./format"

export function ResourceDetail({
  resourceName,
  id,
}: {
  resourceName: string
  id: string
}) {
  const config = getResource(resourceName)
  const router = useRouter()
  const { data, loading } = useOne(resourceName, id)
  const { remove } = useMutations(resourceName)
  const [confirmOpen, setConfirmOpen] = React.useState(false)

  if (!config) return null

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-64" />
        <Card>
          <CardContent className="grid gap-5 py-6 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="h-3.5 w-20" />
                <Skeleton className="h-5 w-36" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data) {
    return (
      <Card>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <config.icon />
            </EmptyMedia>
            <EmptyTitle>Yozuv topilmadi</EmptyTitle>
            <EmptyDescription>
              Bu {config.label.toLowerCase()} o'chirilgan yoki mavjud emas.
            </EmptyDescription>
          </EmptyHeader>
          <div className="flex justify-center pb-6">
            <Button asChild variant="outline">
              <Link href={`/admin/${config.name}`}>
                <ArrowLeft />
                {config.labelPlural}ga qaytish
              </Link>
            </Button>
          </div>
        </Empty>
      </Card>
    )
  }

  const title = config.recordLabel(data)
  const detailFields = config.fields.filter((f) => !f.hideInDetail)

  const handleDelete = async () => {
    await remove(id)
    toast.success(`${config.label} o'chirildi`)
    router.push(`/admin/${config.name}`)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="size-12">
            <AvatarFallback className="text-sm font-semibold">
              {initials(title)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
            <p className="text-sm text-muted-foreground">
              {config.label} · <span className="tabular-nums">{data.id}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href={`/admin/${config.name}/${id}/edit`}>
              <Pencil />
              Tahrirlash
            </Link>
          </Button>
          <Button variant="outline" className="text-destructive" onClick={() => setConfirmOpen(true)}>
            <Trash2 />
            O'chirish
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-base">Tafsilotlar</CardTitle>
        </CardHeader>
        <CardContent className="py-6">
          <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {detailFields.map((f) => (
              <div key={f.name} className="flex flex-col gap-1.5 border-b border-dashed border-border/60 pb-4 last:border-0">
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {f.label}
                </dt>
                <dd className="text-sm">
                  <FieldValueView field={f} record={data} />
                </dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      <DeleteDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={`${config.label}ni o'chirish`}
        description={`"${title}" butunlay o'chiriladi. Bu amalni qaytarib bo'lmaydi.`}
        onConfirm={handleDelete}
      />
    </div>
  )
}
