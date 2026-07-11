/**
 * Listing-card fields — the trimmed shape fetched via DummyJSON's `select`
 * param (`id` is always included by the API regardless of selection).
 */
export interface ProductSummary {
  id: number
  title: string
  category: string
  price: number
  rating: number
  /** Some DummyJSON products (e.g. groceries) have no brand. */
  brand?: string
  thumbnail: string
}

/** Full product from GET /products/:id — only the fields this app consumes. */
export interface Product extends ProductSummary {
  description: string
  discountPercentage: number
  stock: number
  images: string[]
}

export interface ProductsResponse {
  products: ProductSummary[]
  total: number
  skip: number
  limit: number
}

/** Shape returned by GET /products/categories. */
export interface Category {
  slug: string
  name: string
  url: string
}

/** All filter state for the listing page; serialized to/from URL search params. */
export interface ProductFilters {
  category: string | null
  brands: string[]
  minPrice: number | null
  maxPrice: number | null
}
