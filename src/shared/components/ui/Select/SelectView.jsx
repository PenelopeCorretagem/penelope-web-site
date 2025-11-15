export function SelectView({
  value,
  onChange,
  name = 'filtro',
  id = 'select_filter',
  options = [],
  width = 'fit',
  className = '',
  variant = 'default',
  shape = 'square',
  disabled = false,
}) {
  const formattedOptions = options.map(option => {
    if (option && typeof option === 'object' && 'value' in option) {
      return {
        label: option.label,
        value: option.value,
      }
    }

    return {
      label: String(option).toUpperCase(),
      value: option,
    }
  })

  const baseClasses = [
    'appearance-none',
    'font-semibold uppercase',
    'focus:outline-none focus:ring-2 focus:ring-distac-primary',
    'cursor-pointer',
    'px-4 py-2',
    'pr-10',
    'text-left',
    'transition-colors duration-200',
  ]

  const variants = {
    default: 'bg-default-light text-default-dark',
    pink: 'bg-distac-primary-light text-default-dark placeholder:text-default-dark-muted focus:bg-default-light',
    destac: 'bg-distac-primary text-default-light',
    brown: 'bg-distac-secondary text-default-light focus:ring-2 focus:ring-distac-secondary focus:border-distac-secondary',
  }

  const shapes = {
    square: 'rounded-sm',
    circle: 'rounded-full',
  }

  const widths = {
    full: 'w-full',
    fit: 'w-fit',
  }

  const disabledClasses = disabled
    ? 'opacity-50 cursor-not-allowed'
    : ''

  return (
    <div className={`relative ${widths[width]}`}>
      <select
        name={name}
        id={id}
        value={value}
        disabled={disabled}
        onChange={onChange}
        className={[
          baseClasses.join(' '),
          variants[variant] || variants.default,
          shapes[shape],
          widths[width],
          disabledClasses,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {formattedOptions.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <div className={`pointer-events-none absolute inset-y-0 right-3 flex items-center ${variant === 'brown' || variant === 'destac' ? 'text-default-light' : 'text-current'}`}>
        <svg
          className='h-4 w-4'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          viewBox='0 0 24 24'
        >
          <path d='M19 9l-7 7-7-7' />
        </svg>
      </div>
    </div>
  )
}
