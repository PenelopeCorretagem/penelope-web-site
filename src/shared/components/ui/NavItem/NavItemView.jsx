import { Link, useLocation } from 'react-router-dom'
import { useNavItemFactory } from '@shared/components/ui/NavItem/useNavItemViewModel'
import { getNavMenuItemThemeClasses, getNavMenuActionThemeClasses } from '@shared/styles/theme'
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
  isMobileMenuOpen = false,
  requiresAuth = false,
  isAuthenticated = true,
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

  // Usa as classes do tema baseado no tipo de componente
  const getThemeClasses = () => {
    if (shape === 'circle') {
      return getNavMenuActionThemeClasses({
        shape,
        requiresAuth,
        isAuthenticated,
        isMobileMenuOpen,
        variant: viewVariant,
        className
      })
    }

    return getNavMenuItemThemeClasses({
      isActive,
      requiresAuth,
      isAuthenticated,
      isMobileMenuOpen,
      variant: viewVariant,
      className
    })
  }

  // Classes adicionais para estado
  const getStateClasses = () => {
    const classes = []

    if (hasErrors) classes.push('border-2 border-red-500')
    if (viewDisabled || !canClick) classes.push('opacity-50 pointer-events-none')
    if (width === 'full') classes.push('w-full')

    return classes.join(' ')
  }

  const finalClasses = `${getThemeClasses()} ${getStateClasses()}`.trim()
  const displayText = viewIconOnly ? null : children || viewText

  // Handler que respeita canClick
  const handleItemClick = (event) => {
    if (!canClick) {
      event.preventDefault()
      return
    }
    handleClick(event)
  }

  // Renderização condicional baseada no tipo
  if (viewTo) {
    return (
      <Link
        to={viewTo}
        className={finalClasses}
        onClick={handleItemClick}
        aria-pressed={isActive}
        aria-disabled={viewDisabled || !canClick}
        aria-invalid={hasErrors}
        title={hasErrors ? errorMessages : undefined}
        tabIndex={canClick ? 0 : -1}
      >
        {renderIcon()}
        {displayText}
      </Link>
    )
  }

  // Button padrão
  return (
    <button
      className={finalClasses}
      onClick={handleItemClick}
      disabled={viewDisabled || !canClick}
      aria-pressed={isActive}
      aria-disabled={viewDisabled || !canClick}
      aria-invalid={hasErrors}
      title={hasErrors ? errorMessages : undefined}
      tabIndex={canClick ? 0 : -1}
    >
      {renderIcon()}
      {displayText}
    </button>
  )
}
