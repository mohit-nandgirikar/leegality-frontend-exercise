import { memo, type SyntheticEvent } from 'react'
import { Link } from 'react-router-dom'
import { RatingStars } from '@/components/ui/RatingStars'
import { FALLBACK_IMAGE_SRC } from '@/constants'
import type { ProductSummary } from '@/types/product'
import { formatPrice } from '@/utils/format'

interface ProductCardProps {
  product: ProductSummary
}

function handleImageError(event: SyntheticEvent<HTMLImageElement>) {
  event.currentTarget.onerror = null
  event.currentTarget.src = FALLBACK_IMAGE_SRC
}

/**
 * Memoized: up to PAGE_SIZE cards render per page, and filter/pagination
 * interactions re-render the parent — unchanged cards must not re-render.
 */
export const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      to={`/product/${product.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      <div className="aspect-square w-full overflow-hidden bg-gray-100">
        <img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          decoding="async"
          onError={handleImageError}
          className="h-full w-full object-contain transition-transform duration-200 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="line-clamp-2 text-sm font-medium text-gray-900">{product.title}</h3>
        <RatingStars rating={product.rating} />
        <p className="mt-auto pt-1 text-lg font-semibold text-gray-900">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  )
})
