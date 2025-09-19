export function ButtonView({
  children,
  width = 'fit',
  className = '',
  variant = 'default',
  active = false,
  type = 'button',
  shape = 'square',
  onClick,
  disabled = false,
}) {
  const baseClasses = [
    'inline-flex items-center justify-center gap-2',
    'font-title-family font-bold',
    'text-sm md:text-base lg:text-lg',
    'leading-none',
    'uppercase',
    'cursor-pointer',
    'transition-colors duration-200',
  ]

  const variants = {
    default: active
      ? 'bg-brand-primary text-surface-primary'
      : 'bg-surface-tertiary hover:bg-brand-primary text-text-primary hover:text-surface-primary',
    destac: active
      ? 'bg-brand-primary text-surface-primary'
      : 'bg-brand-secondary hover:bg-brand-primary text-surface-primary',
  }

  const shapes = {
    circle: 'rounded-full p-button-y',
    square: 'rounded-sm p-button',
  }

  const widths = {
    full: 'w-full',
    fit: 'w-fit',
  }
  return (
    <button
      type={type}
      className={[
        baseClasses.join(' '),
        variants[variant],
        shapes[shape],
        widths[width],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
