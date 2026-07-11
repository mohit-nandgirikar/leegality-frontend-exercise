import { memo, useMemo } from 'react'
import { Skeleton } from '@/components/ui/Skeleton'
import { CustomCheckbox } from '@/components/ui/CustomCheckbox'

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
    <fieldset className="border-none p-0 m-0">
      <legend className="font-heading text-sm font-bold text-gray-900 mb-2.5">Brand</legend>
      {isLoading ? (
        <div className="space-y-2.5">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-6 w-5/6 animate-shimmer" />
          ))}
        </div>
      ) : displayBrands.length === 0 ? (
        <p className="text-xs text-gray-400 italic mt-1">No brands in this category</p>
      ) : (
        <div className="custom-scrollbar max-h-64 space-y-0.5 overflow-y-auto pr-1">
          {displayBrands.map((brand) => (
            <CustomCheckbox
              key={brand}
              checked={selected.includes(brand)}
              onChange={() => onToggle(brand)}
              label={brand}
            />
          ))}
        </div>
      )}
    </fieldset>
  )
})
