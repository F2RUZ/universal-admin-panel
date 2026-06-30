"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { LayoutDashboard, Plus, Search, Settings } from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { resources } from "@/admin/registry"

export function CommandMenu() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])

  const go = (href: string) => {
    setOpen(false)
    router.push(href)
  }

  return (
    <>
      {/* Header'dagi qidiruv tugmasi — ⌘K ni ham ochadi */}
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="h-9 w-full justify-start gap-2 px-3 text-muted-foreground sm:w-56 lg:w-64"
      >
        <Search className="size-4" />
        <span className="flex-1 text-left">Qidirish yoki buyruq...</span>
        <kbd className="pointer-events-none hidden items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium sm:inline-flex">
          ⌘K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen} title="Buyruqlar paneli">
        <CommandInput placeholder="Resurs yoki amalni yozing..." />
        <CommandList>
          <CommandEmpty>Hech narsa topilmadi.</CommandEmpty>

          <CommandGroup heading="Boshqaruv">
            <CommandItem value="dashboard boshqaruv panel" onSelect={() => go("/admin")}>
              <LayoutDashboard />
              Boshqaruv paneli
            </CommandItem>
            <CommandItem value="settings sozlamalar" onSelect={() => go("/admin/settings")}>
              <Settings />
              Sozlamalar
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Resurslar">
            {resources.map((res) => (
              <CommandItem
                key={res.name}
                value={`${res.labelPlural} ${res.name} ${res.label}`}
                onSelect={() => go(`/admin/${res.name}`)}
              >
                <res.icon />
                {res.labelPlural}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Yangi yaratish">
            {resources.map((res) => (
              <CommandItem
                key={res.name}
                value={`yangi ${res.label} ${res.name} create new`}
                onSelect={() => go(`/admin/${res.name}/new`)}
              >
                <Plus />
                Yangi {res.label.toLowerCase()}
                <CommandShortcut>{res.name}</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
