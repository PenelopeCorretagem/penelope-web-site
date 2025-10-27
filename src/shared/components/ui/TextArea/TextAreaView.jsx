import { getInputThemeClasses, getInputLabelThemeClasses, getInputContainerThemeClasses } from '@shared/styles/theme'

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

  // Classes CSS usando o theme
  const containerClasses = getInputContainerThemeClasses()
  const labelClasses = getInputLabelThemeClasses({
    hasErrors: false,
    required: required,
  })
  const textareaClasses = getInputThemeClasses({
    isActive: isActive && !disabled,
    disabled: disabled,
    readOnly: readOnly,
    hasErrors: false,
    withToggle: false,
  })

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
