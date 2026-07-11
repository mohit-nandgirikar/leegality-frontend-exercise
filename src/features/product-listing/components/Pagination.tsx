import { memo } from 'react'
import { getPageItems } from '../utils/paginate'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const PAGE_BUTTON_CLASSES =
  'min-w-9 rounded-md px-2 py-1.5 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-blue-500'
const EDGE_BUTTON_CLASSES =
  'rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent'

export const Pagination = memo(function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <nav aria-label="Pagination" className="mt-8 flex flex-wrap items-center justify-center gap-1">
      <button
        type="button"
        className={EDGE_BUTTON_CLASSES}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ‹ Previous
      </button>

      {getPageItems(currentPage, totalPages).map((item) =>
        typeof item === 'number' ? (
          <button
            key={item}
            type="button"
            aria-current={item === currentPage ? 'page' : undefined}
            aria-label={`Page ${item}`}
            onClick={() => onPageChange(item)}
            className={`${PAGE_BUTTON_CLASSES} ${
              item === currentPage
                ? 'bg-blue-600 font-medium text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {item}
          </button>
        ) : (
          <span key={item} aria-hidden="true" className="px-1 text-gray-400">
            …
          </span>
        ),
      )}

      <button
        type="button"
        className={EDGE_BUTTON_CLASSES}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next ›
      </button>
    </nav>
  )
})
