import { useCallback } from 'react'
import { ApiError } from '@/api/client'
import { getProductById } from '@/api/productService'
import { useFetch, type UseFetchResult } from '@/hooks/useFetch'
import type { Product } from '@/types/product'

const cache = new Map<string, Product>()

/**
 * Fetches one product by route id. A missing/invalid id surfaces as a 404
 * ApiError so the detail page can render its not-found state (Phase 4).
 */
export function useProduct(id: string | undefined): UseFetchResult<Product> {
  const fetcher = useCallback(
    (signal: AbortSignal) => {
      if (!id) return Promise.reject(new ApiError('Product not found', 404))
      return getProductById(id, signal)
    },
    [id],
  )

  return useFetch(fetcher, { cache, cacheKey: id })
}
