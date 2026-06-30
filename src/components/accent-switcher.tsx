"use client"

import * as React from "react"
import { Check, Palette } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const ACCENTS = [
  { value: "violet", label: "Violet", swatch: "oklch(0.55 0.22 285)" },
  { value: "blue", label: "Blue", swatch: "oklch(0.55 0.2 256)" },
  { value: "emerald", label: "Emerald", swatch: "oklch(0.6 0.13 168)" },
  { value: "rose", label: "Rose", swatch: "oklch(0.6 0.22 12)" },
  { value: "amber", label: "Amber", swatch: "oklch(0.74 0.16 68)" },
] as const

export function AccentSwitcher() {
  // "current" faqat menyu ochilganda DOM'dan o'qiladi — effekt ichida
  // setState chaqirilmaydi (Next 16 qoidasiga mos). Boshlang'ich qiymat
  // no-flash skript orqali <html data-accent>'ga allaqachon o'rnatilgan.
  const [current, setCurrent] = React.useState("violet")

  const apply = (value: string) => {
    document.documentElement.setAttribute("data-accent", value)
    try {
      localStorage.setItem("accent", value)
    } catch {
      // localStorage mavjud emas — e'tiborsiz
    }
    setCurrent(value)
  }

  return (
    <DropdownMenu
      onOpenChange={(o) => {
        if (o) setCurrent(document.documentElement.getAttribute("data-accent") || "violet")
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Brend rangi">
          <Palette className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>Brend rangi</DropdownMenuLabel>
        {ACCENTS.map((a) => (
          <DropdownMenuItem
            key={a.value}
            onSelect={() => apply(a.value)}
            className="gap-2"
          >
            <span
              className="size-4 rounded-full border border-border/50 shadow-sm"
              style={{ backgroundColor: a.swatch }}
            />
            <span className="flex-1">{a.label}</span>
            <Check className={cn("size-4", current === a.value ? "opacity-100" : "opacity-0")} />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
