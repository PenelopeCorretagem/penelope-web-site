import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { getInputThemeClasses, getInputLabelThemeClasses, getInputContainerThemeClasses } from '@shared/styles/theme'

/**
 * InputView - Componente de input simplificado
 */
export function InputView({
  children,
  id = '',
  placeholder = '',
  type = 'text',
  value = '',
  isActive = true,
  hasLabel = true,
  required = false,
  disabled = false,
  readOnly = false,
  showPasswordToggle = false,
  onChange,
  onClick,
  ...otherProps
}) {
  const [showPassword, setShowPassword] = useState(false)

  // Determina o tipo real do input baseado no toggle
  const actualType = (type === 'password' && showPassword) ? 'text' : type
  const hasToggleButton = type === 'password' && showPasswordToggle

  // IDs e nomes
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
  const inputName = otherProps.name || inputId
  const label = children || ''

  // Classes CSS usando o theme
  const containerClasses = getInputContainerThemeClasses()
  const labelClasses = getInputLabelThemeClasses({
    hasErrors: false,
    required: required,
  })
  const inputClasses = getInputThemeClasses({
    isActive: isActive && !disabled,
    disabled: disabled,
    readOnly: readOnly,
    hasErrors: false,
    withToggle: hasToggleButton,
  })

  const togglePassword = () => {
    setShowPassword(prev => !prev)
  }

  const handleInputChange = (event) => {
    if (onChange) {
      onChange(event.target.value, event)
    }
  }

  return (
    <div className={containerClasses}>
      {hasLabel && label && (
        <label className={labelClasses} htmlFor={inputId}>
          {label}:
        </label>
      )}

      <div className="relative">
        <input
          className={inputClasses}
          type={actualType}
          id={inputId}
          name={inputName}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          onChange={handleInputChange}
          onClick={onClick}
          {...otherProps}
        />

        {hasToggleButton && (
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-default-dark focus:outline-none transition-colors duration-200"
            onClick={togglePassword}
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </div>
  )
}
