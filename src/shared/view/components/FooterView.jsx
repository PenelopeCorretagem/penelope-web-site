import { MenuView } from './MenuView'
import { useFooterViewModel } from '@shared/hooks/components/useFooterViewModel'

/**
 * FooterView - Componente de footer principal
 * Renderiza menu do footer e informações de copyright
 * Integra com FooterViewModel para gerenciar estado
 * @param {boolean} isAuthenticated - Estado de autenticação do usuário
 * @param {number} logoSize - Tamanho do logo
 * @param {string} logoColorScheme - Esquema de cores do logo
 * @param {string} className - Classes CSS adicionais
 */

export function FooterView({
  isAuthenticated = false,
  logoSize = 40,
  logoColorScheme = 'pink',
  className = ''
}) {
  const {
    copyrightInfo,
    logoConfig,
    footerContainerClasses,
    copyrightClasses
  } = useFooterViewModel(isAuthenticated, logoSize, logoColorScheme)

  const containerClasses = [
    footerContainerClasses,
    className
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <footer className={containerClasses}>
      <MenuView
        isAuthenticated={isAuthenticated}
        variant='footer'
        logoSize={logoConfig.size}
        logoColorScheme={logoConfig.colorScheme}
      />
      <div className={copyrightClasses}>
        {copyrightInfo.text}
      </div>
    </footer>
  )
}
