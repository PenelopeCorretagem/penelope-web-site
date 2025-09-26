// modules/institutional/components/MenuView.jsx
import { MenuItemView } from './MenuItemView'
import { LogoView } from './LogoView'
import { LogoModel } from '../../model/components/LogoModel'
import { House, User, Search, Settings } from 'lucide-react'
import { useMenuViewModel } from '../../hooks/components/useMenuViewModel'

const iconMap = {
  House,
  User,
  Search,
  Settings,
}

/**
 * MenuView - Componente de menu principal
 * Renderiza navegação principal e ações do usuário
 * Integra com MenuViewModel para gerenciar estado
 * @param {boolean} isAuthenticated - Estado de autenticação do usuário
 */
export function MenuView({ isAuthenticated = false }) {
  const {
    menuItems,
    userActions,
    isLoading,
    handleItemClick,
    isItemActive,
    setAuthentication,
    isAuthenticated: currentAuth,
  } = useMenuViewModel(isAuthenticated)

  if (isAuthenticated !== currentAuth) {
    setAuthentication(isAuthenticated)
  }

  const renderMenuItem = item => {
    const Icon = iconMap[item.icon]

    return (
      <MenuItemView
        key={item.id}
        variant={item.variant}
        shape={item.shape}
        active={isItemActive(item.id)}
        disabled={isLoading}
        onClick={() => handleItemClick(item.id)}
        className={item.shape === 'circle' ? '' : 'h-full'}
        title={item.route} // Mostra a rota no hover para debug
      >
        {item.label}
        {Icon && <Icon className='h-3 w-3 md:h-4 md:w-4' />}
      </MenuItemView>
    )
  }

  return (
    <header className='px-section-x bg-brand-white-secondary sticky top-0 z-50 flex h-fit w-full items-center justify-between py-6 drop-shadow-md'>
      <LogoView model={new LogoModel('primary', 40)} />

      <div className='flex h-full w-fit items-center gap-5'>
        {menuItems.map(renderMenuItem)}
      </div>

      <div className='flex h-full w-fit items-center gap-2'>
        {userActions.map(renderMenuItem)}
      </div>
    </header>
  )
}
