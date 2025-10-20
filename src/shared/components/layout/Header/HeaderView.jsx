import { LogoView } from '@shared/components/ui/Logo/LogoView'
import { NavMenuView } from '@shared/components/layout/NavMenu/NavMenuView'
import { useHeaderFactory } from '@shared/components/layout/Header/useHeaderViewModel'
import { getHeaderContentThemeClasses } from '@shared/styles/theme'

export function HeaderView({
  // Props semânticas em vez de lógica interna
  isAuthenticated = false,
  logoSize = 40,
  logoColorScheme = 'pink',
  sticky = true,
  showShadow = true,
}) {
  // Usa o hook factory com props semânticas
  const {
    logoSize: viewLogoSize,
    logoColorScheme: viewLogoColorScheme,
    isAuthenticated: viewIsAuthenticated,
    hasErrors,
    errorMessages,
    isValid,
    headerClasses,
    logoSizeClasses,
  } = useHeaderFactory({
    logoSize,
    logoColorScheme,
    isAuthenticated,
    sticky,
    showShadow,
  })

  const contentClasses = getHeaderContentThemeClasses({})

  if (!isValid) {
    // Estado inválido detectado - componente ainda renderiza com fallbacks
  }

  return (
    <header
      className={headerClasses}
      role="banner"
      aria-label="Cabeçalho principal"
      aria-invalid={hasErrors}
      title={hasErrors ? errorMessages : undefined}
    >
      <div className={contentClasses}>
        <LogoView
          size={viewLogoSize}
          colorScheme={viewLogoColorScheme}
          className={logoSizeClasses}
        />
        <NavMenuView isAuthenticated={viewIsAuthenticated} />
      </div>
    </header>
  )
}
