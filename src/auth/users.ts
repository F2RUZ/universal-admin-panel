/**
 * DEMO foydalanuvchi do'koni. Production'da bu joyni haqiqiy DB + parol
 * hashlash (bcrypt/argon2) bilan almashtiring.
 */

export interface AuthUser {
  id: string
  email: string
  password: string // DEMO: ochiq matn. Production'da HASH saqlang!
  name: string
  role: string
}

export const authUsers: AuthUser[] = [
  { id: "usr_admin", email: "admin@acme.dev", password: "admin123", name: "Sofia Rashidova", role: "admin" },
  { id: "usr_manager", email: "manager@acme.dev", password: "manager123", name: "Bekzod Normatov", role: "manager" },
]

export function findUserByCredentials(email: string, password: string): AuthUser | null {
  const user = authUsers.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())
  if (!user || user.password !== password) return null
  return user
}
