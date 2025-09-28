import { useButtonViewModel } from '../../hooks/components/useButtonViewModel'

/**
 * ButtonView - Componente de botão
 * Integra com ButtonViewModel para gerenciar estado e comportamento
 * @param {ButtonModel} model - Modelo do botão
 * @param {string} width - Largura do botão ('full' | 'fit')
 * @param {string} shape - Forma do botão ('square' | 'circle')
 * @param {string} className - Classes CSS adicionais
 * @param {Function} onClick - Handler de clique
 */
export function ButtonView({
  model,
  width = 'full',
  shape = 'square',
  className = '',
  onClick,
}) {
  const {
    text,
    variant,
    type,
    active,
    disabled,
    hasErrors,
    errorMessages,
    canClick,
    handleClick,
  } = useButtonViewModel(model, { onClick })

  const getVariantClasses = (variant, active) => {
    const variants = {
      pink: {
        base: 'bg-brand-pink text-brand-white',
        active: 'bg-brand-brown ring-2 ring-brand-accent',
        hover: 'hover:bg-brand-brown',
      },
      brown: {
        base: 'bg-brand-white-secondary text-brand-black',
        active: 'bg-brand-pink text-brand-white ring-2 ring-brand-accent',
        hover: 'hover:bg-brand-white-tertiary',
      },
      white: {
        base: 'bg-transparent border-2 border-brand-pink text-brand-pink',
        active: 'bg-brand-pink text-brand-white border-brand-pink',
        hover: 'hover:bg-brand-pink hover:text-brand-white',
      },
    }

    const variantStyles = variants[variant] || variants.pink
    const stateClass = active ? variantStyles.active : variantStyles.hover

    return [variantStyles.base, stateClass].join(' ')
  }

  const getWidthClasses = width => {
    const widths = {
      full: 'w-full',
      fit: 'w-fit',
    }
    return widths[width] || widths.full
  }

  const getShapeClasses = shape => {
    const shapes = {
      square: 'rounded-sm',
      circle: 'rounded-full',
    }
    return shapes[shape] || shapes.square
  }

  const getStateClasses = (disabled, hasErrors, canClick) => {
    if (hasErrors) return 'border-2 border-red-500'
    if (disabled) return 'cursor-not-allowed pointer-events-none opacity-50'
    if (canClick) return 'cursor-pointer'
    return ''
  }

  const buttonClasses = [
    // Base classes
    'inline-flex items-center justify-center gap-2',
    'font-title-family font-medium',
    'text-[12px] md:text-[16px]',
    'leading-none',
    'uppercase',
    'transition-all duration-200',
    'px-4 py-2', // padding base
    // Dynamic classes
    getVariantClasses(variant, active),
    getWidthClasses(width),
    getShapeClasses(shape),
    getStateClasses(disabled, hasErrors, canClick),
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled}
      aria-pressed={active}
      aria-disabled={disabled}
      aria-invalid={hasErrors}
      title={hasErrors ? errorMessages : undefined}
    >
      {text}

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
