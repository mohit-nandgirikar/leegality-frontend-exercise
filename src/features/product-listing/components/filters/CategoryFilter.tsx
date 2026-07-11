import { memo } from 'react'
import { Skeleton } from '@/components/ui/Skeleton'
import { CustomRadio } from '@/components/ui/CustomRadio'
import type { Category } from '@/types/product'

interface CategoryFilterProps {
  categories: readonly Category[] | null
  isLoading: boolean
  selected: string | null
  onChange: (slug: string | null) => void
}

export const CategoryFilter = memo(function CategoryFilter({
  categories,
  isLoading,
  selected,
  onChange,
}: CategoryFilterProps) {
  return (
    <fieldset className="border-none p-0 m-0">
      <legend className="font-heading text-sm font-bold text-gray-900 mb-2.5">Category</legend>
      {isLoading ? (
        <div className="space-y-2.5">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-6 w-11/12 animate-shimmer" />
          ))}
        </div>
      ) : (
        <div className="custom-scrollbar max-h-64 space-y-0.5 overflow-y-auto pr-1">
          <CustomRadio
            name="category"
            checked={selected === null}
            onChange={() => onChange(null)}
            label="All categories"
          />
          {(categories ?? []).map((category) => (
            <CustomRadio
              key={category.slug}
              name="category"
              checked={selected === category.slug}
              onChange={() => onChange(category.slug)}
              label={category.name}
            />
          ))}
        </div>
      )}
    </fieldset>
  )
})
