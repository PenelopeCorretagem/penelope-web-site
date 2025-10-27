// HeaderView.js
import { NavMenuView } from '@shared/components/layout/NavMenu/NavMenuView'
import { getHeaderThemeClasses } from '@shared/styles/theme'

export function HeaderView({
  isAuthenticated = false,
  sticky = true,
  showShadow = true,
}) {
  const headerClasses = getHeaderThemeClasses({ sticky, showShadow })

  return (
    <header className={headerClasses} role="banner">
      <NavMenuView isAuthenticated={isAuthenticated} />
    </header>
  )
}
