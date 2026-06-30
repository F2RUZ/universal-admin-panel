<div align="center">

# 🎛 Acme — Universal Admin Panel

**Config-driven admin paneli** — bitta `ResourceConfig` yozasiz, jadval · forma · detal · CRUD · filtr · qidiruv **avtomatik** generatsiya bo'ladi.
Istalgan biznes mantig'iga (REST / GraphQL / Supabase / mock) `DataProvider` orqali ulanadi.

Built with **Next.js 16** · **React 19** · **Tailwind v4** · **shadcn/ui (radix-nova)** · **Recharts 3**

`Violet Dusk` premium tema · 5 ta almashtiriladigan brend rangi · dark/light · ⌘K command palette

</div>

---

## ✨ Asosiy imkoniyatlar

| | |
|---|---|
| 🧩 **Config-driven** | Yangi entity = 1 ta config. Sidebar, route'lar, jadval, forma, detal avtomatik paydo bo'ladi. |
| 🔌 **Universal backend** | `DataProvider` abstraksiyasi — mock'ni REST/GraphQL/Supabase bilan **bir qatorda** almashtiring, UI o'zgarmaydi. |
| 📊 **14 maydon turi** | text, currency, badge, relation, boolean, date, color, tags va boshqalar — har biri jadval/forma/detalda to'g'ri render bo'ladi. |
| 🔎 **To'liq CRUD** | Qidiruv, ustun bo'yicha saralash, filtrlash, pagination, yaratish, tahrirlash, o'chirish (tasdiq bilan). |
| 🎨 **Premium tema** | oklch ranglar, `Violet Dusk` default + 5 ta brend rangi (jonli switcher), silliq dark mode. |
| ⌨️ **⌘K command palette** | Istalgan resurs yoki amalga bir tugmada o'tish. |
| ⚡ **Best practice** | Server Components default, client faqat interaktiv joyda; SSR'li custom 404; a11y; `prefers-reduced-motion`. |
| 🟢 **Toza** | `build` ✅ · `lint` 0 xato ✅ · adversarial review o'tgan (5 ta xato topildi va tuzatildi). |

---

## 🧱 Texnologiyalar

- **Framework:** Next.js 16 (App Router, Turbopack, RSC) · React 19 · TypeScript 5
- **UI:** Tailwind CSS v4, shadcn/ui (`radix-nova` style, radix-ui + base-ui)
- **Grafiklar:** Recharts 3
- **Qo'shimcha:** sonner (toast), next-themes (dark mode), cmdk (⌘K), lucide-react (ikonkalar)

---

## 🚀 Ishga tushirish

```bash
npm install          # bog'liqliklar
npm run dev          # dev server → http://localhost:3000
npm run build        # production build
npm start            # production server
npm run lint         # ESLint
```

Bosh sahifa (`/`) avtomatik `/admin`'ga yo'naltiradi.

---

## 🗺 Route'lar

| Route | Tavsif |
|---|---|
| `/admin` | Boshqaruv paneli — jonli resurs hisoblari + grafiklar |
| `/admin/[resource]` | Resurs ro'yxati (jadval + qidiruv + filtr + sort + pagination) |
| `/admin/[resource]/new` | Yangi yozuv yaratish |
| `/admin/[resource]/[id]` | Yozuv tafsilotlari |
| `/admin/[resource]/[id]/edit` | Yozuvni tahrirlash |
| `/admin/settings` | Sozlamalar |
| `*` (noma'lum) | Custom **404** (admin ichida chrome bilan, tashqarida to'liq ekran) |

Demo resurslar: **users**, **products**, **orders**, **tickets** — 4 xil domen (universallik namoyishi).

---

## 🧩 Arxitektura

```
src/
├─ admin/                      # ── UNIVERSAL ADMIN YADROSI ──
│  ├─ types.ts                 # FieldDef, ResourceConfig, DataProvider kontraktlari
│  ├─ registry.ts              # Resurslar reestri (manifest)
│  ├─ admin-context.tsx        # DataProvider context'i
│  ├─ admin-root.tsx           # Client chegarasi (provider'ni ulaydi)
│  ├─ hooks.ts                 # useList / useOne / useMutations
│  ├─ data/
│  │  ├─ provider.ts           # 🔌 INTEGRATSIYA NUQTASI (bu yerda backend tanlanadi)
│  │  ├─ mock-provider.ts      # In-memory DataProvider (demo)
│  │  └─ seed.ts               # Deterministik demo ma'lumot (mulberry32 PRNG)
│  ├─ resources/               # Resurs configlari
│  │  └─ users.ts  products.ts  orders.ts  tickets.ts
│  └─ ui/                      # Generic UI (config asosida render)
│     ├─ resource-table.tsx    #   ro'yxat: qidiruv/filtr/sort/pagination/amallar
│     ├─ resource-form.tsx     #   create/edit forma + validatsiya
│     ├─ resource-detail.tsx   #   tafsilotlar
│     ├─ field-value.tsx       #   qiymatni turiga qarab ko'rsatish
│     ├─ field-input.tsx       #   maydon control'i (forma)
│     ├─ validation.ts  format.ts
│     ├─ admin-sidebar.tsx  admin-header.tsx  command-menu.tsx
│     └─ resource-stats.tsx  delete-dialog.tsx
├─ app/
│  ├─ admin/                   # Route'lar (server: param o'qiydi → client view render qiladi)
│  │  ├─ layout.tsx  page.tsx  not-found.tsx  settings/
│  │  └─ [resource]/ ...       # dinamik CRUD route'lari
│  ├─ globals.css              # 🎨 Violet Dusk tema + accent palitralari
│  └─ layout.tsx  page.tsx  not-found.tsx
└─ components/                 # Umumiy: theme-toggle, accent-switcher, charts/, ui/ (shadcn)
```

