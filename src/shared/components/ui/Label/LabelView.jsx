import { useLabelViewModel } from '@shared/components/ui/Label/useLabelViewModel'

/**
 * LabelView component with theme variant validation.
 * Only accepts variants: pink, softPink, brown, softBrown, gray
 */
export function LabelView({ model, className = '' }) {
  const {
    displayText,
    variant
  } = useLabelViewModel(model)

  // Base classes
  const baseClasses = 'text-[12px] md:text-[14px] text-center px-2 py-1 md:px-3 md:py-2 inline-block rounded-sm font-medium transition-all duration-200'

  // Variant classes
  const variantClasses = {
    pink: 'bg-distac-primary text-default-light',
    softPink: 'bg-distac-primary-light text-default-light',
    brown: 'bg-distac-secondary text-default-light',
    softBrown: 'bg-distac-secondary-light text-default-light',
    gray: 'bg-default-dark-light text-default-light',
  }

  const variantClass = variantClasses[variant] || variantClasses.pink
  const labelClasses = `${baseClasses} ${variantClass} ${className}`.trim()

  return (
    <span className={labelClasses}>
      {displayText}
    </span>
  )
}
