import { useMemo } from 'react'
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

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
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

      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:gap-8">
        <aside className="shrink-0 lg:w-64" aria-label="Filters">
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

        <section className="min-w-0 flex-1" aria-label="Products">
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
