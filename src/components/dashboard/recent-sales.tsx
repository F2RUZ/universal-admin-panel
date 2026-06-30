import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { recentSales } from "@/lib/data"

const statusStyles: Record<string, string> = {
  muvaffaqiyatli:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  kutilmoqda:
    "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  bekor: "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400",
}

export function RecentSales() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>So’nggi sotuvlar</CardTitle>
        <CardDescription>Bu oyda 265 ta sotuv amalga oshdi</CardDescription>
      </CardHeader>
      <CardContent className="space-y-1">
        {recentSales.map((sale, i) => (
          <div
            key={sale.id}
            className="animate-in fade-in slide-in-from-right-2 fill-mode-both flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted/60"
            style={{ animationDelay: `${i * 70}ms`, animationDuration: "500ms" }}
          >
            <Avatar className="size-9">
              <AvatarFallback className="text-xs">{sale.avatar}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{sale.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {sale.email}
              </p>
            </div>
            <Badge
              variant="outline"
              className={cn("hidden rounded-full sm:inline-flex", statusStyles[sale.status])}
            >
              {sale.status}
            </Badge>
            <span className="text-sm font-medium tabular-nums">{sale.amount}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
