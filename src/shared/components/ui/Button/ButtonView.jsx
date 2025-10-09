import { useButtonViewModel } from '@shared/components/ui/Button/useButtonViewModel'

/**
 * ButtonView - Componente de botão
 * Integra com ButtonViewModel para gerenciar estado e comportamento
 * @param {string} text - Texto do botão
 * @param {string} variant - Variante de cor ('pink' | 'brown' | 'white')
 * @param {string} type - Tipo do botão ('button' | 'submit' | 'reset')
 * @param {string} width - Largura do botão ('full' | 'fit')
 * @param {string} shape - Forma do botão ('square' | 'circle')
 * @param {string} className - Classes CSS adicionais
 * @param {Function} onClick - Handler de clique
 */
export function ButtonView({
  text = '',
  variant = 'pink',
  type = 'button',
  width = 'full',
  shape = 'square',
  className = '',
  onClick,
}) {
  const {
    text: buttonText,
    type: buttonType,
    active,
    disabled,
    hasErrors,
    errorMessages,
    handleClick,
    getButtonClasses,
  } = useButtonViewModel(text, variant, type, { onClick })

  const buttonClasses = getButtonClasses(width, shape, className)

  return (
    <button
      type={buttonType}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled}
      aria-pressed={active}
      aria-disabled={disabled}
      aria-invalid={hasErrors}
      title={hasErrors ? errorMessages : undefined}
    >
      {buttonText}

      {hasErrors && (
        <span className='ml-1 text-red-300' aria-hidden='true'>
          ⚠️
        </span>
      )}

      {active && (
        <span className='ml-1' aria-hidden='true'>
          ✓
        </span>
      )}
    </button>
  )
}
