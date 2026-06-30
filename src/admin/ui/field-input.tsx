"use client"

import * as React from "react"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getResource } from "@/admin/registry"
import { useList } from "@/admin/hooks"
import type { FieldDef, FieldValue } from "@/admin/types"

interface Props {
  field: FieldDef
  value: FieldValue
  onChange: (value: FieldValue) => void
  invalid?: boolean
}

const str = (v: FieldValue) => (v == null ? "" : String(v))

/** Bog'langan resursdan yozuvlarni tanlash uchun Select. */
function RelationInput({ field, value, onChange, invalid }: Props) {
  const resource = field.relation!.resource
  const config = getResource(resource)
  const { data, loading } = useList(resource, {
    pagination: { page: 1, perPage: 1000 },
    sort: config?.defaultSort,
  })

  return (
    <Select value={str(value)} onValueChange={(v) => onChange(v)}>
      <SelectTrigger className="w-full" aria-invalid={invalid}>
        <SelectValue placeholder={loading ? "Yuklanmoqda..." : "Tanlang..."} />
      </SelectTrigger>
      <SelectContent position="popper">
        {data.map((rec) => (
          <SelectItem key={rec.id} value={rec.id}>
            {config ? config.recordLabel(rec) : rec.id}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function FieldInput({ field, value, onChange, invalid }: Props) {
  const id = `field-${field.name}`

  switch (field.type) {
    case "textarea":
      return (
        <Textarea
          id={id}
          rows={field.rows ?? 4}
          placeholder={field.placeholder}
          value={str(value)}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={invalid}
        />
      )

    case "boolean":
      return (
        <Switch
          id={id}
          checked={value === true || value === "true"}
          onCheckedChange={(c) => onChange(c)}
        />
      )

    case "select":
    case "badge":
      return (
        <Select value={str(value)} onValueChange={(v) => onChange(v)}>
          <SelectTrigger id={id} className="w-full" aria-invalid={invalid}>
            <SelectValue placeholder={field.placeholder ?? "Tanlang..."} />
          </SelectTrigger>
          <SelectContent position="popper">
            {field.options?.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )

    case "relation":
      return field.relation ? (
        <RelationInput field={field} value={value} onChange={onChange} invalid={invalid} />
      ) : null

    case "number":
    case "currency":
      return (
        <Input
          id={id}
          type="number"
          inputMode="decimal"
          min={field.min}
          max={field.max}
          step={field.step ?? (field.type === "currency" ? 0.01 : 1)}
          placeholder={field.placeholder}
          value={str(value)}
          onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
          aria-invalid={invalid}
        />
      )

    case "date":
      return (
        <Input
          id={id}
          type="date"
          value={str(value).slice(0, 10)}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={invalid}
        />
      )

    case "datetime":
      return (
        <Input
          id={id}
          type="datetime-local"
          value={str(value).slice(0, 16)}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={invalid}
        />
      )

    case "color":
      return (
        <div className="flex items-center gap-2">
          <Input
            id={id}
            type="color"
            className="h-9 w-14 p-1"
            value={str(value) || "#000000"}
            onChange={(e) => onChange(e.target.value)}
          />
          <Input
            className="flex-1 tabular-nums"
            value={str(value)}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#7c5cff"
            aria-invalid={invalid}
          />
        </div>
      )

    case "email":
    case "url":
    case "avatar":
    case "text":
    default:
      return (
        <Input
          id={id}
          type={field.type === "email" ? "email" : field.type === "url" ? "url" : "text"}
          placeholder={field.placeholder}
          value={str(value)}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={invalid}
        />
      )
  }
}
