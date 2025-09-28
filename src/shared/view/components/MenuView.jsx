// modules/institutional/components/MenuView.jsx
import { MenuItemView } from '@shared/view/components/MenuItemView'
import { MenuItemModel } from '@shared/model/components/MenuItemModel'
import { ErrorDisplayView } from '@shared/view/components/ErrorDisplayView'
import { useMenuViewModel } from '@shared/hooks/components/useMenuViewModel'

/**
 * MenuView - Componente de menu principal
 * Renderiza navegação principal e ações do usuário
 * Integra com MenuViewModel para gerenciar estado
 * @param {boolean} isAuthenticated - Estado de autenticação do usuário
 */

export function MenuView({ isAuthenticated = false, className = '' }) {
  const {
    menuItems,
    userActions,
    hasErrors,
    errorMessages,
    handleItemClick,
    logout,
    isItemActive,
  } = useMenuViewModel(isAuthenticated)

  const getMenuContainerClasses = () =>
    ['flex items-center justify-between', 'w-full h-fit'].join(' ')

  const getMenuItemsContainerClasses = () =>
    ['flex items-center gap-2', 'flex-1 justify-center'].join(' ')

  const getUserActionsContainerClasses = () =>
    ['flex items-center gap-2', 'w-fit'].join(' ')

  const handleMenuItemClick = item => {
    handleItemClick(item.id)
  }

  const handleUserActionClick = action => {
    // Handle special actions
    if (action.id === 'logout') {
      logout() // MenuViewModel vai cuidar do redirecionamento e recarregamento
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

  return (
    <nav className={menuContainerClasses}>
      <div className={getMenuItemsContainerClasses()}>
        {menuItems.map(item => {
          const isActive =
            window.location.pathname === item.route ||
            (item.route !== '/' &&
              window.location.pathname.startsWith(item.route))

          return (
            <MenuItemView
              key={item.id}
              model={
                new MenuItemModel({
                  text: item.label,
                  variant: item.variant,
                  active: isActive,
                  to: item.route,
                  disabled: item.requiresAuth && !isAuthenticated,
                  icon: item.icon,
                  iconOnly: item.iconOnly,
                })
              }
              onClick={() => handleMenuItemClick(item)}
              className={`transition-all duration-200 ${
                item.requiresAuth && !isAuthenticated ? 'opacity-50' : ''
              }`}
            />
          )
        })}
      </div>

      <div className={getUserActionsContainerClasses()}>
        {userActions.map(action => {
          return (
            <MenuItemView
              key={action.id}
              model={
                new MenuItemModel({
                  text: action.label || '',
                  variant: action.variant,
                  active: isItemActive(action.id),
                  to: action.route,
                  icon: action.icon,
                  iconOnly: action.iconOnly,
                  disabled: action.requiresAuth && !isAuthenticated,
                })
              }
              onClick={() => handleUserActionClick(action)}
              width='fit'
              shape={action.shape || 'square'}
              className={`transition-all duration-200 ${action.shape === 'circle' ? 'p-2' : ''} `}
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