**Oqim:** `page.tsx` (server) `params`'ni o'qiydi → `getResource()` bilan tekshiradi (yo'q bo'lsa `notFound()`) → client `Resource*` komponentiga `resourceName`/`id` (string) uzatadi → komponent registry'dan config'ni oladi va `DataProvider` orqali ma'lumot yuklaydi. Funksiyalar server→client chegarasidan o'tmaydi.

---

## ⭐️ Yangi resurs qo'shish (asosiy g'oya)

Butun CRUD UI uchun **2 qadam** yetarli:

### 1. Config yozing — `src/admin/resources/invoices.ts`

```ts
import { FileText } from "lucide-react"
import type { ResourceConfig } from "@/admin/types"

export const invoices: ResourceConfig = {
  name: "invoices",                 // URL: /admin/invoices
  label: "Hisob-faktura",
  labelPlural: "Hisob-fakturalar",
  icon: FileText,
  group: "Moliya",                  // sidebar guruhi
  recordLabel: (r) => `#${r.number}`,
  defaultSort: { field: "issuedAt", order: "desc" },
  fields: [
    { name: "number",   label: "Raqam",  type: "text",     primary: true, searchable: true, required: true },
    { name: "customer", label: "Mijoz",  type: "relation", relation: { resource: "users" }, required: true },
    { name: "total",    label: "Summa",  type: "currency", align: "end", sortable: true },
    { name: "status",   label: "Holat",  type: "badge", filterable: true, options: [
        { value: "draft", label: "Qoralama",  tone: "neutral" },
        { value: "paid",  label: "To'langan", tone: "success" },
        { value: "void",  label: "Bekor",     tone: "danger"  },
    ] },
    { name: "issuedAt", label: "Sana",   type: "date", sortable: true, align: "end" },
  ],
}
```

### 2. Reestrga qo'shing — `src/admin/registry.ts`

```ts
import { invoices } from "./resources/invoices"

export const resources: ResourceConfig[] = [users, products, orders, tickets, invoices]
```

**Tamom.** Endi avtomatik mavjud:
`/admin/invoices` (jadval + qidiruv + filtr + sort + pagination) · `/admin/invoices/new` · `/admin/invoices/[id]` · `.../edit` · sidebar havolasi · ⌘K'da topiladi.

---

## 🎛 Maydon turlari (`FieldType`)

| Tur | Jadval/Detal ko'rinishi | Forma control'i |
|---|---|---|
| `text` | Matn | Input |
| `textarea` | Matn | Textarea |
| `number` | Raqam (prefix/suffix bilan) | Input[number] |
| `currency` | `$1,234.00` | Input[number] |
| `boolean` | ✓ Ha / – Yo'q badge | Switch |
| `date` | `30 Jun 2026` | Input[date] |
| `datetime` | sana + vaqt | Input[datetime-local] |
| `email` | `mailto:` havola | Input[email] |
| `url` | tashqi havola | Input[url] |
| `select` | matn (rangsiz) | Select |
| `badge` | rangli badge (tone) | Select |
| `tags` | bir nechta badge | — |
| `avatar` | avatar + ism | Input |
| `relation` | bog'langan yozuv yorlig'i | Select (boshqa resursdan) |
| `color` | rang namunasi + hex | rang tanlagich |

**Foydali `FieldDef` flaglari:** `primary`, `sortable`, `searchable`, `filterable`, `required`, `align`, `width`, `hideInTable`, `hideInForm`, `hideInDetail`, `options`, `relation`, `currency`, `defaultValue`, `min`/`max`/`step`, `validate`.

---

## 🔌 O'z backend'ingizni ulash

Butun panel yagona `dataProvider`'dan foydalanadi. Ulash uchun faqat `src/admin/data/provider.ts`'ni o'zgartiring:

```ts
// src/admin/data/provider.ts
export const dataProvider = createRestProvider("/api")   // mock o'rniga
```

`DataProvider` interfeysi (`src/admin/types.ts`):

```ts
interface DataProvider {
  getList(resource, { pagination, sort, search, filters }): Promise<{ data; total }>
  getOne(resource, id): Promise<RecordItem | null>
  create(resource, data): Promise<RecordItem>
  update(resource, id, data): Promise<RecordItem>
  delete(resource, id): Promise<void>
  subscribe?(resource, cb): () => void   // ixtiyoriy: jonli yangilanish
}
```

### REST adapter namunasi

```ts
// src/admin/data/rest-provider.ts
import type { DataProvider } from "@/admin/types"

