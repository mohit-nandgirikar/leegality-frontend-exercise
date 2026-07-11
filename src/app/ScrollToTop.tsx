import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

/**
 * Scrolls to top on forward (PUSH) navigations only — e.g. listing → detail.
 * Back/forward (POP) is left to the browser's own scroll restoration, which
 * works here because the listing re-renders instantly from cache.
 */
export function ScrollToTop() {
  const { pathname } = useLocation()
  const navigationType = useNavigationType()

  useEffect(() => {
    if (navigationType === 'PUSH') window.scrollTo(0, 0)
  }, [pathname, navigationType])

  return null
}
