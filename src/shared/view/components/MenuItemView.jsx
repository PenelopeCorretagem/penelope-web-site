import { Link } from 'react-router-dom'
import { useMenuItemViewModel } from '@shared/hooks/components/useMenuItemViewModel'
import { useLocation } from 'react-router-dom'
import * as LucideIcons from 'lucide-react'

export function MenuItemView({
  model,
  width = 'fit',
  shape = 'square',
  className = '',
  onClick,
  children,
}) {
  const location = useLocation()
  const {
    text,
    variant,
    to,
    disabled,
    hasErrors,
    errorMessages,
    canClick,
    handleClick,
    icon,
    iconOnly,
  } = useMenuItemViewModel(model, { onClick })

  const renderIcon = () => {
    if (!icon) return null
    const Icon = LucideIcons[icon]
    return Icon ? <Icon className='h-3 w-3 lg:h-4 lg:w-4' /> : null
  }

  // Verifica se a rota atual corresponde a este item
  const active = to
    ? to === '/'
      ? location.pathname === '/'
      : location.pathname === to || location.pathname.startsWith(`${to}/`)
    : false

  const getVariantClasses = (variant, isActive) => {
    const baseClasses = 'transition-all duration-200'
    const variants = {
      default: isActive
        ? 'bg-brand-pink text-brand-white scale-105'
        : 'bg-brand-white-tertiary text-brand-black hover:bg-brand-pink hover:text-brand-white hover:scale-102',
      destac: isActive
        ? 'bg-brand-pink text-brand-white scale-105'
        : 'bg-brand-brown text-brand-white hover:bg-brand-pink hover:scale-102',
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
    getVariantClasses(variant, active),
    getWidthClasses(width),
    getShapeClasses(shape),
    getStateClasses(disabled, hasErrors, canClick),
    className,
  ]
    .filter(Boolean)
    .join(' ')

  // Props comuns
  const commonProps = {
    className: menuItemClasses,
    onClick: handleClick,
    disabled,
    'aria-pressed': active,
    'aria-disabled': disabled,
    'aria-invalid': hasErrors,
    title: hasErrors ? errorMessages : undefined,
  }

  const displayText = iconOnly ? null : children || text

  // Verifica se o item está ativo baseado na rota atual
  const isRouteActive =
    to &&
    (window.location.pathname === to ||
      (to !== '/' && window.location.pathname.startsWith(to)))

  // Renderização condicional baseada no tipo
  if (to) {
    return (
      <Link
        to={to}
        {...commonProps}
        className={`${menuItemClasses} ${isRouteActive ? 'bg-brand-pink text-brand-white scale-105' : ''}`}
      >
        {renderIcon()}
        {displayText}
      </Link>
    )
  }

  // Button padrão
  return (
    <button {...commonProps}>
      {renderIcon()}
      {displayText}
    </button>
  )
}
