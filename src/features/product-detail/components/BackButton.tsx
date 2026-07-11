import { Link, useLocation, useNavigate } from 'react-router-dom'

const LINK_CLASSES =
  'inline-flex items-center gap-1.5 text-xs font-heading font-black text-gray-700 hover:text-amazon-orange hover:border-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amazon-orange focus-visible:ring-offset-2 rounded-full px-4 py-2 border border-gray-300 bg-white shadow-2xs active:scale-95 transition-all duration-150 cursor-pointer select-none'

/**
 * Returns to the listing. When the user arrived from within the app,
 * history.back() restores the exact filtered + paginated listing URL — the
 * "filters remain applied when navigating back" requirement. On a direct deep
 * load there is no in-app history (React Router marks the initial entry with
 * location.key === 'default'), so it falls back to a plain link home.
 */
export function BackButton() {
  const navigate = useNavigate()
  const location = useLocation()
  const hasInAppHistory = location.key !== 'default'

  const content = (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={3}
        stroke="currentColor"
        className="h-3.5 w-3.5"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
      </svg>
      Back to products
    </>
  )

  if (hasInAppHistory) {
    return (
      <button type="button" onClick={() => navigate(-1)} className={LINK_CLASSES}>
        {content}
      </button>
    )
  }

  return (
    <Link to="/" className={LINK_CLASSES}>
      {content}
    </Link>
  )
}
