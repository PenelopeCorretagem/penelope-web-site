import { LucideArrowLeftToLine } from 'lucide-react'
import { useArrowBackViewModel } from '@shared/components/ui/ArrowBack/useArrowBackViewModel'

/**
 * ArrowBackView - Botão de voltar página
 */
export function ArrowBackView({
  size = 40,
  disabled = false,
  ariaLabel = 'Voltar para página anterior',
  className = '',
}) {
  const {
    size: iconSize,
    disabled: isDisabled,
    ariaLabel: accessibilityLabel,
    handleClick,
    getButtonClasses,
    getIconClasses,
  } = useArrowBackViewModel({
    size,
    disabled,
    ariaLabel,
  })

  const buttonClasses = getButtonClasses(className)
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
