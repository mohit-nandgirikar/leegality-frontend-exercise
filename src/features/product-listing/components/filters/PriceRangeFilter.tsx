import { memo, useEffect, useState } from 'react'
import { PRICE_DEBOUNCE_MS } from '@/constants'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'

interface PriceRangeFilterProps {
  minPrice: number | null
  maxPrice: number | null
  /** Called once with both bounds after typing settles; must be referentially stable. */
  onChange: (min: number | null, max: number | null) => void
}

function parsePrice(raw: string): number | null {
  if (raw.trim() === '') return null
  const value = Number(raw)
  return Number.isFinite(value) && value >= 0 ? value : null
}



/**
 * Raw input state stays local so typing is instant; the URL is only updated
 * after the debounce settles. Commits fire when the debounced values match the
 * live inputs ("settled") and differ from the props — so an external reset
 * (e.g. Clear filters) can never be overwritten by a stale pending debounce.
 */
export const PriceRangeFilter = memo(function PriceRangeFilter({
  minPrice,
  maxPrice,
  onChange,
}: PriceRangeFilterProps) {
  const [minInput, setMinInput] = useState(minPrice === null ? '' : String(minPrice))
  const [maxInput, setMaxInput] = useState(maxPrice === null ? '' : String(maxPrice))
  const debouncedMin = useDebouncedValue(minInput, PRICE_DEBOUNCE_MS)
  const debouncedMax = useDebouncedValue(maxInput, PRICE_DEBOUNCE_MS)

  // Render-time reset: when the props change to something the inputs don't
  // represent (external clear/deep link), sync the inputs. Our own commits
  // round-trip with matching values, so typing is never clobbered.
  const [prevRange, setPrevRange] = useState({ minPrice, maxPrice })
  if (prevRange.minPrice !== minPrice || prevRange.maxPrice !== maxPrice) {
    setPrevRange({ minPrice, maxPrice })
    if (parsePrice(minInput) !== minPrice) setMinInput(minPrice === null ? '' : String(minPrice))
    if (parsePrice(maxInput) !== maxPrice) setMaxInput(maxPrice === null ? '' : String(maxPrice))
  }

  useEffect(() => {
    const settled = debouncedMin === minInput && debouncedMax === maxInput
    if (!settled) return
    const min = parsePrice(debouncedMin)
    const max = parsePrice(debouncedMax)
    if (min === minPrice && max === maxPrice) return
    onChange(min, max)
  }, [debouncedMin, debouncedMax, minInput, maxInput, minPrice, maxPrice, onChange])

  return (
    <fieldset className="border-none p-0 m-0">
      <legend className="font-heading text-sm font-bold text-gray-900 mb-2.5">Price</legend>
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <label htmlFor="price-min" className="sr-only">
            Minimum price
          </label>
          <div className="relative rounded-md shadow-2xs">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-xs font-semibold text-gray-400">
              $
            </span>
            <input
              id="price-min"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              placeholder="Min"
              value={minInput}
              onChange={(event) => setMinInput(event.target.value)}
              className="w-full rounded-md border border-gray-300 pl-6 pr-2.5 py-1.5 text-xs text-gray-900 placeholder-gray-400 bg-white focus:border-amazon-orange focus:outline-none focus:ring-1 focus:ring-amazon-orange transition-all duration-200"
            />
          </div>
        </div>
        <span aria-hidden="true" className="text-gray-400 font-medium">
          –
        </span>
        <div className="flex-1">
          <label htmlFor="price-max" className="sr-only">
            Maximum price
          </label>
          <div className="relative rounded-md shadow-2xs">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-xs font-semibold text-gray-400">
              $
            </span>
            <input
              id="price-max"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              placeholder="Max"
              value={maxInput}
              onChange={(event) => setMaxInput(event.target.value)}
              className="w-full rounded-md border border-gray-300 pl-6 pr-2.5 py-1.5 text-xs text-gray-900 placeholder-gray-400 bg-white focus:border-amazon-orange focus:outline-none focus:ring-1 focus:ring-amazon-orange transition-all duration-200"
            />
          </div>
        </div>
      </div>
    </fieldset>
  )
})
