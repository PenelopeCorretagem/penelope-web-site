// BackButtonView.js
import { LucideArrowLeftToLine } from 'lucide-react'
import { useBackButtonViewModel } from './useBackButtonViewModel'

export function BackButtonView({
  size,
  disabled = false,
  ariaLabel,
  className = '',
  mode = 'icon', // 'icon' or 'text'
  text = 'Voltar',
}) {
  const {
    size: iconSize,
    disabled: isDisabled,
    ariaLabel: accessibilityLabel,
    mode: displayMode,
    text: displayText,
    handleClick,
    getBackButtonClasses,
    getIconClasses,
  } = useBackButtonViewModel({ size, disabled, ariaLabel, mode, text })

  const buttonClasses = getBackButtonClasses(className)
  const iconClasses = getIconClasses()

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={buttonClasses}
      aria-label={accessibilityLabel}
    >
      {displayMode === 'text' ? (
        <>
          <LucideArrowLeftToLine size={16} className={iconClasses} />
          {displayText}
        </>
      ) : (
        <LucideArrowLeftToLine size={iconSize} className={iconClasses} />
      )}
    </button>
  )
}
