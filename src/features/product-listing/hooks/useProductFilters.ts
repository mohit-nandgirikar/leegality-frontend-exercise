import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { ProductFilters } from '@/types/product'

const PARAM = {
  category: 'category',
  brands: 'brands',
  minPrice: 'minPrice',
  maxPrice: 'maxPrice',
  page: 'page',
} as const

function parsePrice(raw: string | null): number | null {
  if (raw === null || raw.trim() === '') return null
  const value = Number(raw)
  return Number.isFinite(value) && value >= 0 ? value : null
}

function parsePage(raw: string | null): number {
  const value = Number(raw)
  return Number.isInteger(value) && value > 0 ? value : 1
}

/** Pure URL → state parsing, exported for unit tests. */
export function parseFiltersFromParams(params: URLSearchParams): ProductFilters {
  return {
    category: params.get(PARAM.category),
    brands: params.get(PARAM.brands)?.split(',').filter(Boolean) ?? [],
    minPrice: parsePrice(params.get(PARAM.minPrice)),
    maxPrice: parsePrice(params.get(PARAM.maxPrice)),
  }
}

export interface UseProductFiltersResult {
  filters: ProductFilters
  /** Raw 1-based page from the URL; the page clamps it against total pages. */
  page: number
  hasActiveFilters: boolean
  setCategory: (slug: string | null) => void
  toggleBrand: (brand: string) => void
  setPriceRange: (min: number | null, max: number | null) => void
  setPage: (page: number) => void
  clearFilters: () => void
}

/**
 * Filter state lives entirely in URL search params — the single source of
 * truth. This makes filtered views shareable and refresh-safe, and preserves
 * filters across back-navigation via browser history. Every filter write
 * drops the page param, which is the "pagination resets on filter change"
 * requirement enforced in one place.
 */
export function useProductFilters(): UseProductFiltersResult {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = useMemo(() => parseFiltersFromParams(searchParams), [searchParams])
  const page = parsePage(searchParams.get(PARAM.page))

  const updateFilters = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      setSearchParams((previous) => {
        const next = new URLSearchParams(previous)
        mutate(next)
        next.delete(PARAM.page)
        return next
      })
    },
    [setSearchParams],
  )

  const setCategory = useCallback(
    (slug: string | null) => {
      updateFilters((params) => {
        if (slug === null) params.delete(PARAM.category)
        else params.set(PARAM.category, slug)
        // Brands are facets of the category's dataset; selections from the
        // previous category would silently match nothing in the new one.
        params.delete(PARAM.brands)
      })
    },
    [updateFilters],
  )

  const toggleBrand = useCallback(
    (brand: string) => {
      updateFilters((params) => {
        const current = params.get(PARAM.brands)?.split(',').filter(Boolean) ?? []
        const next = current.includes(brand)
          ? current.filter((item) => item !== brand)
          : [...current, brand]
        if (next.length === 0) params.delete(PARAM.brands)
        else params.set(PARAM.brands, next.join(','))
      })
    },
    [updateFilters],
  )

  const setPriceRange = useCallback(
    (min: number | null, max: number | null) => {
      updateFilters((params) => {
        if (min === null) params.delete(PARAM.minPrice)
        else params.set(PARAM.minPrice, String(min))
        if (max === null) params.delete(PARAM.maxPrice)
        else params.set(PARAM.maxPrice, String(max))
      })
    },
    [updateFilters],
  )

  const setPage = useCallback(
    (page: number) => {
      setSearchParams((previous) => {
        const next = new URLSearchParams(previous)
        if (page <= 1) next.delete(PARAM.page)
        else next.set(PARAM.page, String(page))
        return next
      })
      window.scrollTo({ top: 0 })
    },
    [setSearchParams],
  )

  const clearFilters = useCallback(() => {
    setSearchParams(new URLSearchParams())
  }, [setSearchParams])

  const hasActiveFilters =
    filters.category !== null ||
    filters.brands.length > 0 ||
    filters.minPrice !== null ||
    filters.maxPrice !== null

  return {
    filters,
    page,
    hasActiveFilters,
    setCategory,
    toggleBrand,
    setPriceRange,
    setPage,
    clearFilters,
  }
}
