import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { ErrorDisplayView } from '@shared/components/feedback/ErrorDisplay/ErrorDisplayView'
import { LogoView } from '@shared/components/ui/Logo/LogoView'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { useNavMenuViewModel } from '@shared/components/layout/NavMenu/useNavMenuViewModel'
import { Menu, X } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { Link } from 'react-router-dom'

/**
 * NavMenuView component is responsible for rendering the navigation and footer menus
 * of the Penélope application, adapting its layout and content based on authentication state
 * and variant ("navigation" or "footer").
 *
 * It follows the MVVM pattern, using the `useNavMenuViewModel` hook to manage all
 * business logic, routes, authentication checks, and state control.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {boolean} [props.isAuthenticated=false] - Defines if the current user is authenticated.
 * @param {string} [props.className=''] - Custom Tailwind CSS classes for layout and style adjustments.
 * @param {'navigation' | 'footer'} [props.variant='navigation'] - Determines whether the component renders the main navigation bar or the footer menu.
 *
 * @example
 * // Example 1: Standard navigation bar
 * <NavMenuView isAuthenticated={true} variant="navigation" />
 *
 * @example
 * // Example 2: Footer variant with grouped links
 * <NavMenuView variant="footer" />
 *
 * @description
 * The `NavMenuView` dynamically builds two types of menu structures:
 *
 * - **Navigation Variant:** Displays the top navigation bar with brand logo,
 *   navigation links, and user action buttons (login, profile, logout, etc.).
 *   Includes mobile responsiveness and a collapsible menu controlled by state.
 *
 * - **Footer Variant:** Renders a structured footer with grouped sections
 *   (“Geral”, “Vendas”, “Acesso”, “Contatos”) and a brand message.
 *   Each group displays relevant links, adjusted according to the user's
 *   authentication status.
 *
 * Internally, the component:
 * - Uses `ButtonView`, `HeadingView`, and `LogoView` for consistent UI structure.
 * - Leverages `useNavMenuViewModel` for logic abstraction (state, routes, active states, and actions).
 * - Imports and renders icons dynamically from `lucide-react` using the `renderIcon` helper.
 * - Uses `ErrorDisplayView` to handle and display potential feedback or navigation errors.
 *
 * Accessibility:
 * - Provides appropriate ARIA labels for mobile toggle buttons.
 * - Hides or disables items based on authentication requirements.
 *
 * Responsive Behavior:
 * - On large screens, displays horizontal navigation with labeled buttons.
 * - On small screens, switches to a toggleable mobile menu with icons.
 */
