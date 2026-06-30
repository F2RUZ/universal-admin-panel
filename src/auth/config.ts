/**
 * Neytral auth konfiguratsiyasi — next/headers'siz, shuning uchun proxy ham,
 * server ham xavfsiz import qiladi.
 */
export const SESSION_COOKIE = "session"
export const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000 // 7 kun

export const AUTH_SECRET =
  process.env.AUTH_SECRET ?? "dev-insecure-secret-min-32-chars-change-me!!"
