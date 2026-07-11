import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { Skeleton } from '@/components/ui/Skeleton'
import { PAGE_SIZE } from '@/constants'
import type { ProductSummary } from '@/types/product'
import { FilterSidebar } from './components/filters/FilterSidebar'
import { Pagination } from './components/Pagination'
import { ProductGrid } from './components/ProductGrid'
import { useCategories } from './hooks/useCategories'
import { useProductFilters } from './hooks/useProductFilters'
import { useProducts } from './hooks/useProducts'
import { extractBrands, filterProducts } from './utils/filterProducts'
import { getTotalPages, paginate } from './utils/paginate'

const NO_PRODUCTS: ProductSummary[] = []

export default function ProductListingPage() {
  const {
    filters,
    page,
    hasActiveFilters,
    setCategory,
    toggleBrand,
    setPriceRange,
    setPage,
    clearFilters,
  } = useProductFilters()

  const { data, isLoading, error, refetch } = useProducts(filters.category)
  const categoriesQuery = useCategories()

  // Mobile-only disclosure; the sidebar is always visible from lg up. The
  // panel stays mounted (CSS-hidden) so price input state survives toggling.
  const [showFilters, setShowFilters] = useState(false)

  const allProducts = data?.products ?? NO_PRODUCTS
  const brands = useMemo(() => extractBrands(allProducts), [allProducts])
  const filteredProducts = useMemo(
    () => filterProducts(allProducts, filters),
    [allProducts, filters],
  )

  const totalPages = getTotalPages(filteredProducts.length, PAGE_SIZE)
  // Clamp so a stale ?page= from a shared/bookmarked URL still shows results.
  const currentPage = Math.min(page, totalPages)
  const pageProducts = useMemo(
    () => paginate(filteredProducts, currentPage, PAGE_SIZE),
    [filteredProducts, currentPage],
  )

  const activeFilterCount =
    (filters.category !== null ? 1 : 0) +
    filters.brands.length +
    (filters.minPrice !== null ? 1 : 0) +
    (filters.maxPrice !== null ? 1 : 0)

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <a
        href="#products"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-10 focus:rounded-md focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to products
      </a>

      <header>
        <h1 className="text-2xl font-bold text-gray-900">Product Catalog</h1>
        <div className="mt-1 text-sm text-gray-500" aria-live="polite">
          {isLoading ? (
            <Skeleton className="inline-block h-4 w-28 align-middle" />
          ) : (
            !error && `${filteredProducts.length} products found`
          )}
        </div>
      </header>

      <button
        type="button"
        onClick={() => setShowFilters((open) => !open)}
        aria-expanded={showFilters}
        aria-controls="filter-panel"
        className="mt-4 inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-blue-500 lg:hidden"
      >
        Filters
        {activeFilterCount > 0 && ` (${activeFilterCount})`}
        <span aria-hidden="true" className="text-xs">
          {showFilters ? '▲' : '▼'}
        </span>
      </button>

      <div className="mt-4 flex flex-col gap-6 lg:mt-6 lg:flex-row lg:gap-8">
        <aside
          id="filter-panel"
          aria-label="Filters"
          className={`shrink-0 lg:block lg:w-64 ${showFilters ? '' : 'hidden'}`}
        >
          <FilterSidebar
            categories={categoriesQuery.data}
            isCategoriesLoading={categoriesQuery.isLoading}
            brands={brands}
            isBrandsLoading={isLoading}
            filters={filters}
            hasActiveFilters={hasActiveFilters}
            onCategoryChange={setCategory}
            onBrandToggle={toggleBrand}
            onPriceRangeChange={setPriceRange}
            onClearFilters={clearFilters}
          />
        </aside>

        <section id="products" tabIndex={-1} className="min-w-0 flex-1" aria-label="Products">
          {error ? (
            <ErrorMessage message={error.message} onRetry={refetch} />
          ) : !isLoading && filteredProducts.length === 0 ? (
            <EmptyState
              title={hasActiveFilters ? 'No products match your filters' : 'No products found'}
              description={
                hasActiveFilters
                  ? 'Try widening the price range or removing some filters.'
                  : 'Check back later.'
              }
              action={
                hasActiveFilters ? <Button onClick={clearFilters}>Clear filters</Button> : undefined
              }
            />
          ) : (
            <>
              <ProductGrid products={pageProducts} isLoading={isLoading} />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          )}
        </section>
      </div>
    </main>
  )
}
