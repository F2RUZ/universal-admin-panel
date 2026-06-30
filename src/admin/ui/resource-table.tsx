"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Search,
  Plus,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  ChevronsUpDown,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from "@/components/ui/input-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

import { getResource } from "@/admin/registry"
import { useList, useMutations } from "@/admin/hooks"
import type { FieldDef, RecordItem, ResourceConfig } from "@/admin/types"
import { FieldValueView } from "./field-value"
import { DeleteDialog } from "./delete-dialog"

const PER_PAGE = 10

function SortHeader({
  field,
  sort,
  onSort,
}: {
  field: FieldDef
  sort: { field: string; order: "asc" | "desc" }
  onSort: (field: string) => void
}) {
  const active = sort.field === field.name
  return (
    <button
      type="button"
      onClick={() => onSort(field.name)}
      className="-ml-1 inline-flex items-center gap-1 rounded px-1 py-0.5 transition-colors hover:text-foreground"
    >
      {field.label}
      {active ? (
        sort.order === "asc" ? (
          <ArrowUp className="size-3.5" />
        ) : (
          <ArrowDown className="size-3.5" />
        )
      ) : (
        <ChevronsUpDown className="size-3.5 opacity-40" />
      )}
    </button>
  )
}

function RowActions({
  config,
  record,
  onDeleted,
}: {
  config: ResourceConfig
  record: RecordItem
  onDeleted: () => void
}) {
  const router = useRouter()
  const { remove } = useMutations(config.name)
  const [confirmOpen, setConfirmOpen] = React.useState(false)

  const handleDelete = async () => {
    await remove(record.id)
    toast.success(`${config.label} o'chirildi`, {
      description: config.recordLabel(record),
    })
    onDeleted()
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Amallar"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuItem onSelect={() => router.push(`/admin/${config.name}/${record.id}`)}>
            <Eye />
            Ko'rish
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => router.push(`/admin/${config.name}/${record.id}/edit`)}
          >
            <Pencil />
            Tahrirlash
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onSelect={() => setConfirmOpen(true)}>
            <Trash2 />
            O'chirish
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={`${config.label}ni o'chirish`}
        description={`"${config.recordLabel(record)}" butunlay o'chiriladi. Bu amalni qaytarib bo'lmaydi.`}
        onConfirm={handleDelete}
      />
    </>
  )
}

