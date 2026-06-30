/**
 * Imzolangan sessiya token'i — Web Crypto HMAC-SHA256 (runtime-agnostik:
 * proxy ham, server ham ishlatadi; yangi dependency yo'q).
 * Format: base64url(JSON payload) + "." + base64url(HMAC).
 *
 * Eslatma: bu — DEMO. Production'da `jose` (JWT/JWE) yoki auth kutubxonasidan
 * foydalaning va `AUTH_SECRET`'ni xavfsiz saqlang.
 */

export interface SessionPayload {
  sub: string
  email: string
  name: string
  role: string
  exp: number // millisekundlarda
}

// ArrayBuffer'ga aniq bog'langan baytlar (crypto.subtle BufferSource talab qiladi).
function utf8(s: string): Uint8Array<ArrayBuffer> {
  const src = new TextEncoder().encode(s)
  const out = new Uint8Array(src.length)
  out.set(src)
  return out
}

function bytesToB64url(bytes: Uint8Array): string {
  let bin = ""
  for (const b of bytes) bin += String.fromCharCode(b)
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function b64urlToBytes(s: string): Uint8Array<ArrayBuffer> {
  const norm = s.replace(/-/g, "+").replace(/_/g, "/")
  const bin = atob(norm)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return bytes
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    utf8(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  )
}

export async function signToken(payload: SessionPayload, secret: string): Promise<string> {
  const data = bytesToB64url(utf8(JSON.stringify(payload)))
  const sig = await crypto.subtle.sign("HMAC", await hmacKey(secret), utf8(data))
  return `${data}.${bytesToB64url(new Uint8Array(sig))}`
}

export async function verifyToken(
  token: string | undefined | null,
  secret: string
): Promise<SessionPayload | null> {
  if (!token) return null
  const dot = token.indexOf(".")
  if (dot <= 0) return null
  const data = token.slice(0, dot)
  const sig = token.slice(dot + 1)
  if (!data || !sig) return null

  let valid: boolean
  try {
    valid = await crypto.subtle.verify("HMAC", await hmacKey(secret), b64urlToBytes(sig), utf8(data))
  } catch {
    return null
  }
  if (!valid) return null

  try {
    const payload = JSON.parse(new TextDecoder().decode(b64urlToBytes(data))) as SessionPayload
    if (!payload?.sub || typeof payload.exp !== "number") return null
    if (Date.now() > payload.exp) return null
    return payload
  } catch {
    return null
  }
}
