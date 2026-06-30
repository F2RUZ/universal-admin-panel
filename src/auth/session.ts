import { cookies } from "next/headers"
import { signToken, verifyToken } from "./token"
import { AUTH_SECRET, SESSION_COOKIE, SESSION_MAX_AGE_MS } from "./config"
import type { AuthUser } from "./users"

/**
 * Sessiya boshqaruvi (server-side). Cookie httpOnly + imzolangan token.
 * `AUTH_SECRET` env'dan olinadi; dev fallback faqat lokal uchun.
 */

const COOKIE_NAME = SESSION_COOKIE
const MAX_AGE_MS = SESSION_MAX_AGE_MS

export interface SessionUser {
  id: string
  email: string
  name: string
  role: string
}

export async function createSession(user: AuthUser): Promise<void> {
  const exp = Date.now() + MAX_AGE_MS
  const token = await signToken(
    { sub: user.id, email: user.email, name: user.name, role: user.role, exp },
    AUTH_SECRET
  )
  const store = await cookies()
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(exp),
  })
}

export async function getSession(): Promise<SessionUser | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value
  const payload = await verifyToken(token, AUTH_SECRET)
  if (!payload) return null
  return {
    id: payload.sub,
    email: payload.email,
    name: payload.name,
    role: payload.role,
  }
}

export async function deleteSession(): Promise<void> {
  const store = await cookies()
  store.delete(COOKIE_NAME)
}
