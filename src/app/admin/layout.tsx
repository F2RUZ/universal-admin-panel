import { redirect } from "next/navigation"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import { AdminRoot } from "@/admin/admin-root"
import { AdminSidebar } from "@/admin/ui/admin-sidebar"
import { AdminHeader } from "@/admin/ui/admin-header"
import { getSession } from "@/auth/session"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Asosiy himoya qatlami — ma'lumotga eng yaqin joyda tekshiriladi.
  const user = await getSession()
  if (!user) redirect("/login")

  return (
    <AdminRoot>
      <TooltipProvider delayDuration={0}>
        <SidebarProvider>
          <AdminSidebar user={user} />
          <SidebarInset>
            <AdminHeader />
            <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
      <Toaster position="bottom-right" richColors />
    </AdminRoot>
  )
}
