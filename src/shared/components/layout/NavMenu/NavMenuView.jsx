// modules/institutional/components/NavMenuView.jsx
import { NavItemView } from '@shared/components/ui/NavItem/NavItemView'
import { ErrorDisplayView } from '@shared/components/feedback/ErrorDisplay/ErrorDisplayView'
import { LogoView } from '@shared/components/ui/Logo/LogoView'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { useNavMenuViewModel } from '@shared/components/layout/NavMenu/useNavMenuViewModel'
import { Menu, X } from 'lucide-react'

/**
 * NavMenuView - Componente de menu principal
 * Renderiza navegação principal e ações do usuário
 * Integra com NavMenuViewModel para gerenciar estado
 * @param {boolean} isAuthenticated - Estado de autenticação do usuário
 * @param {string} variant - Variante do menu ('navigation' | 'footer')
 * @param {number} logoSize - Tamanho do logo (apenas para variant footer)
 * @param {string} logoColorScheme - Esquema de cores do logo (apenas para variant footer)
 */

export function NavMenuView({
  isAuthenticated = false,
  className = '',
  variant = 'navigation',
  logoSize = 40,
  logoColorScheme = 'pink'
}) {
  const {
    menuItems,
    userActions,
    hasErrors,
    errorMessages,
    handleItemClick,
    logout,
    isItemActive,
    isMobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,
    footerSections,
  } = useNavMenuViewModel(isAuthenticated, variant)

  const getMenuContainerClasses = () =>
    ['flex items-center justify-end md:justify-between', 'w-full h-fit'].join(
      ' '
    )

  const getMenuItemsContainerClasses = () =>
    [
      'items-center gap-2',
      'flex-1 justify-center',
      'hidden md:flex', // Esconde em mobile (<768px) e mostra em md e acima
      isMobileMenuOpen &&
        'md:hidden flex absolute top-full left-0 right-0 flex-col bg-white shadow-lg p-4 z-50',
    ]
      .filter(Boolean)
      .join(' ')

  const getUserActionsContainerClasses = () =>
    [
      'items-center gap-2',
      'w-fit',
      'hidden md:flex', // Esconde em mobile (<768px) e mostra em md e acima
      isMobileMenuOpen &&
        'md:hidden flex absolute top-[calc(100%+var(--menu-items-height))] left-0 right-0 justify-center bg-white shadow-lg p-4 z-50',
    ]
      .filter(Boolean)
      .join(' ')

  const getHamburgerButtonClasses = () =>
    [
      'hidden max-md:flex', // Escondido por padrão, mas mostra apenas em telas < md (768px)
      'items-center justify-center',
      'w-10 h-10',
      'text-2xl',
      'cursor-pointer',
      'transition-colors duration-200',
      'hover:text-primary-600',
    ].join(' ')

  const handleMenuItemClick = item => {
    handleItemClick(item.id)
  }

  const handleUserActionClick = action => {
    // Handle special actions
    if (action.id === 'logout') {
      logout() // NavMenuViewModel vai cuidar do redirecionamento e recarregamento
    } else if (action.id === 'login') {
      // For login, you might want to trigger a login modal or navigate to login page
      // For now, let's just handle it like a regular navigation
      handleItemClick(action.id)
    } else {
      handleItemClick(action.id)
    }
  }

  const menuContainerClasses = [
    getMenuContainerClasses(),
    hasErrors ? 'border-b-2 border-red-500' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  // Renderização condicional baseada na variant
  if (variant === 'footer') {
    return (

      <div className='flex flex-col md:flex-row  items-center md:items-start justify-between w-full h-fit gap-subsection md-gap-0'>
        <div className='flex flex-col items-center md:items-start justify-between h-24'>
          <LogoView
            size={logoSize}
            colorScheme={logoColorScheme}
          />
          <HeadingView level={4} className='text-center text-brand-pink md:text-start'>seu sonho começa com uma chave</HeadingView>
        </div>
        <div className='flex flex-col items-center md:items-start gap-2'>
          <HeadingView level={6} className='text-brand-pink font-extrabold'>Geral</HeadingView>
          {footerSections.geral.map(item => (
            <a
              key={item.id}
              href={item.to}
              onClick={item.onClick}
              className="hover:text-brand-pink hover:underline transition-colors duration-200 uppercase cursor-pointer"
            >
              <HeadingView level={6} className='text-brand-black'>
                {item.text}
              </HeadingView>
            </a>
          ))}
        </div>
        <div className='flex flex-col items-center md:items-start gap-2'>
          <HeadingView level={6} className='text-brand-pink font-extrabold'>Vendas</HeadingView>
          {footerSections.vendas.map(item => (
            <a
              key={item.id}
              href={item.disabled ? undefined : item.to}
              onClick={item.disabled ? undefined : item.onClick}
              className={`transition-colors duration-200 uppercase ${
                item.disabled
                  ? 'cursor-not-allowed opacity-50'
                  : 'hover:text-brand-pink hover:underline cursor-pointer'
              }`}
            >
              <HeadingView
                level={6}
                className={item.disabled ? 'text-gray-500' : 'text-brand-black'}
              >
                {item.text}
              </HeadingView>
            </a>
          ))}
        </div>
        <div className='flex flex-col items-center md:items-start gap-2'>
          <HeadingView level={6} className='text-brand-pink font-extrabold'>Acesso</HeadingView>
          {footerSections.acesso.map(item => (
            <a
              key={item.id}
              href={item.to}
              onClick={item.onClick}
              className="hover:text-brand-pink hover:underline transition-colors duration-200 uppercase cursor-pointer"
            >
              <HeadingView level={6} className='text-brand-black'>
                {item.text}
              </HeadingView>
            </a>
          ))}
        </div>
        <div className='flex flex-col items-center md:items-start gap-2'>
          <HeadingView level={6} className='text-brand-pink font-extrabold'>Contatos</HeadingView>
          {footerSections.contatos.map(item => (
            <a
              key={item.id}
              href={item.to}
              onClick={item.onClick}
              className="hover:text-brand-pink hover:underline transition-colors duration-200 uppercase cursor-pointer"
            >
              <HeadingView level={6} className='text-brand-black'>
                {item.text}
              </HeadingView>
            </a>
          ))}
        </div>
      </div>

    )
  }

  return (
    <nav className={menuContainerClasses}>
      <button
        onClick={toggleMobileMenu}
        className={getHamburgerButtonClasses()}
        aria-label='Toggle menu'
      >
        {isMobileMenuOpen ? <X /> : <Menu />}
      </button>

      <div className={getMenuItemsContainerClasses()}>
        {menuItems.map(item => {
          const isActive =
            window.location.pathname === item.route ||
            (item.route !== '/' &&
              window.location.pathname.startsWith(item.route))

          return (
            <NavItemView
              key={item.id}
              text={item.label}
              variant={item.variant}
              initialActive={isActive}
              to={item.route}
              disabled={item.requiresAuth && !isAuthenticated}
              icon={item.icon}
              iconOnly={item.iconOnly}
              onClick={() => {
                handleMenuItemClick(item)
                closeMobileMenu()
              }}
              className={`transition-all duration-200 ${
                item.requiresAuth && !isAuthenticated ? 'opacity-50' : ''
              } ${isMobileMenuOpen ? 'w-full justify-center py-2' : ''}`}
            />
          )
        })}
      </div>

      <div className={getUserActionsContainerClasses()}>
        {userActions.map(action => {
          return (
            <NavItemView
              key={action.id}
              text={action.label || ''}
              variant={action.variant}
              initialActive={isItemActive(action.id)}
              to={action.route}
              icon={action.icon}
              iconOnly={action.iconOnly}
              disabled={action.requiresAuth && !isAuthenticated}
              onClick={() => {
                handleUserActionClick(action)
                closeMobileMenu()
              }}
              width='fit'
              shape={action.shape || 'square'}
              className={`transition-all duration-200 ${
                action.shape === 'circle' ? 'p-2' : ''
              } ${isMobileMenuOpen ? 'w-full justify-center py-2' : ''}`}
              title={action.label}
            />
          )
        })}
      </div>

      <ErrorDisplayView
        messages={errorMessages ? [errorMessages] : []}
        position='top'
        variant='subtle'
        className='z-50'
      />
    </nav>
  )
}
