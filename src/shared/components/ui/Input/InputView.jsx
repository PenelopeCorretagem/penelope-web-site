import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useInputViewModel } from '@shared/components/ui/Input/useInputViewModel'

/**
 * InputView - Componente de input
 * Renderiza campos de entrada usando MVVM
 * @param {string} children - Label do input (quando hasLabel=true)
 * @param {string} id - ID único do input
 * @param {string} placeholder - Texto placeholder
 * @param {string} type - Tipo do input ('text', 'email', 'password', etc.)
 * @param {string} value - Valor inicial do input
 * @param {boolean} isActive - Se o input está ativo/editável
 * @param {boolean} hasLabel - Se deve mostrar label
 * @param {boolean} required - Se o campo é obrigatório
 * @param {boolean} showPasswordToggle - Se deve mostrar botão de toggle para senha
 * @param {Function} onChange - Handler para mudanças de valor
 * @param {Function} onClick - Handler para cliques no input
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
  showPasswordToggle = false,
  onChange,
  onClick,
}) {
  // Estado local para controlar visibilidade da senha
  const [showPassword, setShowPassword] = useState(false)

  // Determina o tipo real do input baseado no toggle
  const actualType = (type === 'password' && showPassword) ? 'text' : type
  const hasToggleButton = type === 'password' && showPasswordToggle
  const {
    value: inputValue,
    placeholder: inputPlaceholder,
    id: inputId,
    name: inputName,
    label: inputLabel,
    isEditable,
    shouldShowLabel,
    hasErrors,
    errorMessages,
    containerClasses,
    labelClasses,
    inputClasses,
    handleChange,
    handleFocus,
    handleBlur,
  } = useInputViewModel({
    value,
    placeholder,
    type,
    id,
    label: children || '',
    isActive,
    hasLabel,
    required,
  })

  const togglePassword = () => {
    setShowPassword(prev => !prev)
  }

  const handleInputChange = (event) => {
    handleChange(event)
    if (onChange) {
      onChange(event.target.value, event)
    }
  }

  return (
    <div className={containerClasses}>
      {shouldShowLabel && (
        <label className={labelClasses} htmlFor={inputId}>
          {inputLabel}:
        </label>
      )}

      <div className="relative">
        <input
          className={`${inputClasses} ${hasToggleButton ? 'pr-12' : ''}`}
          type={actualType}
          id={inputId}
          name={inputName}
          placeholder={inputPlaceholder}
          value={inputValue}
          disabled={!isEditable}
          readOnly={!isEditable}
          required={required}
          onChange={handleInputChange}
          onClick={onClick}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-invalid={hasErrors}
          aria-describedby={hasErrors ? `${inputId}-error` : undefined}
        />

        {hasToggleButton && (
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-black focus:outline-none transition-colors duration-200"
            onClick={togglePassword}
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>

      {hasErrors && (
        <div className="text-red-600 text-sm mt-1" id={`${inputId}-error`}>
          {errorMessages}
        </div>
      )}
    </div>
  )
}
