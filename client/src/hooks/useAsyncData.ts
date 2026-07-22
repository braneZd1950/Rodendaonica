import { useCallback, useEffect, useState } from 'react'
import { getErrorMessage } from '../lib/errors'

interface UseAsyncDataState<T> {
  data: T | null
  loading: boolean
  error: string | null
  reload: () => void
}

export function useAsyncData<T>(loader: () => Promise<T>, deps: unknown[] = []): UseAsyncDataState<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  const reload = useCallback(() => setTick(value => value + 1), [])

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await loader()
        if (!cancelled) setData(result)
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err))
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- controlled via reload tick + deps
  }, [tick, ...deps])

  return { data, loading, error, reload }
}
