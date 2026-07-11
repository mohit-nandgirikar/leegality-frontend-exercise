import { memo } from 'react'
import type { Category, ProductFilters } from '@/types/product'
import { BrandFilter } from './BrandFilter'
import { CategoryFilter } from './CategoryFilter'
import { PriceRangeFilter } from './PriceRangeFilter'

interface FilterSidebarProps {
  categories: readonly Category[] | null
  isCategoriesLoading: boolean
  brands: readonly string[]
  isBrandsLoading: boolean
  filters: ProductFilters
  hasActiveFilters: boolean
  onCategoryChange: (slug: string | null) => void
  onBrandToggle: (brand: string) => void
  onPriceRangeChange: (min: number | null, max: number | null) => void
  onClearFilters: () => void
}

export const FilterSidebar = memo(function FilterSidebar({
  categories,
  isCategoriesLoading,
  brands,
  isBrandsLoading,
  filters,
  hasActiveFilters,
  onCategoryChange,
  onBrandToggle,
  onPriceRangeChange,
  onClearFilters,
}: FilterSidebarProps) {
  return (
    <div className="space-y-6 rounded-xl border border-gray-200 bg-white p-5 shadow-2xs hover:shadow-xs transition-shadow duration-300">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h2 className="font-heading text-base font-black text-gray-900">Filters</h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="text-xs font-bold text-[#007185] hover:text-[#c45500] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amazon-orange rounded px-1 py-0.5 transition-colors duration-150 cursor-pointer"
          >
            Clear all
          </button>
        )}
      </div>

      <CategoryFilter
        categories={categories}
        isLoading={isCategoriesLoading}
        selected={filters.category}
        onChange={onCategoryChange}
      />

      <hr className="border-gray-100" />

      <PriceRangeFilter
        minPrice={filters.minPrice}
        maxPrice={filters.maxPrice}
        onChange={onPriceRangeChange}
      />

      <hr className="border-gray-100" />

      <BrandFilter
        brands={brands}
        isLoading={isBrandsLoading}
        selected={filters.brands}
        onToggle={onBrandToggle}
      />
    </div>
  )
})
