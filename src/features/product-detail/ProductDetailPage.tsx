import { Link, useParams } from 'react-router-dom'
import { Header } from '@/components/ui/Header'
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
    <div className="min-h-screen bg-gray-100/60 flex flex-col pb-12">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex-1 w-full animate-fade-in-up">
        <BackButton />
        <div className="mt-4">
          {error?.status === 404 ? (
            <EmptyState
              title="Product not found"
              description="This product doesn't exist or may have been removed."
              action={
                <Link
                  to="/"
                  className="inline-block rounded-md bg-amazon-orange px-4 py-2 text-sm font-heading font-semibold text-amazon-dark transition-colors hover:bg-amazon-orange-hover"
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
    </div>
  )
}
