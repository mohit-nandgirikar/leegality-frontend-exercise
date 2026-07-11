import { describe, expect, it } from 'vitest'
import { parseFiltersFromParams } from './useProductFilters'

describe('parseFiltersFromParams', () => {
  it('parses a fully populated query string', () => {
    const params = new URLSearchParams(
      'category=smartphones&brands=Apple,Samsung&minPrice=100&maxPrice=900',
    )
    expect(parseFiltersFromParams(params)).toEqual({
      category: 'smartphones',
      brands: ['Apple', 'Samsung'],
      minPrice: 100,
      maxPrice: 900,
    })
  })

  it('defaults everything when params are absent', () => {
    expect(parseFiltersFromParams(new URLSearchParams())).toEqual({
      category: null,
      brands: [],
      minPrice: null,
      maxPrice: null,
    })
  })

  it('drops empty brand segments', () => {
    const params = new URLSearchParams('brands=,Apple,,')
    expect(parseFiltersFromParams(params).brands).toEqual(['Apple'])
  })

  it('rejects non-numeric and negative prices', () => {
    const params = new URLSearchParams('minPrice=abc&maxPrice=-5')
    const filters = parseFiltersFromParams(params)
    expect(filters.minPrice).toBeNull()
    expect(filters.maxPrice).toBeNull()
  })

  it('accepts decimal prices', () => {
    const params = new URLSearchParams('minPrice=9.99')
    expect(parseFiltersFromParams(params).minPrice).toBe(9.99)
  })
})
