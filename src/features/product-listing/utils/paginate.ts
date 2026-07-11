/** Entry in the pagination control: a page number or an ellipsis gap. */
export type PageItem = number | 'start-ellipsis' | 'end-ellipsis'

export function paginate<T>(items: readonly T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize
  return items.slice(start, start + pageSize)
}

export function getTotalPages(totalItems: number, pageSize: number): number {
  return Math.max(1, Math.ceil(totalItems / pageSize))
}

function range(from: number, to: number): number[] {
  return Array.from({ length: to - from + 1 }, (_, index) => from + index)
}

/**
 * Windowed page numbers for the pagination control: first and last page are
 * always visible, with current ±1 in between and ellipses over the gaps.
 * e.g. (9, 17) → [1, …, 8, 9, 10, …, 17]
 */
export function getPageItems(currentPage: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) return range(1, totalPages)

  const windowStart = Math.max(2, currentPage - 1)
  const windowEnd = Math.min(totalPages - 1, currentPage + 1)

  const items: PageItem[] = [1]
  if (windowStart > 2) items.push('start-ellipsis')
  items.push(...range(windowStart, windowEnd))
  if (windowEnd < totalPages - 1) items.push('end-ellipsis')
  items.push(totalPages)
  return items
}
