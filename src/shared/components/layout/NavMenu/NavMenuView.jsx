// modules/institutional/components/NavMenuView.jsx
import { NavItemView } from '@shared/components/ui/NavItem/NavItemView'
import { ErrorDisplayView } from '@shared/components/feedback/ErrorDisplay/ErrorDisplayView'
import { LogoView } from '@shared/components/ui/Logo/LogoView'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { useNavMenuViewModel } from '@shared/components/layout/NavMenu/useNavMenuViewModel'
import { Menu, X } from 'lucide-react'

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
    handleItemClick,
    logout,
    isMobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,
    footerSections,
    getMenuContainerClasses,
    getMenuItemsClasses,
    getUserActionsClasses,
    getHamburgerClasses,
    getFooterClasses,
    getFooterSectionClasses,
    getFooterLinkClasses,
  } = useNavMenuViewModel(isAuthenticated)

  // Footer variant
  if (variant === 'footer') {
    const footerClasses = getFooterClasses()
    const sectionClasses = getFooterSectionClasses()

    return (
      <div className={footerClasses}>
        <div className='flex flex-col items-center md:items-start justify-between h-24'>
          <LogoView size={logoSize} colorScheme={logoColorScheme} />
          <HeadingView level={4} className='text-center text-brand-pink md:text-start'>
            seu sonho começa com uma chave
          </HeadingView>
        </div>

        {Object.entries(footerSections).map(([sectionName, items]) => (
          <div key={sectionName} className={sectionClasses}>
            <HeadingView level={6} className='text-brand-pink font-extrabold'>
              {sectionName === 'geral' ? 'Geral' :
                sectionName === 'vendas' ? 'Vendas' :
                  sectionName === 'acesso' ? 'Acesso' :
                    sectionName === 'contatos' ? 'Contatos' : sectionName}
            </HeadingView>
            {items.map(item => {
              const linkClasses = getFooterLinkClasses(item.disabled)
              return (
                <a
                  key={item.id}
                  href={item.disabled ? undefined : item.to}
                  onClick={item.disabled ? undefined : item.onClick}
                  className={linkClasses}
                >
                  <HeadingView
                    level={6}
                    className={item.disabled ? 'text-gray-500' : 'text-brand-black'}
                  >
                    {item.text}
                  </HeadingView>
                </a>
              )
            })}
          </div>
        ))}
      </div>
    )
  }

  // Navigation variant - VOLTA PARA A LÓGICA QUE FUNCIONAVA
  const menuContainerClasses = getMenuContainerClasses(className)
  const menuItemsClasses = getMenuItemsClasses(isMobileMenuOpen)
  const userActionsClasses = getUserActionsClasses(isMobileMenuOpen)
  const hamburgerClasses = getHamburgerClasses()

  return (
    <nav className={menuContainerClasses}>
      <button
        onClick={toggleMobileMenu}
        className={`${hamburgerClasses} lg:hidden`}
        aria-label='Toggle menu'
      >
        {isMobileMenuOpen ? <X /> : <Menu />}
      </button>

      <div className={menuItemsClasses}>
        {menuItems.map(item => {
          return (
            <NavItemView
              key={item.id}
              text={item.label}
              variant={item.variant}
              to={item.route}
              disabled={item.requiresAuth && !isAuthenticated}
              icon={item.icon}
              iconOnly={item.iconOnly}
              width='fit'
              shape='square'
              onClick={() => {
                handleItemClick()
                closeMobileMenu()
              }}
              className={`transition-all duration-200 ${
                item.requiresAuth && !isAuthenticated ? 'opacity-50' : ''
              } ${isMobileMenuOpen ? 'w-full justify-center py-2' : ''}`}
            />
          )
        })}
      </div>

      <div className={userActionsClasses}>
        {userActions.map(action => {
          return (
            <NavItemView
              key={action.id}
              text={action.label || ''}
              variant={action.variant}
              to={action.route}
              icon={action.icon}
              iconOnly={action.iconOnly}
              disabled={action.requiresAuth && !isAuthenticated}
              width='fit'
              shape={action.shape || 'square'}
              onClick={() => {
                if (action.id === 'logout') {
                  logout()
                } else {
                  handleItemClick()
                }
                closeMobileMenu()
              }}
              className={`transition-all duration-200 ${
                action.shape === 'circle' ? 'p-2' : ''
              } ${isMobileMenuOpen ? 'w-full justify-center py-2' : ''}`}
              title={action.label}
            />
          )
        })}
      </div>

      <ErrorDisplayView
        messages={[]}
        position='top'
        variant='subtle'
        className='z-50'
      />
    </nav>
  )
}
