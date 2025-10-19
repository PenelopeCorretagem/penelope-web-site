import { LucideArrowLeftToLine } from 'lucide-react'
import { useArrowBackViewModel } from '@shared/components/ui/ArrowBack/useArrowBackViewModel'

/**
 * ArrowBackView - Botão de voltar página usando MVVM
 * @param {number} size - Tamanho do ícone
 * @param {boolean} disabled - Se o botão está desabilitado
 * @param {string} ariaLabel - Label de acessibilidade
 * @param {string} className - Classes CSS adicionais
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
    buttonClasses,
    buttonBaseClasses,
    iconClasses,
    handleClick,
  } = useArrowBackViewModel({
    size,
    disabled,
    ariaLabel,
  })

  // Se className for fornecido, usa classes base + className
  // Senão usa classes completas do ViewModel
  const finalClasses = className
    ? `${buttonBaseClasses} ${className}`
    : buttonClasses

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={finalClasses}
      aria-label={accessibilityLabel}
    >
      <LucideArrowLeftToLine size={iconSize} className={iconClasses} />
    </button>
  )
}
