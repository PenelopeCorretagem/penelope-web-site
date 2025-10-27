import { useSelectFilterViewModel } from './useSelectFilterViewModel'

export function SelectFilterView({
  value,
  onChange,
  name,
  id,
  options = [],
  width = 'fit',
  className = '',
  variant = 'default',
  shape = 'square',
  disabled = false,
}) {
  const { options: formattedOptions, name: modelName, id: modelId } =
    useSelectFilterViewModel({ options, name, id })

  const baseClasses = [
    'appearance-none',
    'font-semibold uppercase',
    'text-text-primary',
    'bg-surface-secondary',
    'border border-gray-300',
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    'cursor-pointer',
    'px-6 py-4',
    'text-left',
    'transition-colors duration-200',
  ]

  const variants = {
    default: 'bg-default-light-secondary',
    destac: 'bg-brand-primary text-surface-primary',
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
        name={modelName}
        id={modelId}
        value={value}
        disabled={disabled}
        onChange={onChange}
        className={[
          baseClasses.join(' '),
          variants[variant],
          shapes[shape],
          widths[width],
          className,
          'pr-10',
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
          className='h-4 w-4 text-gray-500'
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
