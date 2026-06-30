import type { BadgeTone, FieldDef, FieldOption } from "@/admin/types"

/** Badge tonelari — status semantikasi aksentdan qat'i nazar barqaror. */
export const toneClass: Record<BadgeTone, string> = {
  neutral: "border-border bg-muted text-muted-foreground",
  primary: "border-primary/25 bg-primary/10 text-primary",
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  danger: "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400",
  info: "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400",
}

export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")
}

export function formatCurrency(value: unknown, currency = "USD"): string {
  const n = Number(value)
  if (!Number.isFinite(n)) return "—"
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(n)
}

export function formatNumber(value: unknown): string {
  const n = Number(value)
  if (!Number.isFinite(n)) return "—"
  return new Intl.NumberFormat("en-US").format(n)
}

export function formatDate(value: unknown, withTime = false): string {
  if (value == null || value === "") return "—"
  const raw = String(value)
  const d = new Date(raw)
  if (Number.isNaN(d.getTime())) return raw
  // "YYYY-MM-DD" (date-only) JS tomonidan UTC yarim tun sifatida o'qiladi.
  // Manfiy timezone'da bir kun kam ko'rsatmaslik uchun UTC'da formatlaymiz.
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(raw)
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
    ...(dateOnly && !withTime ? { timeZone: "UTC" } : {}),
  }).format(d)
}

export function findOption(
  field: FieldDef,
  value: unknown
): FieldOption | undefined {
  return field.options?.find((o) => o.value === String(value))
}
