const MenuItem = ({
  children,
  variant = 'default',
  shape = 'square',
  active = false,
  className = '',
  onClick,
}) => {
  const baseClasses = [
    'inline-flex items-center justify-center gap-2',
    'font-title-family font-medium',
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
    circle: 'rounded-full p-3',
    square: 'rounded-sm py-3 px-6',
  }

  const classes = [
    ...baseClasses,
    variants[variant],
    shapes[shape],
    className,
  ].join(' ')

  return (
    <button className={classes} aria-pressed={active} onClick={onClick}>
      {children}
    </button>
  )
}

export default MenuItem
