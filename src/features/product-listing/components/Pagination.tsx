import { memo } from 'react'
import { getPageItems } from '../utils/paginate'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const PAGE_BUTTON_CLASSES =
  'h-8 min-w-8 rounded-full px-2 py-1.5 text-xs font-bold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amazon-orange focus-visible:ring-offset-2 active:scale-90 cursor-pointer select-none'
const EDGE_BUTTON_CLASSES =
  'inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-heading font-black text-gray-700 shadow-2xs hover:bg-gray-50 active:scale-95 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amazon-orange focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:active:scale-100 cursor-pointer select-none'

export const Pagination = memo(function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <nav aria-label="Pagination" className="mt-12 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        className={EDGE_BUTTON_CLASSES}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={3}
          stroke="currentColor"
          className="h-3 w-3"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
        Previous
      </button>

      <div className="flex items-center gap-1.5">
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
                  ? 'bg-amazon-dark text-white ring-1 ring-amazon-dark shadow-xs'
                  : 'text-gray-600 hover:bg-gray-200/80'
              }`}
            >
              {item}
            </button>
          ) : (
            <span key={item} aria-hidden="true" className="px-1 text-xs font-bold text-gray-400">
              …
            </span>
          ),
        )}
      </div>

      <button
        type="button"
        className={EDGE_BUTTON_CLASSES}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={3}
          stroke="currentColor"
          className="h-3 w-3"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </nav>
  )
})
