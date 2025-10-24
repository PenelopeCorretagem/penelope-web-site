import { usePopUpViewModel } from './usePopUpViewModel'

/**
 * PopUpView - Componente visual para exibição de popups
 * View pura que renderiza baseado no ViewModel
 */
export function PopUpView(props) {
  const {
    // Estado
    shouldRender,
    hasTitle,
    showCloseButton,
    title,
    children,

    // Handlers
    handleOverlayClick,
    _handleContentClick,
    handleClose,

    // Estilos
    getOverlayStyle,
    getContentStyle,
    getCloseButtonStyle,
    getTitleStyle,
    getContentClasses,

    // Classes CSS
    classes
  } = usePopUpViewModel(props)

  if (!shouldRender) {
    return null
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      handleClose()
    }
  }

  return (
    <div
      className={classes.overlay}
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      style={getOverlayStyle()}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
    >
      {/* Popup Content */}
      <div
        className={getContentClasses()}
        style={getContentStyle()}
        role="document"
      >
        {/* Close Button */}
        {showCloseButton && (
          <button
            onClick={handleClose}
            className={classes.closeButton}
            style={getCloseButtonStyle()}
            aria-label="Fechar popup"
            type="button"
          >
            ×
          </button>
        )}

        {/* Title */}
        {hasTitle && (
          <h2
            className={classes.title}
            style={getTitleStyle()}
          >
            {title}
          </h2>
        )}

        {/* Content */}
        <div className={classes.body}>
          {children}
        </div>
      </div>
    </div>
  )
}

