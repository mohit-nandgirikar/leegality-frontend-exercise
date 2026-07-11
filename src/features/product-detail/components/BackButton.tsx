import { Link, useLocation, useNavigate } from 'react-router-dom'

const LINK_CLASSES =
  'inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline focus-visible:ring-2 focus-visible:ring-blue-500'

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

  if (hasInAppHistory) {
    return (
      <button type="button" onClick={() => navigate(-1)} className={LINK_CLASSES}>
        ← Back to products
      </button>
    )
  }

  return (
    <Link to="/" className={LINK_CLASSES}>
      ← Back to products
    </Link>
  )
}
