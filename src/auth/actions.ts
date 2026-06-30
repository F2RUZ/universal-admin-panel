"use server"

import { redirect } from "next/navigation"
import { findUserByCredentials } from "./users"
import { createSession, deleteSession } from "./session"

export interface LoginState {
  error?: string
}

/** Open-redirect'dan himoya: faqat ichki `/admin...` manzillarga ruxsat. */
function safeRedirect(from: unknown): string {
  const path = typeof from === "string" ? from : ""
  return path.startsWith("/admin") ? path : "/admin"
}

export async function login(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")

  if (!email || !password) {
    return { error: "Email va parolni kiriting." }
  }

  const user = findUserByCredentials(email, password)
  if (!user) {
    return { error: "Email yoki parol noto'g'ri." }
  }

  await createSession(user)
  redirect(safeRedirect(formData.get("from")))
}

export async function logout(): Promise<void> {
  await deleteSession()
  redirect("/login")
}