export function createRestProvider(baseUrl: string): DataProvider {
  const json = (r: Response) => (r.ok ? r.json() : Promise.reject(new Error(r.statusText)))
  return {
    async getList(resource, { pagination, sort, search, filters }) {
      const q = new URLSearchParams()
      q.set("_page", String(pagination.page))
      q.set("_limit", String(pagination.perPage))
      if (sort) { q.set("_sort", sort.field); q.set("_order", sort.order) }
      if (search) q.set("q", search)
      for (const [k, v] of Object.entries(filters ?? {})) if (v && v !== "__all__") q.set(k, v)
      const res = await fetch(`${baseUrl}/${resource}?${q}`)
      const data = await res.json()
      return { data, total: Number(res.headers.get("X-Total-Count") ?? data.length) }
    },
    getOne: (resource, id) => fetch(`${baseUrl}/${resource}/${id}`).then((r) => (r.ok ? r.json() : null)),
    create: (resource, body) =>
      fetch(`${baseUrl}/${resource}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(json),
    update: (resource, id, body) =>
      fetch(`${baseUrl}/${resource}/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(json),
    delete: (resource, id) => fetch(`${baseUrl}/${resource}/${id}`, { method: "DELETE" }).then(() => undefined),
  }
}
```

> `subscribe`'siz ham ishlaydi; uni qo'shsangiz (WebSocket/SSE), mutatsiyadan keyin ro'yxatlar jonli yangilanadi.

---

## 🎨 Tema va ranglar

- **Default:** `Violet Dusk` — sovuq slate neytrallar + binafsha aksent (premium SaaS).
- **Brend rangi switcher** (header, 🎨 tugma): `Violet · Blue · Emerald · Rose · Amber`. Tanlov `localStorage`'da saqlanadi, flash bo'lmaydi (`<head>`'dagi no-flash skript).
- **Dark / Light:** header'dagi ☀️/🌙 tugma (next-themes, `system` default).
- Barcha ranglar **oklch** (keng gamut). Tokenlar: `src/app/globals.css` → `:root`, `.dark`, `[data-accent="..."]`.

Yangi brend rangi: `globals.css`'ga `[data-accent="teal"] { --primary: ...; --ring: ...; --chart-1: ... }` (va kerak bo'lsa `.dark[data-accent="teal"]`) bloklarini qo'shing, `accent-switcher.tsx`'dagi `ACCENTS` ro'yxatiga kiriting.

---

## ⌨️ Tezkor tugmalar

| Tugma | Amal |
|---|---|
| `⌘K` / `Ctrl+K` | Command palette (resurs/amalga o'tish) |
| `Esc` | Dialog / palitrani yopish |

---

## ✅ Sifat

Loyiha **adversarial multi-agent review**'dan o'tgan — quyidagi 5 ta haqiqiy xato topilib tuzatilgan:

1. **Pagination clamp** — oxirgi sahifada yozuv o'chirilganda bo'sh sahifada qolib ketish.
2. **Dark + Emerald kontrast** — primary tugmadagi matn o'qilmasligi (WCAG).
3. **Sana off-by-one** — manfiy timezone'larda bir kun kam ko'rsatish.
4. **Resurs state leak** — resurslar orasida o'tganda filtr/sahifa "yopishib" qolishi (`key={resource}`).
5. **Forma state leak** — yangi yaratishda boshqa resurs qiymatlarining qolishi.

`npm run build` ✅ · `npm run lint` → 0 xato ✅

---

## 🧭 Kengaytirish g'oyalari

- Server-side auth + rollar (`DataProvider`'ni himoyalangan API ortiga qo'ying)
- Bulk amallar (ko'p tanlash + o'chirish/eksport)
- URL `searchParams`'da saqlanadigan filtr/sahifa holati
- `tags` uchun multi-select input, fayl yuklash maydoni
- Optimistik yangilanishlar (react-query / SWR adapteri)

---

## 📄 Litsenziya

Demo loyiha — o'z loyihangizda erkin foydalaning.

<div align="center"><sub>Next.js 16 · React 19 · Tailwind v4 · shadcn/ui · ❤️ bilan qurilgan</sub></div>
# universal-admin-panel
