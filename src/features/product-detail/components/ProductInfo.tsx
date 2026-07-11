import { Link } from 'react-router-dom'
import { RatingStars } from '@/components/ui/RatingStars'
import type { Product } from '@/types/product'
import { formatCategoryName, formatPrice } from '@/utils/format'
import { handleImageError } from '@/utils/image'

interface ProductInfoProps {
  product: Product
}

export function ProductInfo({ product }: ProductInfoProps) {
  const hasDiscount = product.discountPercentage > 0 && product.discountPercentage < 90
  const originalPrice = product.price / (1 - product.discountPercentage / 100)

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <img
          src={product.images[0] ?? product.thumbnail}
          alt={product.title}
          decoding="async"
          onError={handleImageError}
          className="aspect-square w-full object-contain"
        />
      </div>

      <div>
        {product.brand && (
          <p className="text-sm font-medium tracking-wide text-gray-500 uppercase">
            {product.brand}
          </p>
        )}
        <h1 className="mt-1 text-2xl font-bold text-gray-900">{product.title}</h1>
        <div className="mt-2">
          <RatingStars rating={product.rating} />
        </div>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
          {hasDiscount && (
            <>
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(originalPrice)}
              </span>
              <span className="text-sm font-semibold text-green-700">
                {product.discountPercentage.toFixed(0)}% off
              </span>
            </>
          )}
        </div>

        <p className="mt-6 leading-relaxed text-gray-600">{product.description}</p>

        <dl className="mt-6 space-y-2 border-t border-gray-200 pt-4 text-sm">
          <div className="flex gap-2">
            <dt className="w-24 shrink-0 font-medium text-gray-500">Brand</dt>
            <dd className="text-gray-900">{product.brand ?? '—'}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-24 shrink-0 font-medium text-gray-500">Category</dt>
            <dd>
              <Link to={`/?category=${product.category}`} className="text-blue-600 hover:underline">
                {formatCategoryName(product.category)}
              </Link>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
