import * as React from "react"

const MOBILE_BREAKPOINT = 768

function subscribe(callback: () => void) {
  const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
  mql.addEventListener("change", callback)
  return () => mql.removeEventListener("change", callback)
}

/**
 * Ekran kengligini tashqi store sifatida kuzatadi. `useSyncExternalStore`
 * effekt ichida setState chaqirmaydi (Next 16 react-hooks qoidasiga mos)
 * va SSR'da xavfsiz (server snapshot = false).
 */
export function useIsMobile() {
  return React.useSyncExternalStore(
    subscribe,
    () => window.innerWidth < MOBILE_BREAKPOINT,
    () => false
  )
}
