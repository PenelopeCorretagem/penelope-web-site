import { useButtonViewModel } from '@shared/components/ui/Button/useButtonViewModel'
import { Link } from 'react-router-dom'

/**
 * ButtonView - Componente de botão
 * Integra com ButtonViewModel para gerenciar estado e comportamento
 * @param {Node} children - Conteúdo do botão (texto, ícones, etc.)
 * @param {string} variant - Variante de cor ('pink' | 'brown' | 'softbrown' | 'white' | 'border-white')
 * @param {string} type - Tipo do botão ('button' | 'submit' | 'reset' | 'link')
 * @param {string} to - URL para navegação (quando type é 'link')
 * @param {string} width - Largura do botão ('full' | 'fit')
 * @param {string} shape - Forma do botão ('square' | 'circle')
 * @param {string} className - Classes CSS adicionais
 * @param {Function} onClick - Handler de clique
 */
export function ButtonView({
  children = '',
  variant = 'pink',
  type = 'button',
  to = null,
  width = 'full',
  shape = 'square',
  className = '',
  onClick,
}) {
  const {
    type: buttonType,
    to: buttonTo,
    isLink,
    active,
    disabled,
    hasErrors,
    errorMessages,
    handleClick,
    getButtonClasses,
  } = useButtonViewModel(children, variant, type, { onClick }, to)

  const buttonClasses = getButtonClasses(width, shape, className)

  const buttonContent = (
    <>
      {children}

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
    </>
  )

  // Se for um link, renderizar como Link do React Router
  if (isLink && buttonTo) {
    return (
      <Link
        to={buttonTo}
        className={buttonClasses}
        onClick={handleClick}
        aria-pressed={active}
        aria-disabled={disabled}
        aria-invalid={hasErrors}
        title={hasErrors ? errorMessages : undefined}
        role="button"
      >
        {buttonContent}
      </Link>
    )
  }

  // Caso contrário, renderizar como botão normal
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
      {buttonContent}
    </button>
  )
}
