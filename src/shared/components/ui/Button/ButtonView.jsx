import { useButtonViewModel } from '@shared/components/ui/Button/useButtonViewModel'
import { Link } from 'react-router-dom'

/**
 * ButtonView - Componente de botão usando theme design-model
 */
export function ButtonView({
  children = '',
  color = 'pink',
  type = 'button',
  to = null,
  width = 'full',
  shape = 'square',
  className = '',
  onClick,
  disabled = false,
  active = false,
}) {
  const {
    type: buttonType,
    to: buttonTo,
    isLink,
    disabled: viewModelDisabled,
    handleClick,
    getButtonClasses,
  } = useButtonViewModel(children, color, type, { onClick }, to)

  const isDisabled = disabled || viewModelDisabled
  const isActive = active

  // Use theme classes directly without removing padding
  const buttonClasses = getButtonClasses(width, shape, className, isDisabled, isActive)

  const content = (
    <>
      {children}
    </>
  )

  // Click handler
  const handleButtonClick = (event) => {
    if (isDisabled) {
      event.preventDefault()
      return
    }

    if (handleClick) {
      handleClick(event)
    }
  }

  if (isLink && buttonTo) {
    return (
      <Link
        to={buttonTo}
        className={buttonClasses}
        onClick={handleButtonClick}
        aria-pressed={isActive}
        aria-disabled={isDisabled}
        role="button"
      >
        {content}
      </Link>
    )
  }

  return (
    <button
      type={buttonType}
      className={buttonClasses}
      onClick={handleButtonClick}
      disabled={isDisabled}
      aria-pressed={isActive}
    >
      {content}
    </button>
  )
}
