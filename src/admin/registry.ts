import type { ResourceConfig } from "@/admin/types"
import { users } from "./resources/users"
import { products } from "./resources/products"
import { orders } from "./resources/orders"
import { tickets } from "./resources/tickets"
import { projects } from "./resources/projects"
import { invoices } from "./resources/invoices"

/**
 * RESURSLAR REESTRI — panelning "manifesti".
 * Yangi entity qo'shish: config yozing va shu ro'yxatga qo'shing. Tamom.
 * Sidebar, route'lar, jadval, forma, detal — hammasi avtomatik paydo bo'ladi.
 */
export const resources: ResourceConfig[] = [users, products, orders, tickets, projects, invoices]

export function getResource(name: string): ResourceConfig | undefined {
  return resources.find((r) => r.name === name)
}

export function getField(resource: ResourceConfig, name: string) {
  return resource.fields.find((f) => f.name === name)
}

/** Sidebar uchun guruhlangan ko'rinish (tartibni saqlaydi). */
export function resourcesByGroup(): { group: string; items: ResourceConfig[] }[] {
  const groups: { group: string; items: ResourceConfig[] }[] = []
  for (const res of resources) {
    const key = res.group ?? "Boshqa"
    let bucket = groups.find((g) => g.group === key)
    if (!bucket) {
      bucket = { group: key, items: [] }
      groups.push(bucket)
    }
    bucket.items.push(res)
  }
  return groups
}
