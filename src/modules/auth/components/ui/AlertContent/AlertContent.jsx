import { TextView } from '@shared/components/ui/Text/TextView'
import { getAuthLinkContainerThemeClasses, getAuthLinkButtonThemeClasses } from '@shared/styles/theme'

function renderActionButton(actionConfig, { onForgotPassword, onLogin, onClose }) {
  if (!actionConfig) return null

  const action = actionConfig.action || actionConfig.type
  const label = actionConfig.text || actionConfig.label

  const handleClick = (event) => {
    event.preventDefault()

    if (action === 'forgotPassword') {
      onForgotPassword()
      return
    }

    if (action === 'login') {
      onLogin()
      return
    }

    onClose()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={getAuthLinkButtonThemeClasses()}
    >
      {label}
    </button>
  )
}

export function AlertContent({ alertConfig, onForgotPassword, onLogin, onClose }) {
  if (!alertConfig) return null

  if (alertConfig.showForgotPassword) {
    return (
      <TextView className={getAuthLinkContainerThemeClasses()}>
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault()
            onForgotPassword()
          }}
          className={getAuthLinkButtonThemeClasses()}
        >
          Recuperar senha
        </button>
      </TextView>
    )
  }

  if (alertConfig.primaryButton || alertConfig.secondaryButton) {
    return (
      <div className={getAuthLinkContainerThemeClasses()}>
        {alertConfig.secondaryButton && (
          <TextView as="span" className="flex flex-col items-center gap-2 text-center">
            {renderActionButton(alertConfig.secondaryButton, { onForgotPassword, onLogin, onClose })}
          </TextView>
        )}

        {alertConfig.primaryButton && (
          <TextView as="span" className="flex flex-col items-center gap-2 text-center">
            {renderActionButton(alertConfig.primaryButton, { onForgotPassword, onLogin, onClose })}
          </TextView>
        )}
      </div>
    )
  }

  if (alertConfig.showLoginLink) {
    return (
      <TextView className={getAuthLinkContainerThemeClasses()}>
        Por favor, clique para acessar sua conta.
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault()
            onLogin()
          }}
          className={getAuthLinkButtonThemeClasses()}
        >
          Fazer Login
        </button>
      </TextView>
    )
  }

  return null
}
