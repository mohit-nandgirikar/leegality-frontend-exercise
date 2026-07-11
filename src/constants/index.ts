export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://dummyjson.com'

/** Products shown per page in the listing grid. */
export const PAGE_SIZE = 12

/** Delay before price inputs trigger re-filtering. */
export const PRICE_DEBOUNCE_MS = 400

/** Shown when a product image fails to load. */
export const FALLBACK_IMAGE_SRC =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Ctext x='200' y='200' text-anchor='middle' dominant-baseline='middle' fill='%239ca3af' font-family='sans-serif' font-size='24'%3ENo image%3C/text%3E%3C/svg%3E"
