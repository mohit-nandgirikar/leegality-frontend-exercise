import type { ProductFilters, ProductSummary } from '@/types/product'

type Predicate = (product: ProductSummary) => boolean

function byPriceRange(min: number | null, max: number | null): Predicate {
  return (product) =>
    (min === null || product.price >= min) && (max === null || product.price <= max)
}

function byBrands(brands: readonly string[]): Predicate {
  if (brands.length === 0) return () => true
  const selected = new Set(brands)
  return (product) => product.brand !== undefined && selected.has(product.brand)
}

/**
 * Applies the client-side filters (price, brand) as composed predicates.
 * Category is not applied here — it is server-side via the category endpoint.
 * Adding a filter means adding a predicate; nothing existing changes.
 */
export function filterProducts(
  products: readonly ProductSummary[],
  filters: ProductFilters,
): ProductSummary[] {
  const predicates = [byPriceRange(filters.minPrice, filters.maxPrice), byBrands(filters.brands)]
  return products.filter((product) => predicates.every((matches) => matches(product)))
}

/** Unique brands in the dataset, sorted — the brand filter's facet list. */
export function extractBrands(products: readonly ProductSummary[]): string[] {
  const brands = new Set<string>()
  for (const product of products) {
    if (product.brand) brands.add(product.brand)
  }
  return [...brands].sort((a, b) => a.localeCompare(b))
}
