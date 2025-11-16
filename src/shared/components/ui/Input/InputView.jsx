import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

/**
 * Compõe as classes CSS do input baseado no estado.
 * Responsabilidade da View: definir como o componente é exibido.
 */
function getInputClasses({ isActive, disabled, readOnly, hasErrors, withToggle, isCheckbox }) {
  const classes = []

  if (isCheckbox) {
    // Classes específicas para checkbox
    classes.push(
      'w-4',
      'h-4',
      'rounded',
      'transition-colors',
      'duration-200'
    )

    if (disabled) {
      classes.push(
        'opacity-50',
        'cursor-not-allowed',
        'accent-default-dark-muted'
      )
    } else {
      classes.push(
        'cursor-pointer',
        'accent-distac-primary'
      )
    }
  } else {
    // Classes base para inputs normais
    classes.push(
      'w-full',
      'px-4',
      'py-2',
      'rounded-sm',
      'transition-colors',
      'duration-200',
      'text-[12px]',
      'md:text-[16px]',
      'leading-normal'
    )

    // Placeholder
    classes.push(
      'placeholder:text-default-dark-muted',
      'placeholder:text-[12px]',
      'md:placeholder:text-[16px]',
      'placeholder:uppercase',
      'placeholder:font-default'
    )

    // Estados
    if (disabled) {
      classes.push(
        'bg-default-light-muted',
        'text-default-dark',
        'cursor-not-allowed',
        'opacity-75'
      )
    } else if (readOnly) {
      classes.push(
        'bg-default-light-muted',
        'text-default-dark-light',
        'cursor-text',
        'select-text'
      )
    } else if (isActive) {
      classes.push(
        'bg-distac-primary-light',
        'focus:bg-default-light',
        'focus:ring-2',
        'focus:ring-distac-primary',
        'focus:outline-none'
      )
    } else {
      classes.push('bg-default-light-muted')
    }

    // Erro
    if (hasErrors) {
      classes.push('border-2', 'border-distac-primary', 'focus:ring-distac-primary')
    }

    // Espaço para botão de toggle
    if (withToggle) {
      classes.push('pr-12')
    }
  }

  return classes.join(' ')
}

/**
 * Compõe as classes CSS do label baseado no estado.
 */
function getLabelClasses({ hasErrors, required }) {
  const classes = []

  // Classes base
  classes.push(
    'uppercase',
    'font-semibold',
    'font-default',
    'text-[12px]',
    'leading-none',
    'md:text-[16px]'
  )

  // Estado de erro
  if (hasErrors) {
    classes.push('text-distac-primary')
  } else {
    classes.push('text-default-dark-muted')
  }

  // Indicador de obrigatório
  if (required) {
    classes.push('after:content-["*"]', 'after:text-distac-primary', 'after:ml-1')
  }

  return classes.join(' ')
}

/**
 * InputView - Componente de input com estilos definidos na View.
 * Toda a lógica de estilização visual está contida aqui.
 */
export function InputView({
  children,
  id = '',
  placeholder = '',
  type = 'text',
  value = '',
  checked = false,
  isActive = true,
  hasLabel = true,
  required = false,
  disabled = false,
  readOnly = false,
  showPasswordToggle = false,
  hasErrors = false,
  className = '',
  onChange,
  onClick,
  ...otherProps
}) {
  const [showPassword, setShowPassword] = useState(false)

  // Determina o tipo real do input baseado no toggle
  const actualType = (type === 'password' && showPassword) ? 'text' : type
  const hasToggleButton = type === 'password' && showPasswordToggle
  const isCheckbox = type === 'checkbox'

  // IDs e nomes
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
  const inputName = otherProps.name || inputId
  const label = children || ''

  // Classes CSS compostas na View
  const containerClasses = isCheckbox
    ? 'w-full flex flex-col gap-2'
    : 'w-full flex flex-col gap-2'

  const labelClasses = getLabelClasses({ hasErrors, required })

  const inputClasses = `${getInputClasses({
    isActive: isActive && !disabled,
    disabled,
    readOnly,
    hasErrors,
    withToggle: hasToggleButton,
    isCheckbox,
  })} ${className}`.trim()

  const togglePassword = () => {
    setShowPassword(prev => !prev)
  }

  const handleInputChange = (event) => {
    if (onChange) {
      if (isCheckbox) {
        onChange(event.target.checked, event)
      } else {
        onChange(event.target.value, event)
      }
    }
  }

  if (isCheckbox) {
    return (
      <div className={containerClasses}>
        {hasLabel && label && (
          <label className={labelClasses} htmlFor={inputId}>
            {label}:
          </label>
        )}

        <div className={`w-full rounded-sm px-4 transition-colors duration-200 flex items-center${
          disabled
            ? 'bg-default-light-muted opacity-75'
            : 'bg-distac-primary-light'
        }`}
        >
          <label className={`flex items-center gap-2 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
            <input
              className={inputClasses}
              type="checkbox"
              id={inputId}
              name={inputName}
              checked={checked}
              disabled={disabled}
              required={required}
              onChange={handleInputChange}
              onClick={onClick}
              {...otherProps}
            />
            <span className={`text-[12px] md:text-[16px] text-default-dark`}>
              {placeholder || label}
            </span>
          </label>
        </div>
      </div>
    )
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
            className="absolute right-4 top-1/2 -translate-y-1/2 text-default-dark focus:outline-none transition-colors duration-200 cursor-pointer"
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
