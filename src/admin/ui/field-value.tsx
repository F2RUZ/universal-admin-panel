"use client"

import * as React from "react"
import { Check, Minus, ExternalLink } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { getResource } from "@/admin/registry"
import { useOne } from "@/admin/hooks"
import type { FieldDef, RecordItem } from "@/admin/types"
import {
  findOption,
  formatCurrency,
  formatDate,
  formatNumber,
  initials,
  toneClass,
} from "./format"

/** Bog'langan resurs yozuvini yorlig'i bilan ko'rsatadi. */
function RelationValue({ resource, id }: { resource: string; id: string }) {
  const { data, loading } = useOne(resource, id)
  const config = getResource(resource)
  if (loading) return <Skeleton className="h-4 w-24" />
  if (!data) return <span className="text-muted-foreground">—</span>
  const label = config ? config.recordLabel(data) : id
  return (
    <span className="inline-flex items-center gap-1.5">
      <Avatar className="size-5">
        <AvatarFallback className="text-[10px]">{initials(label)}</AvatarFallback>
      </Avatar>
      {label}
    </span>
  )
}

export function FieldValueView({
  field,
  record,
  className,
}: {
  field: FieldDef
  record: RecordItem
  className?: string
}) {
  const value = record[field.name]
  const empty = <span className="text-muted-foreground">—</span>

  if ((value == null || value === "") && field.type !== "boolean") {
    return <span className={className}>{empty}</span>
  }

  switch (field.type) {
    case "avatar": {
      const name = String(value)
      return (
        <span className={cn("inline-flex items-center gap-2.5", className)}>
          <Avatar className="size-8">
            <AvatarFallback className="text-xs font-medium">
              {initials(name)}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{name}</span>
        </span>
      )
    }

    case "badge":
    case "select": {
      const opt = findOption(field, value)
      const label = opt?.label ?? String(value)
      if (field.type === "select" && !opt?.tone) {
        return <span className={cn("text-foreground", className)}>{label}</span>
      }
      return (
        <Badge
          variant="outline"
          className={cn("rounded-full font-medium", toneClass[opt?.tone ?? "neutral"], className)}
        >
          {label}
        </Badge>
      )
    }

    case "tags": {
      const tags = Array.isArray(value) ? value : [String(value)]
      return (
        <span className={cn("flex flex-wrap gap-1", className)}>
          {tags.map((t) => (
            <Badge key={t} variant="secondary" className="rounded-full">
              {t}
            </Badge>
          ))}
        </span>
      )
    }

    case "boolean": {
      const on = value === true || value === "true"
      return (
        <Badge
          variant="outline"
          className={cn("rounded-full gap-1", on ? toneClass.success : toneClass.neutral, className)}
        >
          {on ? <Check className="size-3" /> : <Minus className="size-3" />}
          {on ? "Ha" : "Yo'q"}
        </Badge>
      )
    }

    case "currency":
      return (
        <span className={cn("tabular-nums font-medium", className)}>
          {formatCurrency(value, field.currency)}
        </span>
      )

    case "number":
      return (
        <span className={cn("tabular-nums", className)}>
          {field.prefix}
          {formatNumber(value)}
          {field.suffix}
        </span>
      )

    case "date":
      return <span className={cn("tabular-nums", className)}>{formatDate(value)}</span>

    case "datetime":
      return (
        <span className={cn("tabular-nums", className)}>{formatDate(value, true)}</span>
      )

    case "email":
      return (
        <a
          href={`mailto:${value}`}
          className={cn("text-foreground hover:text-primary hover:underline", className)}
          onClick={(e) => e.stopPropagation()}
        >
          {String(value)}
        </a>
      )

    case "url":
      return (
        <a
          href={String(value)}
          target="_blank"
          rel="noopener noreferrer"
          className={cn("inline-flex items-center gap-1 text-primary hover:underline", className)}
          onClick={(e) => e.stopPropagation()}
        >
          {String(value)}
          <ExternalLink className="size-3" />
        </a>
      )

    case "color":
      return (
        <span className={cn("inline-flex items-center gap-2", className)}>
          <span
            className="size-4 rounded-full border border-border shadow-sm"
            style={{ backgroundColor: String(value) }}
          />
          <span className="tabular-nums text-muted-foreground">{String(value)}</span>
        </span>
      )

    case "relation":
      return field.relation ? (
        <span className={className}>
          <RelationValue resource={field.relation.resource} id={String(value)} />
        </span>
      ) : (
        <span className={className}>{String(value)}</span>
      )

    case "text":
    case "textarea":
    default:
      return (
        <span className={cn(field.primary && "font-medium", className)}>
          {field.prefix}
          {String(value)}
          {field.suffix}
        </span>
      )
  }
}
