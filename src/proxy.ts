import { NextResponse, type NextRequest } from "next/server"
import { verifyToken } from "@/auth/token"
import { AUTH_SECRET, SESSION_COOKIE } from "@/auth/config"

/**
 * Proxy (Next 16'da "middleware" shunday nomlanadi) — optimistik auth tekshiruvi.
 * Faqat cookie'dagi token imzosini tekshiradi (DB so'rovi yo'q). Asosiy himoya
 * server tomonida (admin layout `getSession()`) amalga oshiriladi — qatlamli xavfsizlik.
 */
export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtected = path === "/admin" || path.startsWith("/admin/")
  const isAuthPage = path === "/login"

  const token = req.cookies.get(SESSION_COOKIE)?.value
  const session = await verifyToken(token, AUTH_SECRET)

  // Himoyalangan sahifaga sessiyasiz kirsa → login (qaytish manzili bilan)
  if (isProtected && !session) {
    const url = new URL("/login", req.nextUrl)
    url.searchParams.set("from", path)
    return NextResponse.redirect(url)
  }

  // Sessiya bor bo'lsa, login sahifasidan → panelga
  if (isAuthPage && session) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  // Statik fayllar va Next ichki yo'llaridan tashqari hammasida ishlaydi.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
}
