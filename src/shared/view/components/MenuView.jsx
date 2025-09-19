import { MenuItemView } from './MenuItemView'
import { LogoView } from './LogoView'
import { House, User, Search, Settings } from 'lucide-react'
import { useMenuViewModel } from '../../viewmodel/components/MenuViewModel'

// Mapeamento de ícones
const iconMap = {
  House,
  User,
  Search,
  Settings,
}

export function MenuView() {
  // Usar o hook do ViewModel
  const { menuItems, userActions, isLoading, handleItemClick, isItemActive } =
    useMenuViewModel()

  const renderMenuItem = item => {
    const Icon = iconMap[item.icon]

    return (
      <MenuItemView
        key={item.id}
        variant={item.variant}
        shape={item.shape}
        active={isItemActive(item.id)}
        disabled={isLoading}
        onClick={() => handleItemClick(item.id, item.route)}
        className={item.shape === 'circle' ? '' : 'h-full'}
      >
        {item.label}
        {Icon && <Icon className='h-4 w-4' />}
      </MenuItemView>
    )
  }

  return (
    <>
      {/* Menu */}
      <div className='px-section-x bg-surface-primary flex h-fit items-center justify-between py-6'>
        {/* Logo */}
        <LogoView size='40' className='fill-brand-primary' />

        {/* Menu Principal */}
        <div className='flex h-full items-center gap-5'>
          {menuItems.map(renderMenuItem)}
        </div>

        {/* Ações do Usuário */}
        <div className='flex h-full items-center gap-2'>
          {userActions.map(renderMenuItem)}
        </div>
      </div>
    </>
  )
}
