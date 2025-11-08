/**
 * TextAreaView - Componente de textarea com layout similar ao InputView
 */
export function TextAreaView({
  children,
  id = '',
  placeholder = '',
  value = '',
  rows = 4,
  isActive = true,
  hasLabel = true,
  required = false,
  disabled = false,
  readOnly = false,
  onChange,
  onClick,
  ...otherProps
}) {
  // IDs e nomes
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`
  const textareaName = otherProps.name || textareaId
  const label = children || ''

  // Base classes
  const containerClasses = 'w-full flex flex-col gap-2'

  // Label classes
  const baseLabelClasses = 'uppercase font-semibold font-default text-[12px] leading-none md:text-[16px]'
  const labelStateClass = 'text-default-dark-muted'
  const requiredClass = required ? 'after:content-["*"] after:text-distac-primary after:ml-1' : ''
  const labelClasses = `${baseLabelClasses} ${labelStateClass} ${requiredClass}`.trim()

  // Textarea classes
  const baseTextareaClasses = 'w-full px-4 py-2 rounded-sm transition-colors duration-200 placeholder:text-default-dark-muted placeholder:text-[12px] md:placeholder:text-[16px] placeholder:uppercase placeholder:font-default'

  let stateClasses = ''
  if (disabled) {
    stateClasses = 'bg-default-light-muted text-default-dark-light cursor-not-allowed opacity-75'
  } else if (readOnly) {
    stateClasses = 'bg-default-light-muted text-default-dark-light cursor-text select-text'
  } else if (isActive) {
    stateClasses = 'bg-distac-primary-light focus:bg-default-light focus:ring-2 focus:ring-distac-primary focus:outline-none'
  } else {
    stateClasses = 'bg-default-light-muted'
  }

  const textareaClasses = `${baseTextareaClasses} ${stateClasses}`.trim()

  const handleTextAreaChange = (event) => {
    if (onChange) {
      onChange(event.target.value, event)
    }
  }

  return (
    <div className={containerClasses}>
      {hasLabel && label && (
        <label className={labelClasses} htmlFor={textareaId}>
          {label}:
        </label>
      )}

      <textarea
        className={textareaClasses}
        id={textareaId}
        name={textareaName}
        placeholder={placeholder}
        value={value}
        rows={rows}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        onChange={handleTextAreaChange}
        onClick={onClick}
        {...otherProps}
      />
    </div>
  )
}
