import { TextView } from '@shared/components/ui/Text/TextView'
import { getAuthLinkContainerThemeClasses, getAuthLinkButtonThemeClasses } from '@shared/styles/theme'

export function AlertContent({ alertConfig, onForgotPassword, onLogin }) {
  if (!alertConfig) return null

  if (alertConfig.showForgotPassword) {
    return (
      <TextView className={getAuthLinkContainerThemeClasses()}>
        <button onClick={onForgotPassword} className={getAuthLinkButtonThemeClasses()}>
          Recuperar senha
        </button>
      </TextView>
    )
  }

  if (alertConfig.showLoginLink) {
    return (
      <TextView className={getAuthLinkContainerThemeClasses()}>
        Por favor, clique para acessar sua conta.
        <button onClick={onLogin} className={getAuthLinkButtonThemeClasses()}>
          Fazer Login
        </button>
      </TextView>
    )
  }

  return null
}
