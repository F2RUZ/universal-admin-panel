import { createMockProvider } from "./mock-provider"
import { generateSeed } from "./seed"

/**
 * ============ INTEGRATSIYA NUQTASI ============
 * Butun panel shu yagona `dataProvider`'dan foydalanadi. Boshqa backendga
 * ulash uchun faqat shu qatorni almashtiring — UI'ga tegmaysiz:
 *
 *   export const dataProvider = createRestProvider({ baseUrl: "/api" })
 *   export const dataProvider = createSupabaseProvider(supabase)
 */
export const dataProvider = createMockProvider(generateSeed())
