import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Command } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getSession } from "@/auth/session"
import { LoginForm } from "@/auth/login-form"

export const metadata: Metadata = {
  title: "Kirish",
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>
}) {
  // Allaqachon tizimga kirgan bo'lsa — to'g'ridan-to'g'ri panelga.
  const session = await getSession()
  if (session) redirect("/admin")

  const { from } = await searchParams

  return (
    <div className="bg-grid flex min-h-screen items-center justify-center bg-background p-6">
      <div className="animate-in fade-in zoom-in-95 fill-mode-both w-full max-w-sm duration-500">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Command className="size-6" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Acme Admin</h1>
            <p className="text-sm text-muted-foreground">Universal boshqaruv paneli</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tizimga kirish</CardTitle>
            <CardDescription>Davom etish uchun ma&apos;lumotlaringizni kiriting.</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm from={from} />

            <div className="mt-5 rounded-lg border border-dashed border-border bg-muted/40 p-3 text-xs text-muted-foreground">
              <p className="mb-1 font-medium text-foreground">Demo hisoblar:</p>
              <p>
                <span className="font-mono">admin@acme.dev</span> /{" "}
                <span className="font-mono">admin123</span>
              </p>
              <p>
                <span className="font-mono">manager@acme.dev</span> /{" "}
                <span className="font-mono">manager123</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
