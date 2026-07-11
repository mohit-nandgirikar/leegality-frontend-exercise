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
    <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">Filters</h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="text-sm text-blue-600 hover:underline focus-visible:ring-2 focus-visible:ring-blue-500"
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

      <PriceRangeFilter
        minPrice={filters.minPrice}
        maxPrice={filters.maxPrice}
        onChange={onPriceRangeChange}
      />

      <BrandFilter
        brands={brands}
        isLoading={isBrandsLoading}
        selected={filters.brands}
        onToggle={onBrandToggle}
      />
    </div>
  )
})
