import { memo } from 'react'
import { Link } from 'react-router-dom'
import { RatingStars } from '@/components/ui/RatingStars'
import type { ProductSummary } from '@/types/product'
import { formatPrice } from '@/utils/format'
import { handleImageError } from '@/utils/image'

interface ProductCardProps {
  product: ProductSummary
}

/**
 * Memoized: up to PAGE_SIZE cards render per page, and filter/pagination
 * interactions re-render the parent — unchanged cards must not re-render.
 */
export const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
  const isTopRated = product.rating >= 4.5

  return (
    <Link
      to={`/product/${product.id}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-350 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:border-amazon-orange/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amazon-orange focus-visible:ring-offset-2"
    >
      {/* Top Rated Badge */}
      {isTopRated && (
        <span className="absolute top-3.5 left-3.5 z-10 rounded-md bg-amazon-dark px-2.5 py-1 text-[10px] font-heading font-black tracking-wide text-amazon-orange shadow-xs border border-amazon-orange/20 select-none">
          TOP RATED
        </span>
      )}

      {/* Image Gallery wrapper */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-50/50 flex items-center justify-center p-6 border-b border-gray-100/80">
        <img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          decoding="async"
          onError={handleImageError}
          className="h-full w-full object-contain mix-blend-multiply transition-transform duration-350 ease-out group-hover:scale-[1.06]"
        />
        {/* Subtle hover glow backdrop */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.015] transition-colors duration-350" />
      </div>

      {/* Details Area */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        {/* Brand label */}
        {product.brand && (
          <span className="text-[10px] font-heading font-extrabold tracking-wider text-amber-700 uppercase">
            {product.brand}
          </span>
        )}

        {/* Product Title */}
        <h2 className="line-clamp-2 font-heading text-[13.5px] font-bold text-gray-800 leading-snug group-hover:text-[#007185] transition-colors duration-200 min-h-9">
          {product.title}
        </h2>

        {/* Stars */}
        <div className="mt-0.5">
          <RatingStars rating={product.rating} />
        </div>

        {/* Pricing Info */}
        <div className="mt-auto pt-2.5 flex items-baseline justify-between border-t border-gray-100">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase font-bold tracking-widest text-gray-500">
              Price
            </span>
            <span className="text-[17px] font-black text-gray-900 leading-none mt-0.5">
              {formatPrice(product.price)}
            </span>
          </div>
          <span className="text-[10px] font-bold text-[#007185] group-hover:underline">
            View Details
          </span>
        </div>
      </div>
    </Link>
  )
})
