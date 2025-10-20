import { useLabelViewModel } from '@shared/components/ui/Label/useLabelViewModel'

export function LabelView({ model, className = '' }) {
  const {
    displayText,
    hasErrors,
    errorMessages,
    isValid,
    isEmpty,
    finalClassName,
  } = useLabelViewModel(model)

  const labelClasses = finalClassName + (className ? ` ${className}` : '')

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
