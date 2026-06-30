"use client"

import * as React from "react"
import type { DataProvider } from "@/admin/types"

const AdminContext = React.createContext<DataProvider | null>(null)

/**
 * Butun panelni o'raydi va `dataProvider`'ni taqdim etadi. App ildizida
 * bir marta ulanadi — backend almashtirmoqchi bo'lsangiz faqat shu yerga
 * boshqa provider uzating.
 */
export function AdminProvider({
  dataProvider,
  children,
}: {
  dataProvider: DataProvider
  children: React.ReactNode
}) {
  return <AdminContext value={dataProvider}>{children}</AdminContext>
}

export function useDataProvider(): DataProvider {
  const ctx = React.useContext(AdminContext)
  if (!ctx) {
    throw new Error("useDataProvider <AdminProvider> ichida ishlatilishi kerak")
  }
  return ctx
}
