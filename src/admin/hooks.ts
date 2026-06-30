"use client"

import * as React from "react"
import { useDataProvider } from "@/admin/admin-context"
import type { GetListParams, RecordItem } from "@/admin/types"

/**
 * Data hook'lari. Yuklanish holati `loadedKey`'dan DERIVE qilinadi —
 * effekt tanasida sinxron setState chaqirilmaydi (Next 16 qoidasiga mos).
 * setState faqat promise callback yoki subscribe callback ichida.
 */

interface ListState {
  key: string | null
  data: RecordItem[]
  total: number
  error: string | null
}

export function useList(resource: string, params: GetListParams) {
  const dp = useDataProvider()
  const key = JSON.stringify({ resource, params })
  const [tick, setTick] = React.useState(0)
  const [state, setState] = React.useState<ListState>({
    key: null,
    data: [],
    total: 0,
    error: null,
  })

  React.useEffect(() => {
    let active = true
    dp.getList(resource, params)
      .then((res) => {
        if (active) setState({ key, data: res.data, total: res.total, error: null })
      })
      .catch((err: unknown) => {
        if (active)
          setState({ key, data: [], total: 0, error: (err as Error).message ?? "Xatolik" })
      })
    return () => {
      active = false
    }
    // key params'ni to'liq qamrab oladi; tick — qo'lda/jonli refresh.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dp, key, tick])

  // Mutatsiyalardan keyin jonli yangilanish.
  React.useEffect(() => {
    return dp.subscribe?.(resource, () => setTick((t) => t + 1))
  }, [dp, resource])

  return {
    data: state.data,
    total: state.total,
    error: state.error,
    loading: state.key !== key,
    refetch: React.useCallback(() => setTick((t) => t + 1), []),
  }
}

interface OneState {
  key: string | null
  data: RecordItem | null
  error: string | null
}

export function useOne(resource: string, id: string | null) {
  const dp = useDataProvider()
  const key = `${resource}:${id}`
  const [tick, setTick] = React.useState(0)
  const [state, setState] = React.useState<OneState>({ key: null, data: null, error: null })

  React.useEffect(() => {
    if (!id) return
    let active = true
    dp.getOne(resource, id)
      .then((res) => {
        if (active) setState({ key, data: res, error: null })
      })
      .catch((err: unknown) => {
        if (active) setState({ key, data: null, error: (err as Error).message ?? "Xatolik" })
      })
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dp, key, tick])

  React.useEffect(() => {
    return dp.subscribe?.(resource, () => setTick((t) => t + 1))
  }, [dp, resource])

  return {
    data: state.data,
    error: state.error,
    loading: id != null && state.key !== key,
    refetch: React.useCallback(() => setTick((t) => t + 1), []),
  }
}

export function useMutations(resource: string) {
  const dp = useDataProvider()
  const [saving, setSaving] = React.useState(false)

  const create = React.useCallback(
    async (data: Record<string, unknown>) => {
      setSaving(true)
      try {
        return await dp.create(resource, data)
      } finally {
        setSaving(false)
      }
    },
    [dp, resource]
  )

  const update = React.useCallback(
    async (id: string, data: Record<string, unknown>) => {
      setSaving(true)
      try {
        return await dp.update(resource, id, data)
      } finally {
        setSaving(false)
      }
    },
    [dp, resource]
  )

  const remove = React.useCallback(
    async (id: string) => {
      setSaving(true)
      try {
        return await dp.delete(resource, id)
      } finally {
        setSaving(false)
      }
    },
    [dp, resource]
  )

  return { create, update, remove, saving }
}
