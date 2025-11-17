import { ChevronDown } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useSelectViewModel } from './useSelectViewModel'

function getSelectClasses({ variant, shape, width, disabled, className }) {
  const baseClasses = [
    'font-semibold uppercase',
    'text-form-control md:text-form-control-md',
    'text-left',
    'p-select md:p-select-md',
    'transition-colors duration-200',
    'flex items-center justify-between',
    'gap-select md:gap-select-md',
  ]

  // Adicionar classes de focus apenas se não estiver disabled
  if (!disabled) {
    baseClasses.push('focus:outline-none focus:ring-2 focus:ring-distac-primary', 'cursor-pointer')
  }

  const variants = {
    default: 'bg-default-light text-default-dark',
    pink: 'bg-distac-primary-light text-default-dark',
    destac: 'bg-distac-primary text-default-light',
    brown: 'bg-distac-secondary text-default-light',
  }

  const shapes = {
    square: 'rounded-sm',
    circle: 'rounded-full',
  }

  const widths = {
    full: 'w-full',
    fit: 'w-fit min-w-[var(--select-min-width,theme(minWidth.32))]',
  }

  // Usar mesmo estilo do InputView disabled
  const disabledClasses = disabled
    ? 'bg-default-light-muted text-default-dark cursor-not-allowed opacity-75 focus:outline-none focus:ring-0'
    : ''

  return [
    baseClasses.join(' '),
    disabled ? disabledClasses : (variants[variant] || variants.default),
    shapes[shape],
    widths[width],
    className,
  ]
    .filter(Boolean)
    .join(' ')
}

function getDropdownClasses({ variant, isAnimating }) {
  const dropdownVariants = {
    default: 'bg-default-light border-default-dark/20',
    pink: 'bg-default-light border-distac-primary/20',
    destac: 'bg-default-light border-distac-primary/20',
    brown: 'bg-default-light border-distac-secondary/20',
  }

  return [
    'absolute top-full left-0 right-0 z-50 mt-1',
    'border rounded-lg shadow-lg',
    'max-h-60 overflow-y-auto',
    'transition-all duration-300 ease-out',
    'transform-gpu',
    isAnimating ? 'opacity-100 translate-y-0 scale-y-100' : 'opacity-0 -translate-y-2 scale-y-95',
    dropdownVariants[variant] || dropdownVariants.default,
  ].join(' ')
}

function getOptionClasses({ isSelected }) {
  return [
    'px-4 py-2 cursor-pointer transition-colors duration-150',
    'hover:bg-distac-primary hover:text-white',
    'first:rounded-t-lg last:rounded-b-lg',
    'text-default-dark font-semibold uppercase',
    isSelected ? 'bg-distac-primary text-white' : '',
  ]
    .filter(Boolean)
    .join(' ')
}

function getLabelClasses({ hasErrors, required }) {
  const classes = []

  classes.push(
    'uppercase',
    'font-semibold',
    'font-default',
    'text-form-control',
    'leading-none',
    'md:text-form-control-md',
  )

  if (hasErrors) classes.push('text-distac-primary')
  else classes.push('text-default-dark-muted')

  if (required) {
    classes.push('after:content-["*"]', 'after:text-distac-primary', 'after:ml-1')
  }

  return classes.join(' ')
}

export function SelectView({
  value,
  name,
  id,
  options = [],
  width = 'fit',
  variant = 'default',
  shape = 'square',
  disabled = false,
  required = false,
  placeholder = 'Selecione...',
  className = '',
  children,
  hasLabel = false,
  hasErrors = false,
  onChange,
}) {
  const selectProps = useSelectViewModel({
    value,
    name,
    id,
    options,
    width,
    variant,
    shape,
    disabled,
    required,
    placeholder,
  })

  const [isAnimating, setIsAnimating] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)

  const containerRef = useRef(null)
  const selectElementRef = useRef(null)

  // ----------- AQUI ESTÁ A SOLUÇÃO DEFINITIVA -----------
  useEffect(() => {
    if (width !== 'fit') return
    if (!selectElementRef.current) return

    const el = selectElementRef.current

    // salva o conteúdo atual
    const originalText = el.querySelector('span').textContent

    let maxWidth = 0

    const measureText = (text) => {
      const span = el.querySelector('span')
      span.textContent = text

      const rect = el.getBoundingClientRect()
      return rect.width
    }

    // mede placeholder
    maxWidth = Math.max(maxWidth, measureText(selectProps.placeholder))

    // mede todas opções
    selectProps.options.forEach((opt) => {
      maxWidth = Math.max(maxWidth, measureText(opt.label))
    })

    // restaura texto original
    el.querySelector('span').textContent = originalText

    // aplica min-width real
    containerRef.current.style.setProperty('--select-min-width', `${maxWidth}px`)
  }, [selectProps.options, selectProps.placeholder, selectProps.displayValue, width])
  // --------------------------------------------------------


  // ANIMAÇÃO CONTINUA IGUAL:
  useEffect(() => {
    if (selectProps.isOpen) {
      setShouldRender(true)
      const timer = setTimeout(() => setIsAnimating(true), 15)
      return () => clearTimeout(timer)
    } else {
      setIsAnimating(false)
      const timer = setTimeout(() => setShouldRender(false), 300)
      return () => clearTimeout(timer)
    }
  }, [selectProps.isOpen])


  const selectClasses = getSelectClasses({
    variant,
    shape,
    width,
    disabled,
    className,
  })

  const labelClasses = getLabelClasses({ hasErrors, required })

  const handleOptionSelect = (optionValue) => {
    selectProps.handleOptionClick(optionValue)
    if (onChange) onChange({ target: { name: selectProps.name, value: optionValue } })
  }

  return (
    <div className={`${selectProps.width === 'full' ? 'w-full' : 'w-fit'} flex flex-col gap-2`}>

      {hasLabel && children && (
        <label className={labelClasses} htmlFor={selectProps.id}>
          {children}:
        </label>
      )}

      <div
        ref={containerRef}
        className={`relative ${selectProps.width === 'full' ? 'w-full' : 'w-fit'}`}
        style={{ minWidth: 'var(--select-min-width)' }}
      >
        <div
          ref={selectElementRef}
          role="combobox"
          aria-expanded={selectProps.isOpen}
          aria-haspopup="listbox"
          tabIndex={selectProps.disabled ? -1 : 0}
          onClick={selectProps.handleToggle}
          onKeyDown={selectProps.handleKeyDown}
          className={selectClasses}
          id={selectProps.id}
        >
          <span>{selectProps.displayValue}</span>
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 stroke-4 p-0 ${selectProps.isOpen ? 'rotate-180' : ''}`}
          />
        </div>

        {shouldRender && (
          <ul
            role="listbox"
            className={getDropdownClasses({ variant: selectProps.variant, isAnimating })}
            style={{ transformOrigin: 'top center' }}
          >
            {selectProps.options.map(({ label, value: optionValue }) => (
              <li
                key={optionValue}
                role="option"
                aria-selected={String(optionValue === selectProps.value)}
                tabIndex={0}
                onClick={() => handleOptionSelect(optionValue)}
                className={getOptionClasses({ isSelected: optionValue === selectProps.value })}
              >
                {label}
              </li>
            ))}
          </ul>
        )}

        <input type="hidden" name={selectProps.name} value={selectProps.value} />
      </div>
    </div>
  )
}
