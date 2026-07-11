import { Link, useParams } from 'react-router-dom'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { BackButton } from './components/BackButton'
import { ProductDetailSkeleton } from './components/ProductDetailSkeleton'
import { ProductInfo } from './components/ProductInfo'
import { useProduct } from './hooks/useProduct'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: product, isLoading, error, refetch } = useProduct(id)

  if (isLoading) return <ProductDetailSkeleton />

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <BackButton />
      <div className="mt-4">
        {error?.status === 404 ? (
          <EmptyState
            title="Product not found"
            description="This product doesn't exist or may have been removed."
            action={
              <Link
                to="/"
                className="inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                Browse all products
              </Link>
            }
          />
        ) : error ? (
          <ErrorMessage message={error.message} onRetry={refetch} />
        ) : (
          product && <ProductInfo product={product} />
        )}
      </div>
    </main>
  )
}
