"use client"

import * as React from "react"

interface Options {
  duration?: number // ms
  decimals?: number
}

/**
 * Raqamni 0 dan `end` gacha silliq animatsiya bilan sanaydi.
 * requestAnimationFrame + easeOutExpo bilan — performant va "jonli".
 */
export function useCountUp(end: number, { duration = 1200, decimals = 0 }: Options = {}) {
  const [value, setValue] = React.useState(0)
  const frame = React.useRef<number | null>(null)
  const startTs = React.useRef<number | null>(null)

  React.useEffect(() => {
    // Foydalanuvchi animatsiyani kamaytirishni so'ragan bo'lsa — darhol natija.
    // (setState'ni rAF callback ichida chaqiramiz, effekt tanasida emas.)
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) {
      frame.current = requestAnimationFrame(() => setValue(end))
      return () => {
        if (frame.current !== null) cancelAnimationFrame(frame.current)
      }
    }

    const tick = (ts: number) => {
      if (startTs.current === null) startTs.current = ts
      const progress = Math.min((ts - startTs.current) / duration, 1)
      const eased = 1 - Math.pow(2, -10 * progress) // easeOutExpo
      setValue(end * eased)
      if (progress < 1) {
        frame.current = requestAnimationFrame(tick)
      } else {
        setValue(end)
      }
    }

    frame.current = requestAnimationFrame(tick)
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current)
      startTs.current = null
    }
  }, [end, duration])

  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor
}
