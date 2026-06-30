import type { FieldDef, FieldValue } from "@/admin/types"

/** Bitta maydonni tekshiradi — null = OK, string = xato xabari. */
export function validateField(
  field: FieldDef,
  value: FieldValue,
  record: Record<string, unknown>
): string | null {
  const isEmpty =
    value == null || value === "" || (Array.isArray(value) && value.length === 0)

  if (field.required && isEmpty && field.type !== "boolean") {
    return "Bu maydon majburiy"
  }

  if (!isEmpty) {
    if (field.type === "number" || field.type === "currency") {
      const n = Number(value)
      if (!Number.isFinite(n)) return "Raqam kiriting"
      if (field.min != null && n < field.min) return `Eng kami ${field.min}`
      if (field.max != null && n > field.max) return `Eng ko'pi ${field.max}`
    }
    if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) {
      return "Email manzil noto'g'ri"
    }
    if (field.type === "url") {
      try {
        new URL(String(value))
      } catch {
        return "URL noto'g'ri (http:// bilan boshlang)"
      }
    }
  }

  return field.validate ? field.validate(value, record) : null
}

/** Butun yozuvni tekshiradi — {fieldName: xato} qaytaradi. */
export function validateRecord(
  fields: FieldDef[],
  values: Record<string, FieldValue>
): Record<string, string> {
  const errors: Record<string, string> = {}
  for (const f of fields) {
    if (f.hideInForm) continue
    const err = validateField(f, values[f.name], values)
    if (err) errors[f.name] = err
  }
  return errors
}
