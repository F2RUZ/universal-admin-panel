import type {
  DataProvider,
  GetListParams,
  GetListResult,
  RecordItem,
} from "@/admin/types"

/**
 * In-memory DataProvider — demo uchun. Real loyihada shu interfeysni
 * REST/GraphQL/Supabase bilan implementatsiya qilasiz; UI o'zgarmaydi.
 *
 * Misol REST adapteri:
 *   getList: (res, p) => fetch(`/api/${res}?...`).then(r => r.json())
 *   create:  (res, d) => fetch(`/api/${res}`, { method:'POST', body: JSON.stringify(d) })...
 */

function delay<T>(value: T, ms = 220): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

function matchesSearch(record: RecordItem, search: string): boolean {
  const q = search.trim().toLowerCase()
  if (!q) return true
  return Object.values(record).some((v) => {
    if (v == null) return false
    if (Array.isArray(v)) return v.join(" ").toLowerCase().includes(q)
    return String(v).toLowerCase().includes(q)
  })
}

function compare(a: unknown, b: unknown): number {
  if (a == null) return -1
  if (b == null) return 1
  if (typeof a === "number" && typeof b === "number") return a - b
  return String(a).localeCompare(String(b), undefined, { numeric: true })
}

export function createMockProvider(
  seed: Record<string, RecordItem[]>
): DataProvider {
  // Resurs -> yozuvlar (chuqur nusxa, seed o'zgarmasin).
  const store: Record<string, RecordItem[]> = {}
  for (const [key, rows] of Object.entries(seed)) {
    store[key] = rows.map((r) => ({ ...r }))
  }

  const listeners: Record<string, Set<() => void>> = {}
  const notify = (resource: string) => {
    listeners[resource]?.forEach((cb) => cb())
  }

  const ensure = (resource: string): RecordItem[] => {
    if (!store[resource]) store[resource] = []
    return store[resource]
  }

  return {
    async getList(resource: string, params: GetListParams): Promise<GetListResult> {
      let rows = [...ensure(resource)]

      // Filtrlar (aniq moslik; "" yoki "__all__" = e'tiborsiz)
      if (params.filters) {
        for (const [field, value] of Object.entries(params.filters)) {
          if (value === "" || value == null || value === "__all__") continue
          rows = rows.filter((r) => String(r[field] ?? "") === value)
        }
      }

      // Qidiruv
      if (params.search) {
        rows = rows.filter((r) => matchesSearch(r, params.search!))
      }

      // Saralash
      if (params.sort) {
        const { field, order } = params.sort
        rows.sort((a, b) => {
          const res = compare(a[field], b[field])
          return order === "desc" ? -res : res
        })
      }

      const total = rows.length
      const { page, perPage } = params.pagination
      const start = (page - 1) * perPage
      const data = rows.slice(start, start + perPage)
      return delay({ data, total })
    },

    async getOne(resource: string, id: string): Promise<RecordItem | null> {
      const found = ensure(resource).find((r) => r.id === id) ?? null
      return delay(found ? { ...found } : null, 120)
    },

    async create(resource: string, data: Record<string, unknown>): Promise<RecordItem> {
      const rows = ensure(resource)
      const record: RecordItem = {
        ...data,
        id: data.id ? String(data.id) : `${Date.now().toString(36)}${Math.floor(Math.random() * 1e4)}`,
      }
      rows.unshift(record)
      notify(resource)
      return delay({ ...record }, 160)
    },

    async update(
      resource: string,
      id: string,
      data: Record<string, unknown>
    ): Promise<RecordItem> {
      const rows = ensure(resource)
      const idx = rows.findIndex((r) => r.id === id)
      if (idx === -1) throw new Error(`${resource}#${id} topilmadi`)
      rows[idx] = { ...rows[idx], ...data, id }
      notify(resource)
      return delay({ ...rows[idx] }, 160)
    },

    async delete(resource: string, id: string): Promise<void> {
      const rows = ensure(resource)
      const idx = rows.findIndex((r) => r.id === id)
      if (idx !== -1) rows.splice(idx, 1)
      notify(resource)
      return delay(undefined, 140)
    },

    subscribe(resource: string, callback: () => void): () => void {
      if (!listeners[resource]) listeners[resource] = new Set()
      listeners[resource].add(callback)
      return () => listeners[resource]?.delete(callback)
    },
  }
}
