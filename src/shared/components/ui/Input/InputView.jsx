import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

/**
 * Compõe as classes CSS do input baseado no estado.
 * Responsabilidade da View: definir como o componente é exibido.
 */
function getInputClasses({ isActive, disabled, readOnly, hasErrors, withToggle, isCheckbox }) {
  const classes = []

  if (isCheckbox) {
    // Classes específicas para checkbox - com aparência visual
    classes.push(
      'w-4',
      'h-4',
      'rounded',
      'border-2',
      'transition-all',
      'duration-200',
      'appearance-none',
      'relative'
    )

    // Estados do checkbox
    if (disabled) {
      classes.push(
        'bg-default-white',
        'border-default-dark-muted',
        'opacity-50',
        'cursor-not-allowed'
      )
    } else {
      classes.push(
        'bg-white',
        'border-default-dark-muted',
        'cursor-pointer',
        'hover:border-distac-primary',
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-distac-primary',
        'focus:ring-opacity-50'
      )
    }

    // Estado checked - ícone centralizado
    classes.push(
      'checked:bg-distac-primary',
      'checked:border-distac-primary',
      'checked:after:content-["✓"]',
      'checked:after:absolute',
      'checked:after:top-1/2',
      'checked:after:left-1/2',
      'checked:after:-translate-x-1/2',
      'checked:after:-translate-y-1/2',
      'checked:after:text-white',
      'checked:after:text-[10px]',
      'checked:after:font-bold',
      'checked:after:leading-none'
    )
  } else {
    // Classes base para inputs normais
    classes.push(
      'w-full',
      'p-input md:p-input-md',
      'rounded-sm',
      'transition-colors',
      'duration-200',
      'text-form-control',
      'md:text-form-control-md',
    )

    // Placeholder
    classes.push(
      'placeholder:text-current',
      'placeholder:text-form-control',
      'placeholder:md:text-form-control-md',
      'placeholder:leading-none',
      'placeholder:font-default',
      'placeholder:p-0',
      'placeholder:m-0'
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
    'font-semibold',
    'font-default',
    'text-form-control',
    'leading-none',
    'md:text-form-control-md',
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
  const [previousValue, setPreviousValue] = useState(value)

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
        // Aplicar formatação em tempo real se tiver formatOnChange nas props
        let processedValue = event.target.value

        if (otherProps.formatOnChange && otherProps.formatter && typeof otherProps.formatter === 'function') {
          // Para formatação de área e moeda, passar valor anterior para detectar backspace
          if (otherProps.formatter.name === 'formatCurrency' || otherProps.formatter.name === 'formatArea') {
            processedValue = otherProps.formatter(event.target.value, previousValue)
          } else {
            processedValue = otherProps.formatter(event.target.value)
          }

          // Atualizar o valor do input imediatamente
          event.target.value = processedValue

          // Para campos com sufixos (m², R$), posicionar cursor antes do sufixo
          if (processedValue.includes('m²')) {
            setTimeout(() => {
              const cursorPosition = processedValue.indexOf(' m²')
              if (event.target.setSelectionRange && cursorPosition > 0) {
                event.target.setSelectionRange(cursorPosition, cursorPosition)
              }
            }, 0)
          }
        }

        // Salvar valor anterior para próxima comparação
        setPreviousValue(processedValue)
        onChange(processedValue, event)
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

        <div className={`w-full rounded-sm transition-colors duration-200 flex items-center p-button-rectangle md:p-button-rectangle-md ${
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
