import { Route, Routes } from 'react-router-dom'
import ProductListingPage from '@/features/product-listing/ProductListingPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ProductListingPage />} />
    </Routes>
  )
}