export function ResourceTable({ resourceName }: { resourceName: string }) {
  const config = getResource(resourceName)
  const router = useRouter()

  const [page, setPage] = React.useState(1)
  const [search, setSearch] = React.useState("")
  const [filters, setFilters] = React.useState<Record<string, string>>({})
  const [sort, setSort] = React.useState<{ field: string; order: "asc" | "desc" }>(
    config?.defaultSort ?? { field: "id", order: "desc" }
  )

  const params = React.useMemo(
    () => ({
      pagination: { page, perPage: PER_PAGE },
      sort,
      search,
      filters,
    }),
    [page, sort, search, filters]
  )

  const { data, total, loading, refetch } = useList(resourceName, params)

  if (!config) return null

  const columns = config.fields.filter((f) => !f.hideInTable)
  const filterFields = config.fields.filter((f) => f.filterable && f.options)
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))

  // Diapazondan chiqib ketgan sahifani render paytida tuzatamiz (o'chirish yoki
  // jonli yangilanish total'ni kamaytirganda bo'sh sahifada qolib ketmaslik uchun).
  // Bu React'ning hujjatlashtirilgan "prop o'zgarganda state'ni moslash" patterni —
  // effekt emas, shuning uchun set-state-in-effect qoidasini buzmaydi.
  if (!loading && page > totalPages) {
    setPage(totalPages)
  }

  const from = total === 0 ? 0 : (page - 1) * PER_PAGE + 1
  const to = Math.min(page * PER_PAGE, total)

  const toggleSort = (fieldName: string) => {
    setPage(1)
    setSort((prev) =>
      prev.field === fieldName
        ? { field: fieldName, order: prev.order === "asc" ? "desc" : "asc" }
        : { field: fieldName, order: "asc" }
    )
  }

  const setFilter = (name: string, value: string) => {
    setPage(1)
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const activeFilterCount =
    Object.values(filters).filter((v) => v && v !== "__all__").length + (search ? 1 : 0)

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <InputGroup className="sm:max-w-xs">
            <InputGroupAddon align="inline-start">
              <Search />
            </InputGroupAddon>
            <InputGroupInput
              placeholder={config.searchPlaceholder ?? "Qidirish..."}
              value={search}
              onChange={(e) => {
                setPage(1)
                setSearch(e.target.value)
              }}
            />
            {search && (
              <InputGroupAddon align="inline-end">
                <InputGroupButton size="icon-xs" onClick={() => setSearch("")}>
                  <X />
                </InputGroupButton>
              </InputGroupAddon>
            )}
          </InputGroup>

          {filterFields.map((f) => (
            <Select
              key={f.name}
              value={filters[f.name] ?? "__all__"}
              onValueChange={(v) => setFilter(f.name, v)}
            >
              <SelectTrigger size="sm" className="w-auto min-w-32">
                <SelectValue placeholder={f.label} />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="__all__">Barchasi: {f.label}</SelectItem>
                {f.options?.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={refetch} aria-label="Yangilash">
            <RefreshCw className={cn(loading && "animate-spin")} />
          </Button>
          <Button asChild>
            <Link href={`/admin/${config.name}/new`}>
              <Plus />
              Yangi {config.label.toLowerCase()}
            </Link>
          </Button>
        </div>
      </div>

      {/* Jadval */}
      <Card className="overflow-hidden py-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              {columns.map((f) => (
                <TableHead
                  key={f.name}
                  style={f.width ? { width: f.width } : undefined}
                  className={cn(f.align === "end" && "text-right")}
                >
                  {f.sortable ? (
                    <span className={cn(f.align === "end" && "flex justify-end")}>
                      <SortHeader field={f} sort={sort} onSort={toggleSort} />
                    </span>
                  ) : (
                    f.label
                  )}
                </TableHead>
              ))}
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              Array.from({ length: PER_PAGE }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((f) => (
                    <TableCell key={f.name}>
                      <Skeleton className="h-5 w-full max-w-28" />
                    </TableCell>
                  ))}
                  <TableCell>
                    <Skeleton className="size-7 rounded-md" />
                  </TableCell>
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length + 1} className="h-72">
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <config.icon />
                      </EmptyMedia>
                      <EmptyTitle>Hech narsa topilmadi</EmptyTitle>
                      <EmptyDescription>
                        {activeFilterCount > 0
                          ? "Filtr yoki qidiruvni o'zgartirib ko'ring."
                          : `Hozircha ${config.labelPlural.toLowerCase()} yo'q.`}
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            ) : (
              data.map((record) => (
                <TableRow
                  key={record.id}
                  className="group cursor-pointer"
                  onClick={() => router.push(`/admin/${config.name}/${record.id}`)}
                >
                  {columns.map((f) => (
                    <TableCell
                      key={f.name}
                      className={cn(f.align === "end" && "text-right")}
                    >
                      <FieldValueView field={f} record={record} />
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <RowActions config={config} record={record} onDeleted={refetch} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
        <span className="tabular-nums">
          {total > 0 ? (
            <>
              <span className="font-medium text-foreground">{from}</span>–
              <span className="font-medium text-foreground">{to}</span> /{" "}
              <span className="font-medium text-foreground">{total}</span>
            </>
          ) : (
            "0 natija"
          )}
        </span>
        <div className="flex items-center gap-2">
          <span className="tabular-nums">
            {page} / {totalPages}-sahifa
          </span>
          <Button
            variant="outline"
            size="icon-sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            aria-label="Oldingi"
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            aria-label="Keyingi"
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  )
}
