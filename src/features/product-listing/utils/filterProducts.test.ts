import { describe, expect, it } from 'vitest'
import type { ProductFilters, ProductSummary } from '@/types/product'
import { extractBrands, filterProducts } from './filterProducts'

function makeProduct(overrides: Partial<ProductSummary>): ProductSummary {
  return {
    id: 1,
    title: 'Product',
    category: 'smartphones',
    price: 100,
    rating: 4,
    thumbnail: 'thumb.jpg',
    ...overrides,
  }
}

function makeFilters(overrides: Partial<ProductFilters>): ProductFilters {
  return { category: null, brands: [], minPrice: null, maxPrice: null, ...overrides }
}

const iphone = makeProduct({ id: 1, brand: 'Apple', price: 900 })
const galaxy = makeProduct({ id: 2, brand: 'Samsung', price: 700 })
const generic = makeProduct({ id: 3, brand: undefined, price: 50 })
const products = [iphone, galaxy, generic]

describe('filterProducts', () => {
  it('passes everything through with no active filters', () => {
    expect(filterProducts(products, makeFilters({}))).toEqual(products)
  })

  it('applies minPrice inclusively', () => {
    expect(filterProducts(products, makeFilters({ minPrice: 700 }))).toEqual([iphone, galaxy])
  })

  it('applies maxPrice inclusively', () => {
    expect(filterProducts(products, makeFilters({ maxPrice: 700 }))).toEqual([galaxy, generic])
  })

  it('matches any of the selected brands', () => {
    expect(filterProducts(products, makeFilters({ brands: ['Apple', 'Samsung'] }))).toEqual([
      iphone,
      galaxy,
    ])
  })

  it('excludes products without a brand when brands are selected', () => {
    expect(filterProducts(products, makeFilters({ brands: ['Apple'] }))).toEqual([iphone])
  })

  it('combines price and brand filters', () => {
    const filters = makeFilters({ brands: ['Apple', 'Samsung'], maxPrice: 800 })
    expect(filterProducts(products, filters)).toEqual([galaxy])
  })

  it('returns empty when the range excludes everything', () => {
    expect(filterProducts(products, makeFilters({ minPrice: 5000 }))).toEqual([])
  })
})

describe('extractBrands', () => {
  it('returns unique brands sorted alphabetically, skipping brandless products', () => {
    const dataset = [
      makeProduct({ id: 1, brand: 'Samsung' }),
      makeProduct({ id: 2, brand: 'Apple' }),
      makeProduct({ id: 3, brand: 'Samsung' }),
      makeProduct({ id: 4, brand: undefined }),
    ]
    expect(extractBrands(dataset)).toEqual(['Apple', 'Samsung'])
  })

  it('returns empty for an empty dataset', () => {
    expect(extractBrands([])).toEqual([])
  })
})
