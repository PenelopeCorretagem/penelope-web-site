import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * ScrollToTop component forces the browser to scroll to the top of the page
 * BEFORE the new component renders whenever the route changes.
 *
 * This ensures that when navigating between pages, the previous page's scroll
 * position is reset to 0, and the new page always starts from the top.
 *
 * @component
 * @example
 * // Place inside RouterView component
 * <main>
 *   <ScrollToTop />
 *   <Routes>...</Routes>
 * </main>
 */
export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // Reseta posição instantaneamente ANTES de renderizar o novo componente
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
