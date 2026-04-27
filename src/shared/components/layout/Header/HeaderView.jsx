// HeaderView.js
import { NavMenuView } from '@shared/components/layout/NavMenu/NavMenuView'
import { AlertView } from '@shared/components/feedback/Alert/AlertView'
import { useAuthSession } from '@shared/hooks/useAuthSession'

export function HeaderView({
  isAuthenticated = false,
  isAdmin = false,
  sticky = true,
  showShadow = true,
  sidebarVisible = false,
}) {
  const { remainingFormatted, expired } = useAuthSession()
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
      <NavMenuView isAuthenticated={isAuthenticated} isAdmin={isAdmin} hideLogo={sidebarVisible} />

      {/* Timer de sessão no canto superior direito */}
      {isAuthenticated && remainingFormatted && (
        <div className="hidden rounded-sm bg-default-dark-light px-3 py-1 text-button font-medium text-default-light shadow-sm text-center items-center justify-center w-fit md:flex md:text-button-md">
          Sessão: {remainingFormatted}
        </div>
      )}

      <AlertView
        isVisible={expired}
        type="info"
        message="Sua sessão expirou. Você será redirecionado para a tela de login em instantes."
        onClose={() => {}}
      />
    </header>
  )
}
