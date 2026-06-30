import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import { AdminRoot } from "@/admin/admin-root"
import { AdminSidebar } from "@/admin/ui/admin-sidebar"
import { AdminHeader } from "@/admin/ui/admin-header"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminRoot>
      <TooltipProvider delayDuration={0}>
        <SidebarProvider>
          <AdminSidebar />
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
