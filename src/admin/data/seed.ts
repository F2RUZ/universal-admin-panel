import type { RecordItem } from "@/admin/types"

/**
 * Deterministik seed — har safar bir xil demo ma'lumot (mulberry32 PRNG).
 * 4 xil domen: turli biznes mantig'ini bitta panel bilan boshqarish namoyishi.
 */

function makeRng(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rng = makeRng(20260630)
const pick = <T>(arr: T[]): T => arr[Math.floor(rng() * arr.length)]
const int = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min

// Sobit epoxa (deterministik sanalar uchun) — 2026-06-30 UTC.
const EPOCH = Date.UTC(2026, 5, 30)
const DAY = 86_400_000
function daysAgo(d: number) {
  return new Date(EPOCH - d * DAY)
}
const isoDate = (date: Date) => date.toISOString().slice(0, 10)
const isoFull = (date: Date) => date.toISOString()

const firstNames = [
  "Olivia", "Jasur", "Madina", "William", "Sofia", "Bekzod", "Aziza", "Dilshod",
  "Emma", "Sardor", "Laura", "Akmal", "Noah", "Kamila", "Otabek", "Maya",
  "Liam", "Nigora", "Ethan", "Gulnoza", "Aziz", "Charlotte", "Rustam", "Diyora",
  "Mason", "Shahzoda", "Lucas", "Javohir", "Mia", "Umida",
]
const lastNames = [
  "Karimova", "Toshpo'lat", "Yusupova", "Aliyev", "Rashidova", "Normatov",
  "Komilova", "Rahimov", "Saidova", "Ergashev", "Hamidova", "Tursunov",
  "Mirzaeva", "Qodirov", "Abdullaeva", "Sobirov", "Yo'ldosheva", "Nazarov",
]
const countries = ["O'zbekiston", "Qozog'iston", "Turkiya", "AQSH", "Germaniya", "BAA", "Rossiya", "Janubiy Koreya"]

const roles = ["admin", "manager", "member", "viewer"]
const userStatuses = ["active", "invited", "suspended"]
const plans = ["free", "pro", "enterprise"]

function makeUsers(count: number): RecordItem[] {
  const used = new Set<string>()
  const rows: RecordItem[] = []
  for (let i = 0; i < count; i++) {
    const fn = pick(firstNames)
    const ln = pick(lastNames)
    const name = `${fn} ${ln}`
    let email = `${fn}.${ln}`.toLowerCase().replace(/[^a-z.]/g, "") + "@example.com"
    let n = 2
    while (used.has(email)) {
      email = `${fn}.${ln}${n}`.toLowerCase().replace(/[^a-z.0-9]/g, "") + "@example.com"
      n++
    }
    used.add(email)
    rows.push({
      id: `usr_${1000 + i}`,
      name,
      email,
      role: pick(roles),
      status: pick(userStatuses),
      plan: pick(plans),
      balance: int(0, 48000),
      country: pick(countries),
      createdAt: isoDate(daysAgo(int(1, 720))),
    })
  }
  return rows
}

const productNames = [
  "Aurora Klaviatura", "Nimbus Sichqoncha", "Vertex Monitor", "Zenith Noutbuk",
  "Pulse Quloqchin", "Lumen Lampa", "Cobalt Adapter", "Drift Stol", "Halo Kamera",
  "Echo Karnay", "Forge Korpus", "Glide Sichqon Pad", "Ion Zaryadlovchi",
  "Jet Sumka", "Krypton SSD", "Lyra Mikrofon", "Mist Namlagich", "Nova Soat",
]
const categories = ["Elektronika", "Aksessuar", "Mebel", "Audio", "Ofis"]
const colors = ["#7c5cff", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899"]

function makeProducts(count: number): RecordItem[] {
  const rows: RecordItem[] = []
  for (let i = 0; i < count; i++) {
    const name = `${pick(productNames)} ${pick(["Pro", "Lite", "Max", "Mini", "X", "S2", "G3"])}`
    rows.push({
      id: `prd_${2000 + i}`,
      name,
      sku: `SKU-${int(10000, 99999)}`,
      category: pick(categories),
      price: int(9, 1900) + 0.99,
      stock: int(0, 480),
      active: rng() > 0.25,
      color: pick(colors),
      createdAt: isoDate(daysAgo(int(1, 500))),
    })
  }
  return rows
}

const orderStatuses = ["paid", "pending", "refunded", "failed"]
const methods = ["card", "cash", "transfer"]

function makeOrders(count: number, userIds: string[]): RecordItem[] {
  const rows: RecordItem[] = []
  for (let i = 0; i < count; i++) {
    rows.push({
      id: `ord_${3000 + i}`,
      number: `${10240 + i}`,
      customer: pick(userIds),
      amount: int(15, 4200) + 0.5,
      status: pick(orderStatuses),
      items: int(1, 9),
      method: pick(methods),
      date: isoDate(daysAgo(int(0, 180))),
    })
  }
  return rows
}

const subjects = [
  "To'lov amalga oshmadi", "Hisobga kirish muammosi", "Mahsulot yetkazilmadi",
  "Qaytarish so'rovi", "Hisobni yangilash", "API kaliti ishlamayapti",
  "Hisob-faktura xatosi", "Funksiya so'rovi", "Parolni tiklash", "Sekin yuklanish",
]
const priorities = ["low", "medium", "high", "urgent"]
const ticketStatuses = ["open", "pending", "resolved", "closed"]

function makeTickets(count: number, userIds: string[], agents: string[]): RecordItem[] {
  const rows: RecordItem[] = []
  for (let i = 0; i < count; i++) {
    rows.push({
      id: `tkt_${4000 + i}`,
      subject: pick(subjects),
      customer: pick(userIds),
      priority: pick(priorities),
      status: pick(ticketStatuses),
      assignee: pick(agents),
      createdAt: isoFull(daysAgo(int(0, 60))),
    })
  }
  return rows
}

const projectNames = [
  "Mobil ilova", "Veb-sayt redizayni", "API migratsiyasi", "CRM integratsiyasi",
  "To'lov tizimi", "Analitika paneli", "Onboarding oqimi", "Qidiruv optimizatsiyasi",
  "Bildirishnomalar markazi", "Hisobot moduli", "Ombor avtomatlashtiruvi", "Chat qo'llab-quvvatlash",
]
const projectStatuses = ["planning", "active", "on_hold", "completed"]
const projectPriorities = ["low", "medium", "high"]

function makeProjects(count: number, userIds: string[]): RecordItem[] {
  const rows: RecordItem[] = []
  for (let i = 0; i < count; i++) {
    rows.push({
      id: `proj_${5000 + i}`,
      name: `${pick(projectNames)} ${pick(["v2", "2026", "Faza 1", "MVP", "Q3"])}`,
      owner: pick(userIds),
      status: pick(projectStatuses),
      priority: pick(projectPriorities),
      budget: int(2000, 120000),
      progress: int(0, 100),
      startDate: isoDate(daysAgo(int(30, 400))),
      dueDate: isoDate(daysAgo(int(-120, 60))), // ba'zilari kelajakda
    })
  }
  return rows
}

const invoiceStatuses = ["draft", "sent", "paid", "overdue", "void"]
const invoiceMethods = ["card", "transfer", "cash"]

function makeInvoices(count: number, userIds: string[]): RecordItem[] {
  const rows: RecordItem[] = []
  for (let i = 0; i < count; i++) {
    rows.push({
      id: `inv_${6000 + i}`,
      number: `2026-${1000 + i}`,
      customer: pick(userIds),
      amount: int(50, 9800) + 0.5,
      status: pick(invoiceStatuses),
      method: pick(invoiceMethods),
      issuedAt: isoDate(daysAgo(int(0, 200))),
      dueAt: isoDate(daysAgo(int(-30, 30))), // ba'zilari kelajakda
    })
  }
  return rows
}

export function generateSeed(): Record<string, RecordItem[]> {
  const users = makeUsers(42)
  const userIds = users.map((u) => u.id as string)
  const agents = ["Sofia R.", "Bekzod N.", "Aziza K.", "Dilshod R."]
  return {
    users,
    products: makeProducts(36),
    orders: makeOrders(58, userIds),
    tickets: makeTickets(30, userIds, agents),
    projects: makeProjects(24, userIds),
    invoices: makeInvoices(40, userIds),
  }
}
