import { lazy, Suspense } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { ProductDetailSkeleton } from '@/features/product-detail/components/ProductDetailSkeleton'
import ProductListingPage from '@/features/product-listing/ProductListingPage'
import { ErrorBoundary } from './ErrorBoundary'
import { NotFoundPage } from './NotFoundPage'

/** Code-split: the detail chunk loads on first visit to /product/:id. */
const ProductDetailPage = lazy(() => import('@/features/product-detail/ProductDetailPage'))

export function AppRoutes() {
  // Keying the route boundaries by pathname resets a crashed route on
  // navigation. Search-param changes (filters) keep the same key, so the
  // listing never remounts while filtering.
  const { pathname } = useLocation()

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ErrorBoundary key={pathname}>
            <ProductListingPage />
          </ErrorBoundary>
        }
      />
      <Route
        path="/product/:id"
        element={
          <ErrorBoundary key={pathname}>
            <Suspense fallback={<ProductDetailSkeleton />}>
              <ProductDetailPage />
            </Suspense>
          </ErrorBoundary>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
