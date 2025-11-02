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
    'text-text-primary',
    'focus:outline-none focus:ring-2 focus:ring-distac-primary focus:border-distac-primary',
    'cursor-pointer',
    'p-button-x',
    'pr-10',
    'text-left',
    'transition-colors duration-200',
  ]

  const variants = {
    default: 'bg-default-light',
    destac: 'bg-distac-primary text-default-light',
  }

  const shapes = {
    square: 'rounded-md',
    circle: 'rounded-full',
  }

  const widths = {
    full: 'w-full',
    fit: 'w-fit',
  }

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
          variants[variant],
          shapes[shape],
          widths[width],
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

      <div className='pointer-events-none absolute inset-y-0 right-3 flex items-center'>
        <svg
          className='h-4 w-4 text-current'
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
