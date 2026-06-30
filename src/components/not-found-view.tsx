import Link from "next/link"
import { Home, Compass } from "lucide-react"

import { Button } from "@/components/ui/button"
import { BackButton } from "@/components/back-button"

/**
 * Server komponent — statik matn SSR HTML'da bo'ladi (flash yo'q, SEO yaxshi).
 * Faqat "Orqaga" tugmasi interaktiv (alohida client komponent).
 */
export function NotFoundView({
  homeHref = "/admin",
  homeLabel = "Boshqaruv paneliga",
}: {
  homeHref?: string
  homeLabel?: string
}) {
  return (
    <div className="animate-in fade-in zoom-in-95 fill-mode-both relative flex w-full flex-col items-center justify-center gap-6 py-16 text-center duration-500">
      {/* Katta gradientli 404 + yumshoq nur */}
      <div className="relative">
        <span className="bg-linear-to-b from-primary to-primary/25 bg-clip-text text-[6.5rem] leading-none font-bold tracking-tighter text-transparent select-none sm:text-[9rem]">
          404
        </span>
        <div
          aria-hidden
          className="absolute inset-0 -z-10 rounded-full bg-primary/20 blur-3xl"
        />
      </div>

      <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
        <Compass className="size-6" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Sahifa topilmadi</h1>
        <p className="max-w-md text-balance text-muted-foreground">
          Siz qidirgan sahifa mavjud emas, ko&apos;chirilgan yoki o&apos;chirilgan
          bo&apos;lishi mumkin. Manzilni tekshiring yoki bosh sahifaga qayting.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <BackButton />
        <Button asChild>
          <Link href={homeHref}>
            <Home />
            {homeLabel}
          </Link>
        </Button>
      </div>
    </div>
  )
}
