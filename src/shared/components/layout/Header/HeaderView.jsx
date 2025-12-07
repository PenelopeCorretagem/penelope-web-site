// HeaderView.js
import { NavMenuView } from '@shared/components/layout/NavMenu/NavMenuView'

export function HeaderView({
  isAuthenticated = false,
  sticky = true,
  showShadow = true,
  sidebarVisible = false,
}) {
  const headerClasses = [
    'w-full',
    'h-24',
    'bg-default-light',
    'transition-all duration-300',
    'px-header-x md:px-header-x-md',
    'flex items-center justify-center',
    sticky && 'sticky top-0 z-50',
    showShadow && 'shadow-lg',
  ].filter(Boolean).join(' ')

  return (
    <header className={headerClasses} role="banner">
      <NavMenuView isAuthenticated={isAuthenticated} hideLogo={sidebarVisible} />
    </header>
  )
}
