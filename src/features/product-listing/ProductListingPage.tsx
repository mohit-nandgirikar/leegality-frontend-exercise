import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { Skeleton } from '@/components/ui/Skeleton'
import { PAGE_SIZE } from '@/constants'
import type { ProductSummary } from '@/types/product'
import { Pagination } from './components/Pagination'
import { ProductGrid } from './components/ProductGrid'
import { useProducts } from './hooks/useProducts'
import { getTotalPages, paginate } from './utils/paginate'

const NO_PRODUCTS: ProductSummary[] = []

function parsePage(raw: string | null): number {
  const parsed = Number(raw)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1
}

export default function ProductListingPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  // Category/price/brand filters arrive in Phase 3 via useProductFilters.
  const { data, isLoading, error, refetch } = useProducts(null)

  const products = data?.products ?? NO_PRODUCTS
  const totalPages = getTotalPages(products.length, PAGE_SIZE)
  // Clamp so a stale ?page= from a shared/bookmarked URL still shows results.
  const currentPage = Math.min(parsePage(searchParams.get('page')), totalPages)

  const pageProducts = useMemo(
    () => paginate(products, currentPage, PAGE_SIZE),
    [products, currentPage],
  )

  const handlePageChange = useCallback(
    (page: number) => {
      setSearchParams((params) => {
        const next = new URLSearchParams(params)
        if (page <= 1) next.delete('page')
        else next.set('page', String(page))
        return next
      })
      window.scrollTo({ top: 0 })
    },
    [setSearchParams],
  )

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Product Catalog</h1>
        <div className="mt-1 text-sm text-gray-500" aria-live="polite">
          {isLoading ? (
            <Skeleton className="inline-block h-4 w-28 align-middle" />
          ) : (
            !error && `${products.length} products`
          )}
        </div>
      </header>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:gap-8">
        <aside className="shrink-0 lg:w-64">
          <div className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-400">
            Filters land in Phase 3
          </div>
        </aside>

        <section className="min-w-0 flex-1" aria-label="Products">
          {error ? (
            <ErrorMessage message={error.message} onRetry={refetch} />
          ) : !isLoading && products.length === 0 ? (
            <EmptyState
              title="No products found"
              description="Try adjusting your filters or check back later."
            />
          ) : (
            <>
              <ProductGrid products={pageProducts} isLoading={isLoading} />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </section>
      </div>
    </main>
  )
}
