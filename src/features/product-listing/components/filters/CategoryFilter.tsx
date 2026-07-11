import { memo } from 'react'
import { Skeleton } from '@/components/ui/Skeleton'
import type { Category } from '@/types/product'

interface CategoryFilterProps {
  categories: readonly Category[] | null
  isLoading: boolean
  selected: string | null
  onChange: (slug: string | null) => void
}

const OPTION_CLASSES =
  'flex cursor-pointer items-center gap-2 rounded px-1 py-0.5 text-sm text-gray-700 hover:text-gray-900'

export const CategoryFilter = memo(function CategoryFilter({
  categories,
  isLoading,
  selected,
  onChange,
}: CategoryFilterProps) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-gray-900">Category</legend>
      {isLoading ? (
        <div className="mt-2 space-y-2">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-4 w-3/4" />
          ))}
        </div>
      ) : (
        <div className="mt-2 max-h-72 space-y-1 overflow-y-auto pr-1">
          <label className={OPTION_CLASSES}>
            <input
              type="radio"
              name="category"
              checked={selected === null}
              onChange={() => onChange(null)}
              className="accent-blue-600"
            />
            All categories
          </label>
          {(categories ?? []).map((category) => (
            <label key={category.slug} className={OPTION_CLASSES}>
              <input
                type="radio"
                name="category"
                checked={selected === category.slug}
                onChange={() => onChange(category.slug)}
                className="accent-blue-600"
              />
              {category.name}
            </label>
          ))}
        </div>
      )}
    </fieldset>
  )
})
