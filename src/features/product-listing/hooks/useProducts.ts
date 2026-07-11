import { useCallback } from 'react'
import { getProducts, getProductsByCategory } from '@/api/productService'
import { useFetch, type UseFetchResult } from '@/hooks/useFetch'
import type { ProductsResponse } from '@/types/product'

/** Full-dataset responses keyed by category slug ('' = all categories). */
const cache = new Map<string, ProductsResponse>()

/**
 * Fetches the complete product dataset for a category (or all products when
 * `category` is null). Each dataset is fetched at most once per session;
 * revisits — including back-navigation from the detail page — render from
 * cache with zero network.
 */
export function useProducts(category: string | null): UseFetchResult<ProductsResponse> {
  const fetcher = useCallback(
    (signal: AbortSignal) =>
      category === null ? getProducts(signal) : getProductsByCategory(category, signal),
    [category],
  )

  return useFetch(fetcher, { cache, cacheKey: category ?? '' })
}
