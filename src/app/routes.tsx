import { Link, Route, Routes } from 'react-router-dom'
import ProductListingPage from '@/features/product-listing/ProductListingPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ProductListingPage />} />
      {/* /product/:id lands in Phase 4; until then unmatched paths get a minimal stub. */}
      <Route
        path="*"
        element={
          <main className="mx-auto max-w-7xl px-4 py-16 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Page not found</h1>
            <p className="mt-2 text-sm text-gray-500">The product detail page lands in Phase 4.</p>
            <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline">
              ← Back to products
            </Link>
          </main>
        }
      />
    </Routes>
  )
}
