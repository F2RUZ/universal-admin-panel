import type { LucideIcon } from "lucide-react"

/**
 * ===========================================================================
 *  UNIVERSAL ADMIN — TYPE TIZIMI
 *  Butun panel shu kontraktlar ustiga quriladi. Yangi "resurs" (entity)
 *  qo'shish = bitta ResourceConfig yozish. Qolgan hamma narsa (jadval,
 *  forma, detal, CRUD, filtr, qidiruv) avtomatik generatsiya bo'ladi.
 * ===========================================================================
 */

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "currency"
  | "boolean"
  | "date"
  | "datetime"
  | "email"
  | "url"
  | "select"
  | "badge"
  | "tags"
  | "avatar"
  | "relation"
  | "color"

/** Badge / status ranglari — semantik tokenlarga bog'langan. */
export type BadgeTone =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"

export interface FieldOption {
  value: string
  label: string
  tone?: BadgeTone
}

export type FieldValue = string | number | boolean | string[] | null | undefined

export interface RecordItem {
  id: string
  [key: string]: unknown
}

export interface FieldDef {
  name: string
  label: string
  type: FieldType

  // — Ko'rsatish / jadval —
  sortable?: boolean
  searchable?: boolean
  filterable?: boolean
  hideInTable?: boolean
  hideInForm?: boolean
  hideInDetail?: boolean
  align?: "start" | "end"
  /** Jadval ustuni kengligi, masalan "12rem" yoki "120px". */
  width?: string
  /** Jadvalda primary (qalin) ustun sifatida ko'rsatish. */
  primary?: boolean

  // — Forma —
  required?: boolean
  placeholder?: string
  description?: string
  defaultValue?: FieldValue
  min?: number
  max?: number
  step?: number
  rows?: number

  // — Tur-maxsus —
  options?: FieldOption[] // select | badge | tags
  currency?: string // currency (default: USD)
  relation?: { resource: string } // relation -> boshqa resurs id'si
  prefix?: string // text/number oldidan, masalan "#"
  suffix?: string

  /** Maxsus validatsiya — null = OK, string = xato xabari. */
  validate?: (value: FieldValue, record: Record<string, unknown>) => string | null
}

export interface ResourceConfig {
  /** URL kaliti, masalan "users" -> /admin/users */
  name: string
  /** Birlik nomi, masalan "Foydalanuvchi" */
  label: string
  /** Ko'plik nomi, masalan "Foydalanuvchilar" */
  labelPlural: string
  icon: LucideIcon
  /** Sidebar guruhi (ixtiyoriy), masalan "Savdo" */
  group?: string
  description?: string
  fields: FieldDef[]
  /** Yozuvni qanday nomlash (detal sarlavhasi, relation yorlig'i). */
  recordLabel: (record: RecordItem) => string
  defaultSort?: { field: string; order: "asc" | "desc" }
  searchPlaceholder?: string
}

// ——— Data provider kontrakti (integratsiya nuqtasi) ———

export interface GetListParams {
  pagination: { page: number; perPage: number }
  sort?: { field: string; order: "asc" | "desc" }
  search?: string
  /** field -> qiymat (aniq moslik). */
  filters?: Record<string, string>
}

export interface GetListResult {
  data: RecordItem[]
  total: number
}

/**
 * DataProvider — butun universallikning yuragi. Mock o'rniga REST,
 * GraphQL, Supabase yoki istalgan backend implementatsiyasini ulang;
 * UI o'zgarmaydi.
 */
export interface DataProvider {
  getList(resource: string, params: GetListParams): Promise<GetListResult>
  getOne(resource: string, id: string): Promise<RecordItem | null>
  create(resource: string, data: Record<string, unknown>): Promise<RecordItem>
  update(resource: string, id: string, data: Record<string, unknown>): Promise<RecordItem>
  delete(resource: string, id: string): Promise<void>
  /** O'zgarishlarni jonli kuzatish (ixtiyoriy) — list'lar avto-yangilanadi. */
  subscribe?(resource: string, callback: () => void): () => void
}
