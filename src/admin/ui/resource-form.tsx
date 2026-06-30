"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

import { getResource } from "@/admin/registry"
import { useOne, useMutations } from "@/admin/hooks"
import type { FieldValue, RecordItem, ResourceConfig } from "@/admin/types"
import { FieldInput } from "./field-input"
import { validateRecord } from "./validation"

type Values = Record<string, FieldValue>

function typeDefault(type: string): FieldValue {
  if (type === "boolean") return false
  if (type === "tags") return []
  return ""
}

function buildInitial(config: ResourceConfig, source: Record<string, unknown>): Values {
  const values: Values = {}
  for (const f of config.fields) {
    if (f.hideInForm) continue
    const raw = source[f.name]
    values[f.name] =
      raw != null ? (raw as FieldValue) : f.defaultValue ?? typeDefault(f.type)
  }
  return values
}

function FormInner({
  config,
  initialValues,
  mode,
  id,
}: {
  config: ResourceConfig
  initialValues: Values
  mode: "create" | "edit"
  id?: string
}) {
  const router = useRouter()
  const { create, update, saving } = useMutations(config.name)
  const [values, setValues] = React.useState<Values>(initialValues)
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const formFields = config.fields.filter((f) => !f.hideInForm)

  const setField = (name: string, value: FieldValue) => {
    setValues((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => {
      if (!prev[name]) return prev
      const next = { ...prev }
      delete next[name]
      return next
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validateRecord(config.fields, values)
    setErrors(errs)
    if (Object.keys(errs).length > 0) {
      toast.error("Formada xatolar bor", { description: "Belgilangan maydonlarni tekshiring." })
      return
    }
    try {
      if (mode === "edit" && id) {
        await update(id, values)
        toast.success(`${config.label} yangilandi`)
        router.push(`/admin/${config.name}/${id}`)
      } else {
        const record = await create(values)
        toast.success(`${config.label} yaratildi`)
        router.push(`/admin/${config.name}/${record.id}`)
      }
    } catch (err) {
      toast.error("Saqlashda xatolik", { description: (err as Error).message })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Ma'lumotlar</CardTitle>
          <CardDescription>
            Yulduzcha (*) bilan belgilangan maydonlar majburiy.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup className="grid gap-5 sm:grid-cols-2">
            {formFields.map((f) => {
              const fullWidth = f.type === "textarea" || f.type === "color"
              return (
                <Field
                  key={f.name}
                  orientation={f.type === "boolean" ? "horizontal" : "vertical"}
                  className={cn(fullWidth && "sm:col-span-2")}
                >
                  <FieldLabel htmlFor={`field-${f.name}`}>
                    {f.label}
                    {f.required && <span className="text-destructive"> *</span>}
                  </FieldLabel>
                  <FieldInput
                    field={f}
                    value={values[f.name]}
                    onChange={(v) => setField(f.name, v)}
                    invalid={!!errors[f.name]}
                  />
                  {f.description && <FieldDescription>{f.description}</FieldDescription>}
                  <FieldError errors={errors[f.name] ? [{ message: errors[f.name] }] : undefined} />
                </Field>
              )
            })}
          </FieldGroup>
        </CardContent>
        <CardFooter className="justify-end gap-2 border-t">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Bekor qilish
          </Button>
          <Button type="submit" disabled={saving}>
            {saving && <Spinner />}
            {mode === "edit" ? "Saqlash" : "Yaratish"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

function FormSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent className="grid gap-5 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function EditLoader({ config, id }: { config: ResourceConfig; id: string }) {
  const { data, loading } = useOne(config.name, id)
  if (loading) return <FormSkeleton />
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
        </Empty>
      </Card>
    )
  }
  return (
    <FormInner
      key={`${config.name}:${id}`}
      config={config}
      initialValues={buildInitial(config, data as RecordItem)}
      mode="edit"
      id={id}
    />
  )
}

export function ResourceForm({
  resourceName,
  id,
}: {
  resourceName: string
  id?: string
}) {
  const config = getResource(resourceName)
  if (!config) return null
  if (!id) {
    return <FormInner config={config} initialValues={buildInitial(config, {})} mode="create" />
  }
  return <EditLoader config={config} id={id} />
}
