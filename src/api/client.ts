import { API_BASE_URL } from '@/constants'

/** Normalized error for HTTP and network failures; `status` is set for HTTP errors. */
export class ApiError extends Error {
  readonly status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

interface RequestOptions {
  /** Query params; `undefined` values are omitted. */
  params?: Record<string, string | number | undefined>
  signal?: AbortSignal
}

/**
 * Typed GET wrapper around fetch. Normalizes HTTP and network failures into
 * ApiError, but lets AbortError propagate untouched so callers can tell
 * cancellation apart from real failures.
 */
export async function getJson<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = new URL(path, API_BASE_URL)
  for (const [key, value] of Object.entries(options.params ?? {})) {
    if (value !== undefined) url.searchParams.set(key, String(value))
  }

  let response: Response
  try {
    response = await fetch(url, { signal: options.signal })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw new ApiError('Network error — please check your connection and try again.')
  }

  if (!response.ok) {
    throw new ApiError(`Request failed with status ${response.status}`, response.status)
  }

  return response.json() as Promise<T>
}
