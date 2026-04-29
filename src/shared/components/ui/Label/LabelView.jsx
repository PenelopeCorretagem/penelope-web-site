import { useLabelViewModel } from '@shared/components/ui/Label/useLabelViewModel'

/**
 * LabelView component with theme variant validation.
 * Only accepts variants: pink, softPink, brown, softBrown, gray
 */
export function LabelView({ model, className = '', leadingIcon = null }) {
  const {
    displayText,
    variant
  } = useLabelViewModel(model)

  // Base classes
  const baseClasses = 'text-button md:text-button-md text-center p-[var(--padding-button-circle)] md:p-[var(--padding-button-circle-md)] inline-flex items-center justify-center gap-1.5 rounded-sm font-medium transition-all duration-200'

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
      {leadingIcon && (
        <span className="inline-flex shrink-0" aria-hidden="true">
          {leadingIcon}
        </span>
      )}
      {displayText}
    </span>
  )
}
