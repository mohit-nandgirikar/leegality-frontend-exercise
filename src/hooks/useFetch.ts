import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '@/api/client'

export interface UseFetchOptions<T> {
  /** Module-level cache; a hit for `cacheKey` skips the network and loading state. */
  cache?: Map<string, T>
  /** Identity of this request in `cache`; when undefined, caching is skipped. */
  cacheKey?: string
}

export interface UseFetchResult<T> {
  data: T | null
  isLoading: boolean
  error: ApiError | null
  /** Re-runs the request; wired to Retry buttons in error UIs. */
  refetch: () => void
}

interface FetchState<T> {
  data: T | null
  isLoading: boolean
  error: ApiError | null
}

const LOADING: FetchState<never> = { data: null, isLoading: true, error: null }

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

function toApiError(error: unknown): ApiError {
  return error instanceof ApiError ? error : new ApiError('Something went wrong. Please try again.')
}

/**
 * Runs `fetcher` whenever its identity changes — callers memoize it with
 * useCallback, so its identity IS the request identity. An in-flight request
 * is aborted when it is superseded (or on unmount), which prevents both race
 * conditions and stale responses landing late.
 */
export function useFetch<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  { cache, cacheKey }: UseFetchOptions<T> = {},
): UseFetchResult<T> {
  const [state, setState] = useState<FetchState<T>>(LOADING)
  const [retryToken, setRetryToken] = useState(0)

  // Render-time reset: when the request identity changes, drop the previous
  // request's data in the same render so a stale frame never paints.
  const [lastFetcher, setLastFetcher] = useState(() => fetcher)
  if (fetcher !== lastFetcher) {
    setLastFetcher(() => fetcher)
    setState(LOADING)
  }

  useEffect(() => {
    const cached = cacheKey !== undefined ? cache?.get(cacheKey) : undefined
    if (cached !== undefined) {
      setState({ data: cached, isLoading: false, error: null })
      return
    }

    const controller = new AbortController()
    setState(LOADING)
    fetcher(controller.signal)
      .then((data) => {
        if (cache && cacheKey !== undefined) cache.set(cacheKey, data)
        setState({ data, isLoading: false, error: null })
      })
      .catch((error: unknown) => {
        if (isAbortError(error) || controller.signal.aborted) return
        setState({ data: null, isLoading: false, error: toApiError(error) })
      })

    return () => controller.abort()
  }, [fetcher, retryToken, cache, cacheKey])

  const refetch = useCallback(() => setRetryToken((token) => token + 1), [])

  return { ...state, refetch }
}
