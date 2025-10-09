import { Link, useLocation } from 'react-router-dom'
import { useNavItemFactory } from '@shared/components/ui/NavItem/useNavItemViewModel'
import * as LucideIcons from 'lucide-react'

export function NavItemView({
  // Props semânticas em vez de model
  text = '',
  variant = 'default',
  initialActive = false,
  href = null,
  to = null,
  external = false,
  disabled = false,
  icon = null,
  iconOnly = false,
  // Props de apresentação e comportamento
  width = 'fit',
  shape = 'square',
  className = '',
  onClick,
  children,
}) {
  const location = useLocation()

  // Usa o hook factory com props semânticas
  const {
    text: viewText,
    variant: viewVariant,
    to: viewTo,
    disabled: viewDisabled,
    hasErrors,
    errorMessages,
    canClick,
    handleClick,
    icon: viewIcon,
    iconOnly: viewIconOnly,
  } = useNavItemFactory({
    text,
    variant,
    active: initialActive,
    href,
    to,
    external,
    disabled,
    icon,
    iconOnly,
    onClick
  })

  const renderIcon = () => {
    if (!viewIcon) return null
    const Icon = LucideIcons[viewIcon]
    return Icon ? <Icon className='h-3 w-3 lg:h-4 lg:w-4' /> : null
  }

  // Verifica se a rota atual corresponde a este item
  const isActive = viewTo
    ? viewTo === '/'
      ? location.pathname === '/'
      : location.pathname === viewTo || location.pathname.startsWith(`${viewTo}/`)
    : initialActive

  const getVariantClasses = (variant, isActive) => {
    const baseClasses = 'transition-all duration-200'
    const variants = {
      default: isActive
        ? 'bg-brand-pink text-brand-white scale-105'
        : 'bg-brand-white-tertiary text-brand-black hover:bg-brand-pink hover:text-brand-white hover:scale-105',
      destac: isActive
        ? 'bg-brand-pink text-brand-white scale-105'
        : 'bg-brand-brown text-brand-white hover:bg-brand-pink hover:scale-105',
    }
    return `${baseClasses} ${variants[variant] || variants.default}`
  }

  const getWidthClasses = width => {
    const widths = {
      full: 'w-full',
      fit: 'w-fit',
    }
    return widths[width] || widths.fit
  }

  const getShapeClasses = shape => {
    const shapes = {
      square: 'rounded-sm px-4 py-2',
      circle: 'rounded-full p-3',
    }
    return shapes[shape] || shapes.square
  }

  const getStateClasses = (disabled, hasErrors, canClick) => {
    if (hasErrors) return 'border-2 border-red-500'
    if (disabled) return 'cursor-not-allowed pointer-events-none opacity-50'
    if (canClick) return 'cursor-pointer'
    return ''
  }

  // Construção de classes
  const menuItemClasses = [
    // Base classes
    'inline-flex items-center justify-center gap-2',
    'font-title-family font-medium',
    'uppercase text-[12px] md:text-[16px]',
    'leading-none',
    'transition-all duration-200',
    // Dynamic classes
    getVariantClasses(viewVariant, isActive),
    getWidthClasses(width),
    getShapeClasses(shape),
    getStateClasses(viewDisabled, hasErrors, canClick),
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const displayText = viewIconOnly ? null : children || viewText

  // Renderização condicional baseada no tipo
  if (viewTo) {
    return (
      <Link
        to={viewTo}
        className={menuItemClasses}
        onClick={handleClick}
        aria-pressed={isActive}
        aria-disabled={viewDisabled}
        aria-invalid={hasErrors}
        title={hasErrors ? errorMessages : undefined}
      >
        {renderIcon()}
        {displayText}
      </Link>
    )
  }

  // Button padrão
  return (
    <button
      className={menuItemClasses}
      onClick={handleClick}
      disabled={viewDisabled}
      aria-pressed={isActive}
      aria-disabled={viewDisabled}
      aria-invalid={hasErrors}
      title={hasErrors ? errorMessages : undefined}
    >
      {renderIcon()}
      {displayText}
    </button>
  )
}
