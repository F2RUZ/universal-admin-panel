"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ModeToggle } from "@/components/mode-toggle"
import { AccentSwitcher } from "@/components/accent-switcher"
import { getResource } from "@/admin/registry"
import { CommandMenu } from "./command-menu"

interface Crumb {
  label: string
  href?: string
}

function buildCrumbs(pathname: string): Crumb[] {
  const parts = pathname.split("/").filter(Boolean) // ["admin", res?, id?, "edit"?]
  const crumbs: Crumb[] = [{ label: "Boshqaruv", href: "/admin" }]

  if (parts[1] === "settings") {
    crumbs.push({ label: "Sozlamalar" })
    return crumbs
  }

  if (parts[1]) {
    const res = getResource(parts[1])
    crumbs.push({
      label: res?.labelPlural ?? parts[1],
      href: `/admin/${parts[1]}`,
    })
  }

  if (parts[2] === "new") {
    crumbs.push({ label: "Yangi" })
  } else if (parts[2]) {
    crumbs.push({ label: parts[3] === "edit" ? "Tahrirlash" : "Tafsilot" })
  }

  // Oxirgi crumb havolasiz (joriy sahifa)
  if (crumbs.length > 1) delete crumbs[crumbs.length - 1].href
  return crumbs
}

export function AdminHeader() {
  const pathname = usePathname()
  const crumbs = buildCrumbs(pathname)

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur-md">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-1 data-[orientation=vertical]:h-4" />

      <Breadcrumb className="hidden md:block">
        <BreadcrumbList>
          {crumbs.map((c, i) => {
            const last = i === crumbs.length - 1
            return (
              <React.Fragment key={`${c.label}-${i}`}>
                <BreadcrumbItem>
                  {last || !c.href ? (
                    <BreadcrumbPage>{c.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={c.href}>{c.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!last && <BreadcrumbSeparator />}
              </React.Fragment>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center gap-2">
        <CommandMenu />
        <AccentSwitcher />
        <ModeToggle />
      </div>
    </header>
  )
}
