// Demo ma'lumotlari — admin dashboard uchun statik mock data.
// Real loyihada bu joyni DB/API so'rovlari bilan almashtirasiz.

export type Trend = "up" | "down"

export interface Kpi {
  id: string
  label: string
  value: string
  delta: number // foizdagi o'zgarish
  trend: Trend
  hint: string
}

export const kpis: Kpi[] = [
  {
    id: "revenue",
    label: "Umumiy daromad",
    value: "$48,210",
    delta: 12.5,
    trend: "up",
    hint: "O'tgan oyga nisbatan",
  },
  {
    id: "customers",
    label: "Yangi mijozlar",
    value: "2,340",
    delta: 8.2,
    trend: "up",
    hint: "So'nggi 30 kun",
  },
  {
    id: "orders",
    label: "Faol buyurtmalar",
    value: "1,128",
    delta: -3.1,
    trend: "down",
    hint: "Hozir jarayonda",
  },
  {
    id: "conversion",
    label: "Konversiya darajasi",
    value: "4.85%",
    delta: 1.4,
    trend: "up",
    hint: "Tashriflardan sotuvga",
  },
]

// Oylik daromad / xarajat — area chart
export const revenueByMonth = [
  { month: "Yan", daromad: 18600, xarajat: 11200 },
  { month: "Fev", daromad: 21300, xarajat: 12100 },
  { month: "Mar", daromad: 19800, xarajat: 11900 },
  { month: "Apr", daromad: 27400, xarajat: 13800 },
  { month: "May", daromad: 31200, xarajat: 15200 },
  { month: "Iyn", daromad: 29800, xarajat: 14600 },
  { month: "Iyl", daromad: 36500, xarajat: 16900 },
  { month: "Avg", daromad: 42100, xarajat: 18300 },
  { month: "Sen", daromad: 39700, xarajat: 17800 },
  { month: "Okt", daromad: 45300, xarajat: 19100 },
  { month: "Noy", daromad: 48900, xarajat: 20400 },
  { month: "Dek", daromad: 52600, xarajat: 21800 },
]

// Hafta kunlari bo'yicha tashrif — bar chart
export const visitorsByDay = [
  { day: "Dush", desktop: 1240, mobile: 980 },
  { day: "Sesh", desktop: 1480, mobile: 1120 },
  { day: "Chor", desktop: 1390, mobile: 1240 },
  { day: "Pay", desktop: 1620, mobile: 1380 },
  { day: "Jum", desktop: 1840, mobile: 1560 },
  { day: "Shan", desktop: 2210, mobile: 1980 },
  { day: "Yak", desktop: 1980, mobile: 1740 },
]

// Trafik manbalari — donut chart
export const trafficSources = [
  { source: "Organik", value: 4280, fill: "var(--color-organik)" },
  { source: "Ijtimoiy", value: 3120, fill: "var(--color-ijtimoiy)" },
  { source: "Reklama", value: 2640, fill: "var(--color-reklama)" },
  { source: "Toʻgʻridan", value: 1890, fill: "var(--color-togridan)" },
  { source: "Boshqa", value: 980, fill: "var(--color-boshqa)" },
]

export interface Sale {
  id: string
  name: string
  email: string
  amount: string
  status: "muvaffaqiyatli" | "kutilmoqda" | "bekor"
  avatar: string
}

export const recentSales: Sale[] = [
  { id: "1", name: "Olivia Karimova", email: "olivia@example.com", amount: "+$1,999", status: "muvaffaqiyatli", avatar: "OK" },
  { id: "2", name: "Jasur Toshpo'lat", email: "jasur@example.com", amount: "+$39", status: "muvaffaqiyatli", avatar: "JT" },
  { id: "3", name: "Madina Yusupova", email: "madina@example.com", amount: "+$299", status: "kutilmoqda", avatar: "MY" },
  { id: "4", name: "William Aliyev", email: "will@example.com", amount: "+$99", status: "muvaffaqiyatli", avatar: "WA" },
  { id: "5", name: "Sofia Rashidova", email: "sofia@example.com", amount: "+$39", status: "bekor", avatar: "SR" },
  { id: "6", name: "Bekzod Normatov", email: "bekzod@example.com", amount: "+$499", status: "muvaffaqiyatli", avatar: "BN" },
]

export interface Customer {
  id: string
  name: string
  email: string
  plan: "Free" | "Pro" | "Enterprise"
  status: "Faol" | "Nofaol" | "Sinov"
  spent: string
  joined: string
  avatar: string
}

export const customers: Customer[] = [
  { id: "1", name: "Olivia Karimova", email: "olivia@example.com", plan: "Enterprise", status: "Faol", spent: "$12,400", joined: "2024-02-11", avatar: "OK" },
  { id: "2", name: "Jasur Toshpo'lat", email: "jasur@example.com", plan: "Pro", status: "Faol", spent: "$3,210", joined: "2024-05-03", avatar: "JT" },
  { id: "3", name: "Madina Yusupova", email: "madina@example.com", plan: "Pro", status: "Sinov", spent: "$890", joined: "2025-01-19", avatar: "MY" },
  { id: "4", name: "William Aliyev", email: "will@example.com", plan: "Free", status: "Nofaol", spent: "$0", joined: "2025-03-27", avatar: "WA" },
  { id: "5", name: "Sofia Rashidova", email: "sofia@example.com", plan: "Enterprise", status: "Faol", spent: "$28,900", joined: "2023-11-08", avatar: "SR" },
  { id: "6", name: "Bekzod Normatov", email: "bekzod@example.com", plan: "Pro", status: "Faol", spent: "$5,640", joined: "2024-09-14", avatar: "BN" },
  { id: "7", name: "Aziza Komilova", email: "aziza@example.com", plan: "Free", status: "Sinov", spent: "$120", joined: "2025-04-30", avatar: "AK" },
  { id: "8", name: "Dilshod Rahimov", email: "dilshod@example.com", plan: "Pro", status: "Faol", spent: "$7,810", joined: "2024-07-22", avatar: "DR" },
]
