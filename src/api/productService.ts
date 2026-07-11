import { getJson } from './client'
import type { Category, Product, ProductsResponse } from '@/types/product'

/** Listing payload trimmed to the fields cards and filters actually use. */
const SUMMARY_FIELDS = 'title,category,price,rating,brand,thumbnail'

/**
 * `limit: 0` makes DummyJSON return the entire dataset in one response.
 * Filtering and pagination happen client-side — see IMPLEMENTATION_PLAN §3
 * for why server-side limit/skip breaks under client-only filters.
 */
const FULL_DATASET_PARAMS = { limit: 0, select: SUMMARY_FIELDS }

export function getProducts(signal?: AbortSignal): Promise<ProductsResponse> {
  return getJson('/products', { params: FULL_DATASET_PARAMS, signal })
}

export function getProductsByCategory(
  slug: string,
  signal?: AbortSignal,
): Promise<ProductsResponse> {
  return getJson(`/products/category/${encodeURIComponent(slug)}`, {
    params: FULL_DATASET_PARAMS,
    signal,
  })
}

export function getProductById(id: string | number, signal?: AbortSignal): Promise<Product> {
  return getJson(`/products/${encodeURIComponent(id)}`, { signal })
}

export function getCategories(signal?: AbortSignal): Promise<Category[]> {
  return getJson('/products/categories', { signal })
}
