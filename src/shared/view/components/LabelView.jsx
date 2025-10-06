import { useLabelViewModel } from '../../hooks/components/useLabelViewModel'

export function LabelView({ model, className = '' }) {
  const {
    displayText,
    variant,
    size,
    hasErrors,
    errorMessages,
    isValid,
    isEmpty,
  } = useLabelViewModel(model)

  const getVariantClasses = variant => {
    const variants = {
      pink: 'bg-brand-pink text-brand-white',
      softPink: 'bg-brand-soft-pink text-brand-white',
      brown: 'bg-brand-brown text-brand-white',
      softBrown: 'bg-brand-soft-brown text-brand-white',
      gray: 'bg-brand-white-tertiary text-brand-black',
    }
    return variants[variant] || variants.pink
  }

  const getSizeClasses = size => {
    const sizes = {
      small: 'text-[12px] px-2 py-1',
      medium: 'text-[16px] px-3 py-2',
      large: 'text-[20px] px-4 py-3',
    }
    return sizes[size] || sizes.medium
  }

  const getStateClasses = (hasErrors, isValid, isEmpty) => {
    if (hasErrors) return 'border-2 border-red-500'
    if (isEmpty) return 'opacity-60'
    if (!isValid) return 'border border-yellow-400'
    return ''
  }

  const labelClasses = [
    // Base classes
    'inline-block rounded font-medium',
    'transition-all duration-200',
    // Dynamic classes
    getVariantClasses(variant),
    getSizeClasses(size),
    getStateClasses(hasErrors, isValid, isEmpty),
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span
      className={labelClasses}
      role='status'
      aria-label={displayText}
      aria-invalid={!isValid}
      title={hasErrors ? errorMessages : undefined}
    >
      {displayText}

      {hasErrors && (
        <span className='ml-1 text-red-300' aria-hidden='true'>
          ⚠️
        </span>
      )}

      {isEmpty && (
        <span className='ml-1 text-xs text-gray-400' aria-hidden='true'>
          (empty)
        </span>
      )}
    </span>
  )
}
