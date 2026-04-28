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

      <AlertView
        isVisible={expired}
        type="info"
        hasCloseButton={false}
        message="Sua sessão expirou. Você será redirecionado para a tela de login em instantes."
        onClose={() => {}}
      />
    </header>
  )
}
