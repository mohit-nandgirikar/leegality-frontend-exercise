import { useState } from 'react'
import { Link } from 'react-router-dom'
import { RatingStars } from '@/components/ui/RatingStars'
import { Button } from '@/components/ui/Button'
import type { Product } from '@/types/product'
import { formatCategoryName, formatPrice } from '@/utils/format'
import { handleImageError } from '@/utils/image'

interface ProductInfoProps {
  product: Product
}

export function ProductInfo({ product }: ProductInfoProps) {
  const hasDiscount = product.discountPercentage > 0 && product.discountPercentage < 90
  const originalPrice = product.price / (1 - product.discountPercentage / 100)

  // Local state for active product image (image gallery switcher)
  const defaultImage = product.images?.[0] ?? product.thumbnail
  const [activeImage, setActiveImage] = useState(defaultImage)

  // Filter down to unique images to avoid duplicates in thumbnail list
  const uniqueImages = Array.from(new Set(product.images ?? [defaultImage])).slice(0, 5)

  // Stock status styling and urgency
  const isOutOfStock = product.stock <= 0
  const isLowStock = product.stock > 0 && product.stock <= 10

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Column 1: Image Gallery (5 cols on lg) */}
      <div className="lg:col-span-5 space-y-4">
        {/* Main Hero Image */}
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-gray-200 bg-white flex items-center justify-center p-8 shadow-2xs hover:shadow-xs transition-shadow duration-300">
          <img
            src={activeImage}
            alt={product.title}
            decoding="async"
            onError={handleImageError}
            className="h-full w-full object-contain mix-blend-multiply transition-all duration-350"
          />
          {hasDiscount && (
            <span className="absolute top-4 left-4 rounded-md bg-[#CC0C39] px-2.5 py-1 text-xs font-heading font-black text-white shadow-sm tracking-wide select-none">
              -{product.discountPercentage.toFixed(0)}% DEAL
            </span>
          )}
        </div>

        {/* Thumbnail Selector list */}
        {uniqueImages.length > 1 && (
          <div className="flex flex-wrap gap-2.5 justify-center">
            {uniqueImages.map((imgUrl, index) => {
              const isActive = activeImage === imgUrl
              return (
                <button
                  key={index}
                  type="button"
                  onMouseEnter={() => setActiveImage(imgUrl)}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`relative h-16 w-16 overflow-hidden rounded-lg border bg-white flex items-center justify-center p-2 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amazon-orange ${
                    isActive
                      ? 'border-amazon-orange ring-1 ring-amazon-orange shadow-xs'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`${product.title} view ${index + 1}`}
                    className="h-full w-full object-contain mix-blend-multiply"
                    onError={handleImageError}
                  />
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Column 2: Product Core Info (4 cols on lg) */}
      <div className="lg:col-span-4 space-y-5">
        <div>
          {product.brand && (
            <p className="text-xs font-heading font-extrabold tracking-widest text-amazon-orange uppercase leading-none mb-1.5">
              {product.brand}
            </p>
          )}
          <h1 className="font-heading text-2xl font-black text-gray-900 leading-tight">
            {product.title}
          </h1>
          <div className="mt-2.5 flex items-center gap-4">
            <RatingStars rating={product.rating} />
            <span className="h-4 w-px bg-gray-200" />
            <a href="#specs" className="text-xs font-bold text-[#007185] hover:text-[#c45500] hover:underline">
              Specifications
            </a>
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Price Box */}
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-gray-900 leading-none">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-sm font-bold text-gray-400 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
          {hasDiscount && (
            <p className="text-[12px] font-semibold text-green-700">
              You save: {(originalPrice - product.price).toFixed(2)} ({product.discountPercentage.toFixed(0)}%)
            </p>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-gray-400">
            Description
          </h3>
          <p className="text-sm leading-relaxed text-gray-600">{product.description}</p>
        </div>

        <hr className="border-gray-200" />

        {/* Specs Table */}
        <div id="specs" className="space-y-3">
          <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-gray-400">
            Product Specifications
          </h3>
          <dl className="grid grid-cols-1 gap-y-2 rounded-xl bg-gray-50 p-4 border border-gray-100 text-xs">
            <div className="flex border-b border-gray-200/50 pb-1.5">
              <dt className="w-24 shrink-0 font-bold text-gray-500">Brand</dt>
              <dd className="text-gray-900 font-semibold">{product.brand ?? '—'}</dd>
            </div>
            <div className="flex border-b border-gray-200/50 pb-1.5">
              <dt className="w-24 shrink-0 font-bold text-gray-500">Category</dt>
              <dd className="text-gray-900 font-semibold">
                <Link
                  to={`/?category=${product.category}`}
                  className="text-[#007185] hover:text-[#c45500] hover:underline"
                >
                  {formatCategoryName(product.category)}
                </Link>
              </dd>
            </div>
            <div className="flex pb-0.5">
              <dt className="w-24 shrink-0 font-bold text-gray-500">Stock Count</dt>
              <dd className="text-gray-900 font-semibold">{product.stock} items available</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Column 3: E-commerce Buy Box (3 cols on lg) */}
      <div className="lg:col-span-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs space-y-4">
        {/* Buy Box Price */}
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block mb-0.5">
            Total Price
          </span>
          <span className="text-2xl font-black text-gray-900 block leading-none">
            {formatPrice(product.price)}
          </span>
        </div>

        {/* Urgency Stock Status */}
        <div className="flex items-center gap-2 text-xs font-bold">
          {isOutOfStock ? (
            <>
              <span className="h-2 w-2 rounded-full bg-red-500" />
              <span className="text-red-600">Currently unavailable.</span>
            </>
          ) : isLowStock ? (
            <>
              <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
              <span className="text-red-700">Only {product.stock} left in stock - order soon.</span>
            </>
          ) : (
            <>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-emerald-700">In Stock</span>
            </>
          )}
        </div>

        {/* Mock Delivery options */}
        <div className="text-[11.5px] leading-relaxed text-gray-600 space-y-1.5 bg-gray-50/50 rounded-xl p-3 border border-gray-100">
          <p>
            FREE delivery <span className="font-bold text-gray-800">Tuesday, July 14</span> on orders over $35.
          </p>
          <p>
            Or fastest delivery <span className="font-bold text-gray-800">Tomorrow, July 12</span>. Order within <span className="font-semibold text-emerald-700">4 hrs 12 mins</span>.
          </p>
          <div className="flex items-center gap-1 text-[11px] text-[#007185] hover:underline cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-3.5 w-3.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
              />
            </svg>
            Deliver to India
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-2 pt-2">
          <Button
            variant="primary"
            disabled={isOutOfStock}
            onClick={() => alert('Mock Add to Cart Action')}
            className="w-full text-center py-3 text-xs"
          >
            Add to Cart
          </Button>
          <Button
            variant="secondary"
            disabled={isOutOfStock}
            onClick={() => alert('Mock Buy Now Action')}
            className="w-full text-center py-3 text-xs"
          >
            Buy Now
          </Button>
        </div>

        {/* Secure Transaction Mock */}
        <div className="flex items-center gap-2 justify-center text-[10.5px] text-gray-400 font-semibold select-none pt-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-3.5 w-3.5 text-gray-300"
          >
            <path
              fillRule="evenodd"
              d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1-0-7.5 3.75 3.75 0 0-0-3.75 3.75v3h7.5Z"
              clipRule="evenodd"
            />
          </svg>
          Secure transaction
        </div>
      </div>
    </div>
  )
}
