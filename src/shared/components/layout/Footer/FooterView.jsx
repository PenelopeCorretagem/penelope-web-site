import { NavMenuView } from '@shared/components/layout/NavMenu/NavMenuView'
import {
  getFooterThemeClasses,
  getFooterCopyrightThemeClasses,
} from '@shared/styles/theme'

/**
 * FooterView - Rodapé principal da aplicação
 */
export function FooterView({
  isAuthenticated = false,
  className = '',
}) {
  const currentYear = new Date().getFullYear()
  const containerClasses = `${getFooterThemeClasses(className)} ${className}`.trim()
  const copyrightClasses = getFooterCopyrightThemeClasses()

  return (
    <footer className={containerClasses}>
      <NavMenuView
        isAuthenticated={isAuthenticated}
        variant="footer"
        logoSize={'40'}
        logoColorScheme={'pink'}
      />
      <div className={copyrightClasses}>
        © {currentYear} Penélope - Consultora de Imóveis | Todos os direitos reservados.
      </div>
    </footer>
  )
}
