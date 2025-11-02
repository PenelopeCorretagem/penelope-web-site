// BackButtonView.js
import { LucideArrowLeftToLine } from 'lucide-react'
import { useBackButtonViewModel } from './useBackButtonViewModel'

export function BackButtonView({
  size,
  disabled = false,
  ariaLabel,
  className = '',
}) {
  const {
    size: iconSize,
    disabled: isDisabled,
    ariaLabel: accessibilityLabel,
    handleClick,
    getBackButtonClasses,
    getIconClasses,
  } = useBackButtonViewModel({ size, disabled, ariaLabel })

  const buttonClasses = getBackButtonClasses(className)
  const iconClasses = getIconClasses()

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={buttonClasses}
      aria-label={accessibilityLabel}
    >
      <LucideArrowLeftToLine size={iconSize} className={iconClasses} />
    </button>
  )
}
