"use client"

import * as React from "react"
import { AdminProvider } from "./admin-context"
import { dataProvider } from "./data/provider"

/**
 * Client chegarasi: `dataProvider` (funksiyalar) shu yerda, client tomonda
 * import qilinadi — shuning uchun server→client orqali prop sifatida
 * uzatilmaydi. Backend almashtirish uchun `data/provider.ts`'ni tahrirlang.
 */
export function AdminRoot({ children }: { children: React.ReactNode }) {
  return <AdminProvider dataProvider={dataProvider}>{children}</AdminProvider>
}
