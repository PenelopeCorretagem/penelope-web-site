import { TextView } from '@shared/components/ui/Text/TextView'

// Classes Tailwind diretas
const AUTH_LINK_CONTAINER_CLASSES = 'text-default-dark-muted flex gap-1 items-center justify-center'
const AUTH_LINK_BUTTON_CLASSES = 'font-semibold text-distac-primary hover:underline bg-transparent border-none cursor-pointer p-0 min-h-0 h-auto inline-block'

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
      className={AUTH_LINK_BUTTON_CLASSES}
    >
      {label}
    </button>
  )
}

export function AlertContent({ alertConfig, onForgotPassword, onLogin, onClose }) {
  if (!alertConfig) return null

  if (alertConfig.showForgotPassword) {
    return (
      <TextView className={AUTH_LINK_CONTAINER_CLASSES}>
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault()
            onForgotPassword()
          }}
          className={AUTH_LINK_BUTTON_CLASSES}
        >
          Recuperar senha
        </button>
      </TextView>
    )
  }

  if (alertConfig.primaryButton || alertConfig.secondaryButton) {
    return (
      <div className={AUTH_LINK_CONTAINER_CLASSES}>
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
      <TextView className={AUTH_LINK_CONTAINER_CLASSES}>
        Por favor, clique para acessar sua conta.
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault()
            onLogin()
          }}
          className={AUTH_LINK_BUTTON_CLASSES}
        >
          Fazer Login
        </button>
      </TextView>
    )
  }

  return null
}
