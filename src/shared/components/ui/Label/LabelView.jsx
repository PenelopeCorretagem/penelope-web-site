import { useLabelViewModel } from '@shared/components/ui/Label/useLabelViewModel'

/**
 * LabelView component with theme variant validation.
 * Only accepts variants: pink, softPink, brown, softBrown, gray
 */
export function LabelView({ model, className = '' }) {
  const {
    displayText,
    finalClassName
  } = useLabelViewModel(model)

  const labelClasses = `${finalClassName} ${className}`.trim()

  return (
    <span className={labelClasses}>
      {displayText}
    </span>
  )
}
