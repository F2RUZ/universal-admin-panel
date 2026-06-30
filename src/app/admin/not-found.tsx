import { NotFoundView } from "@/components/not-found-view"

/**
 * Admin ichidagi 404 — sidebar va header chrome'i saqlanadi
 * (notFound() noma'lum resurs uchun shu boundary'ga tushadi).
 */
export default function AdminNotFound() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <NotFoundView />
    </div>
  )
}
