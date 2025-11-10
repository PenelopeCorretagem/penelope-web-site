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
  className = '',
  variant = 'navigation',
  hideLogo = false,
}) {
  const viewModel = useNavMenuViewModel(isAuthenticated)

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
        onClick={viewModel.handleItemClick}
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
        onClick={action.isLogoutAction ? viewModel.handleLogout : viewModel.handleItemClick}
        title={action.label}
      >
        {renderIcon(action.icon)}
      </ButtonView>
    )
  }

  const renderFooterSection = (sectionName, items) => (
    <div key={sectionName} className={viewModel.getFooterSectionClasses()}>
      <HeadingView level={6} className='text-distac-primary font-extrabold'>
        {getSectionTitle(sectionName)}
      </HeadingView>
      {items.map(item => (
        <Link
          key={item.id}
          to={item.disabled ? '#' : item.to}
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
        </Link>
      ))}
    </div>
  )

  const getSectionTitle = (sectionName) => {
    const titles = {
      geral: 'Geral',
      vendas: 'Vendas',
      acesso: 'Acesso',
      contatos: 'Contatos'
    }
    return titles[sectionName] || sectionName
  }

  // Footer variant
  if (variant === 'footer') {
    return (
      <div className={viewModel.getFooterClasses()}>
        <div className='flex flex-col items-center md:items-start justify-between h-24'>
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
      <button
        onClick={viewModel.toggleMobileMenu}
        className={`${viewModel.getHamburgerClasses()} lg:hidden`}
        aria-label='Toggle menu'
      >
        {viewModel.isMobileMenuOpen ? <X /> : <Menu />}
      </button>
      {!hideLogo && (
        <Link
          to='/'
          className={`inline-block transform transition-all duration-500 ease-in-out hover:scale-110 ${
            hideLogo ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
          }`}
        >
          <LogoView height={'40'} className='text-distac-primary fill-current' />
        </Link>
      )}

      <div className={viewModel.getMenuItemsClasses(viewModel.isMobileMenuOpen)}>
        {viewModel.menuItems.map(renderMenuItem)}
      </div>

      {!isAuthenticated && (
        <div className={viewModel.getUserActionsClasses(viewModel.isMobileMenuOpen)}>
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
