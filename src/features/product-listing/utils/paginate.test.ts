import { describe, expect, it } from 'vitest'
import { getPageItems, getTotalPages, paginate } from './paginate'

describe('paginate', () => {
  const items = Array.from({ length: 30 }, (_, index) => index + 1)

  it('returns the requested page slice', () => {
    expect(paginate(items, 1, 12)).toEqual(items.slice(0, 12))
    expect(paginate(items, 2, 12)).toEqual(items.slice(12, 24))
  })

  it('returns a short final page', () => {
    expect(paginate(items, 3, 12)).toEqual([25, 26, 27, 28, 29, 30])
  })

  it('returns empty for pages past the end', () => {
    expect(paginate(items, 4, 12)).toEqual([])
  })
})

describe('getTotalPages', () => {
  it('rounds up to whole pages', () => {
    expect(getTotalPages(194, 12)).toBe(17)
    expect(getTotalPages(24, 12)).toBe(2)
  })

  it('never returns less than one page', () => {
    expect(getTotalPages(0, 12)).toBe(1)
  })
})

describe('getPageItems', () => {
  it('lists every page when total fits without ellipses', () => {
    expect(getPageItems(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it('collapses the tail when current is near the start', () => {
    expect(getPageItems(1, 17)).toEqual([1, 2, 'end-ellipsis', 17])
  })

  it('collapses both sides when current is in the middle', () => {
    expect(getPageItems(9, 17)).toEqual([1, 'start-ellipsis', 8, 9, 10, 'end-ellipsis', 17])
  })

  it('collapses the head when current is near the end', () => {
    expect(getPageItems(17, 17)).toEqual([1, 'start-ellipsis', 16, 17])
  })

  it('keeps neighbours visible without unnecessary ellipses', () => {
    expect(getPageItems(3, 17)).toEqual([1, 2, 3, 4, 'end-ellipsis', 17])
  })
})
