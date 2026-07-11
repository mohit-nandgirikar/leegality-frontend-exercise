import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ApiError } from '@/api/client'
import { useFetch } from './useFetch'

// Fetchers are defined outside render callbacks: in production code callers
// memoize with useCallback, and useFetch treats identity as request identity.

describe('useFetch', () => {
  it('starts loading, then exposes the resolved data', async () => {
    const fetcher = vi.fn().mockResolvedValue('payload')

    const { result } = renderHook(() => useFetch<string>(fetcher))

    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeNull()

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.data).toBe('payload')
    expect(result.current.error).toBeNull()
  })

  it('normalizes failures into ApiError state', async () => {
    const fetcher = vi.fn().mockRejectedValue(new ApiError('Request failed with status 500', 500))

    const { result } = renderHook(() => useFetch<string>(fetcher))

    await waitFor(() => expect(result.current.error).not.toBeNull())
    expect(result.current.error?.status).toBe(500)
    expect(result.current.data).toBeNull()
    expect(result.current.isLoading).toBe(false)
  })

  it('ignores aborted requests instead of surfacing them as errors', async () => {
    const fetcher = vi.fn().mockRejectedValue(new DOMException('Aborted', 'AbortError'))

    const { result } = renderHook(() => useFetch<string>(fetcher))

    await act(async () => {
      await Promise.resolve()
    })
    expect(result.current.error).toBeNull()
  })

  it('serves a cache hit synchronously without calling the fetcher', async () => {
    const cache = new Map<string, string>([['key', 'cached']])
    const fetcher = vi.fn()

    const { result } = renderHook(() => useFetch<string>(fetcher, { cache, cacheKey: 'key' }))

    await waitFor(() => expect(result.current.data).toBe('cached'))
    expect(fetcher).not.toHaveBeenCalled()
  })

  it('writes successful responses to the cache', async () => {
    const cache = new Map<string, string>()
    const fetcher = vi.fn().mockResolvedValue('fresh')

    const { result } = renderHook(() => useFetch<string>(fetcher, { cache, cacheKey: 'key' }))

    await waitFor(() => expect(result.current.data).toBe('fresh'))
    expect(cache.get('key')).toBe('fresh')
  })

  it('re-runs the request when refetch is called after an error', async () => {
    const fetcher = vi
      .fn()
      .mockRejectedValueOnce(new ApiError('boom', 500))
      .mockResolvedValueOnce('recovered')

    const { result } = renderHook(() => useFetch<string>(fetcher))

    await waitFor(() => expect(result.current.error).not.toBeNull())

    act(() => result.current.refetch())

    await waitFor(() => expect(result.current.data).toBe('recovered'))
    expect(result.current.error).toBeNull()
    expect(fetcher).toHaveBeenCalledTimes(2)
  })

  it('switches to a new request when the fetcher identity changes', async () => {
    const first = vi.fn().mockResolvedValue('first')
    const second = vi.fn().mockResolvedValue('second')

    const { result, rerender } = renderHook(({ fetcher }) => useFetch<string>(fetcher), {
      initialProps: { fetcher: first },
    })

    await waitFor(() => expect(result.current.data).toBe('first'))

    rerender({ fetcher: second })

    // Render-time reset: previous data is dropped before the new fetch lands.
    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeNull()

    await waitFor(() => expect(result.current.data).toBe('second'))
  })
})
