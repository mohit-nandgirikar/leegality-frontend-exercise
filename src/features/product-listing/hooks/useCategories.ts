import { getCategories } from '@/api/productService'
import { useFetch, type UseFetchResult } from '@/hooks/useFetch'
import type { Category } from '@/types/product'

const cache = new Map<string, Category[]>()

/** Fetches the category list once per session. */
export function useCategories(): UseFetchResult<Category[]> {
  return useFetch(getCategories, { cache, cacheKey: 'all' })
}