export function NavMenuView({
  isAuthenticated = false,
  isAdmin = false,
  className = '',
  variant = 'navigation',
  hideLogo = false,
}) {
  const viewModel = useNavMenuViewModel(isAuthenticated, isAdmin)

  // Render helpers
  const renderIcon = (iconName) => {
    if (!iconName) return null
    const Icon = LucideIcons[iconName]
    return Icon ? <Icon className='h-3 w-3 lg:h-4 lg:w-4' /> : null
  }

  const renderMenuItem = (item) => {
    const isActive = viewModel.isItemActive(item.route)
    const isDisabled = item.requiresAuth && !viewModel.isAuthenticated

    if (isDisabled) {
      return (
        <span
          key={item.id}
          className="px-4 py-2 text-default-dark cursor-not-allowed opacity-50 flex items-center gap-2"
        >
          {renderIcon(item.icon)}
          <span className="hidden lg:inline">{item.label}</span>
        </span>
      )
    }

    return (
      <Link
        key={item.id}
        to={item.route}
        onClick={() => viewModel.handleItemClick(item.route)}
        className={`px-4 py-2 transition-all duration-200 flex items-center gap-2 uppercase text-base md:text-lg ${
          isActive
            ? 'text-distac-primary underline underline-offset-4 decoration-2'
            : 'text-default-dark hover:text-distac-primary'
        }`}
      >
        {renderIcon(item.icon)}
        {item.label}
      </Link>
    )
  }

  const renderUserAction = (action) => {
    const isActive = action.isLogoutAction ? false : viewModel.isItemActive(action.route)

    return (
      <ButtonView
        key={action.id}
        color='brown'
        type={action.isLogoutAction ? 'button' : 'link'}
        to={action.isLogoutAction ? undefined : action.route}
        width='fit'
        shape='circle'
        disabled={action.requiresAuth && !viewModel.isAuthenticated}
        active={isActive}
        onClick={action.isLogoutAction ? viewModel.handleLogout : () => viewModel.handleItemClick(action.route)}
        title={action.label}
      >
        {renderIcon(action.icon)}
      </ButtonView>
    )
  }

  const renderFooterSection = (sectionName, items) => (
    <div
      key={sectionName}
      className={`${viewModel.getFooterSectionClasses()} ${viewModel.getFooterSectionMobileOrder(sectionName)}`}
    >
      <HeadingView level={6} className='text-distac-primary font-extrabold'>
        {viewModel.getSectionTitle(sectionName)}
      </HeadingView>

      {items.map(item => (
        item.openInNewTab ? (
          <a
            key={item.id}
            href={item.disabled ? '#' : item.to}
            target='_blank'
            rel='noopener noreferrer'
            onClick={(e) => {
              if (item.disabled) {
                e.preventDefault()
                return
              }
              item.onClick?.()
            }}
            className={viewModel.getFooterLinkClasses(item.disabled)}
          >
            <HeadingView level={6}>
              {item.text}
            </HeadingView>
          </a>
        ) : (
          <Link
            key={item.id}
            to={item.disabled ? '#' : item.to}
            onClick={(e) => {
              if (item.disabled) {
                e.preventDefault()
                return
              }
              viewModel.handleItemClick(item.to)
              item.onClick?.()
            }}
            className={viewModel.getFooterLinkClasses(item.disabled)}
          >
            <HeadingView level={6}>
              {item.text}
            </HeadingView>
          </Link>
        )
      ))}
    </div>
  )

  // Footer variant
  if (variant === 'footer') {
    return (
      <div className={viewModel.getFooterClasses()}>
        <div className='flex flex-col items-center md:items-start justify-between h-24 col-span-2 md:col-span-1'>
          <LogoView hasHoverEffect={true} />
          <HeadingView level={4} className='text-center text-distac-primary md:text-start'>
            Seu sonho começa com uma chave
          </HeadingView>
        </div>

        {Object.entries(viewModel.footerSections).map(([sectionName, items]) =>
          renderFooterSection(sectionName, items)
        )}
      </div>
    )
  }

  // Navigation variant
  return (
    <nav className={viewModel.getMenuContainerClasses(className)}>
      {/* Mobile: header com logo e hamburger (escondido em md+) */}
      <div
        className="flex items-center w-full justify-between md:hidden"
        style={{ paddingLeft: '2px', paddingRight: '2px', paddingTop: '0.5rem', paddingBottom: '0.5rem' }}
      >
        <Link
          to='/'
          className='inline-block transform transition-all duration-500 ease-in-out hover:scale-110 opacity-100'
          style={{marginLeft: 0, padding: 0}}
        >
          <LogoView height={'40'} className='text-distac-primary fill-current' />
        </Link>
        <button
          onClick={viewModel.toggleMobileMenu}
          className={viewModel.getHamburgerClasses()}
          aria-label={viewModel.isMobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
          style={{marginRight: 0, padding: 0}}
        >
          {viewModel.isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile: dropdown do menu (escondido em md+, via tema) */}
      {viewModel.isMobileMenuOpen && (
        <div className={viewModel.getMenuItemsClasses(true) + ' items-center text-center'}>
          {viewModel.menuItems.filter(item => !item.mobileOnly).map(renderMenuItem)}
          {!isAuthenticated && (
            <Link
              to={viewModel.userActions.find(action => action.id === 'login' || action.route === '/login')?.route || '/login'}
              onClick={viewModel.handleItemClick}
              className="px-4 py-2 transition-all duration-200 flex items-center gap-2 uppercase text-base text-default-dark hover:text-distac-primary mt-2 justify-center"
            >
              {renderIcon('User')}
              <span>Acessar</span>
            </Link>
          )}
          {isAuthenticated && (
            <>
              <div className="w-3/4 h-px bg-default-dark-muted/30 my-2" />
              {viewModel.menuItems.filter(item => item.mobileOnly).map(renderMenuItem)}
              <div className="w-3/4 h-px bg-default-dark-muted/30 my-2" />
              <button
                onClick={() => { viewModel.handleLogout(); viewModel.closeMobileMenu(); }}
                className="px-4 py-2 transition-all duration-200 flex items-center gap-2 uppercase text-base text-default-dark hover:text-distac-primary justify-center"
              >
                {renderIcon('LogOut')}
                <span>Sair</span>
              </button>
            </>
          )}
        </div>
      )}

      {/* Desktop: logo (escondida no mobile) */}
      {!hideLogo && (
        <button
          onClick={() => viewModel.handleItemClick('/')}
          className={`hidden md:inline-block transform transition-all duration-500 ease-in-out hover:scale-110 ${
            hideLogo ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
          } bg-transparent border-none cursor-pointer p-0`}
        >
          <LogoView height={'40'} className='text-distac-primary fill-current' />
        </button>
      )}

      {/* Desktop: itens do menu (hidden md:flex via tema) */}
      <div className={viewModel.getMenuItemsClasses(false)}>
        {viewModel.menuItems.filter(item => !item.mobileOnly).map(renderMenuItem)}
      </div>

      {/* Desktop: botão de usuário (hidden md:flex via tema) */}
      {!isAuthenticated && (
        <div className={viewModel.getUserActionsClasses(false)}>
          {viewModel.userActions
            .filter(action => action.id === 'login' || action.route === '/login')
            .map(renderUserAction)
          }
        </div>
      )}

      <ErrorDisplayView
        messages={[]}
        position='top'
        variant='subtle'
        className='z-50'
      />
    </nav>
  )
}
