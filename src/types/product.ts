/** DummyJSON product — only the fields this app consumes. */
export interface Product {
  id: number
  title: string
  description: string
  category: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  /** Some DummyJSON products (e.g. groceries) have no brand. */
  brand?: string
  thumbnail: string
  images: string[]
}

export interface ProductsResponse {
  products: Product[]
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
