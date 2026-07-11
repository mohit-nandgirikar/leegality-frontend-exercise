import { memo, useMemo } from 'react'
import { Skeleton } from '@/components/ui/Skeleton'

interface BrandFilterProps {
  /** Facet list derived from the current category's dataset. */
  brands: readonly string[]
  isLoading: boolean
  selected: readonly string[]
  onToggle: (brand: string) => void
}

export const BrandFilter = memo(function BrandFilter({
  brands,
  isLoading,
  selected,
  onToggle,
}: BrandFilterProps) {
  // Include selected brands missing from the facet (e.g. hand-edited URL) so
  // an active selection can always be seen and unchecked.
  const displayBrands = useMemo(() => {
    const all = new Set([...brands, ...selected])
    return [...all].sort((a, b) => a.localeCompare(b))
  }, [brands, selected])

  return (
    <fieldset>
      <legend className="text-sm font-semibold text-gray-900">Brand</legend>
      {isLoading ? (
        <div className="mt-2 space-y-2">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-4 w-2/3" />
          ))}
        </div>
      ) : displayBrands.length === 0 ? (
        <p className="mt-2 text-sm text-gray-400">No brands in this category</p>
      ) : (
        <div className="mt-2 max-h-72 space-y-1 overflow-y-auto pr-1">
          {displayBrands.map((brand) => (
            <label
              key={brand}
              className="flex cursor-pointer items-center gap-2 rounded px-1 py-0.5 text-sm text-gray-700 hover:text-gray-900"
            >
              <input
                type="checkbox"
                checked={selected.includes(brand)}
                onChange={() => onToggle(brand)}
                className="accent-blue-600"
              />
              {brand}
            </label>
          ))}
        </div>
      )}
    </fieldset>
  )
})
