import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, LogOut } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { LogoView } from '@shared/components/ui/Logo/LogoView'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { UserInfoView } from '../../ui/UserInfo/UserInfoView'
import { useSidebarViewModel } from './useSidebarViewModel'

/**
 * SidebarView - Componente de apresentação do menu lateral
 */
export function SidebarView({ isAdmin = false, initialOpen = false }) {
  const viewModel = useSidebarViewModel(isAdmin, initialOpen)

  const renderIcon = (iconName) => {
    const Icon = LucideIcons[iconName]
    return Icon ? <Icon size={20} /> : null
  }

  const renderMenuItem = (item) => {
    const hasChildren = Array.isArray(item.children) && item.children.length > 0
    const isActive = viewModel.isRouteActive(item.path) || (hasChildren && item.children.some(child => viewModel.isRouteActive(child.path)))
    const isExpanded = Boolean(viewModel.expandedMenus[item.id])

    return (
      <li key={item.id} className="w-full">
        {/* ITEM PAI */}
        <button
          onClick={() => viewModel.handleItemClick(item)}
          className={`flex w-full items-center justify-between px-6 py-3 transition-all duration-500 ease-in-out overflow-hidden cursor-pointer ${
            isActive
              ? 'bg-default-light text-distac-secondary border-l-5 border-distac-primary'
              : 'hover:bg-default-light-muted hover:text-distac-secondary text-default-light border-l-5 border-transparent'
          } ${!viewModel.isOpen ? 'justify-center' : ''}`}
          title={!viewModel.isOpen ? item.text : ''}
        >
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 transition-transform duration-500">
              {renderIcon(item.icon)}
            </div>
            <div
              className={`transition-all duration-500 ease-in-out ${
                viewModel.isOpen
                  ? 'opacity-100 w-auto translate-x-0'
                  : 'opacity-0 w-0 -translate-x-4'
              }`}
            >
              {viewModel.isOpen && (
                <HeadingView level={6} className="text-sm font-medium whitespace-nowrap">
                  {item.text}
                </HeadingView>
              )}
            </div>
          </div>

          {/* SETA (CHEVRON) - Herda a cor do botão automaticamente */}
          {viewModel.isOpen && hasChildren && (
            <div className="flex items-center gap-1 transition-all duration-300">
              {isExpanded ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </div>
          )}
        </button>

        {/* SUBMENUS */}
        {hasChildren && viewModel.isOpen && isExpanded && (
          <ul className="mt-1 space-y-1 border-l border-default-light/10">
            {item.children.map((child) => {
              const isChildActive = viewModel.isRouteActive(child.path)
              return (
                <li key={child.id}>
                  <button
                    onClick={() => viewModel.navigateTo(child.path)}
                    className={`flex w-full items-center px-10 py-2 transition-all duration-500 ease-in-out overflow-hidden cursor-pointer rounded-r-lg ${
                      isChildActive
                        ? 'bg-default-light text-distac-secondary border-l-10 border-distac-primary'
                        : 'text-default-light hover:bg-default-light-muted hover:text-distac-secondary border-l-10 border-transparent'
                    }`}
                    title={child.text}
                  >
                    <div className="flex-shrink-0 transition-transform duration-500 opacity-80">
                      {renderIcon(child.icon)}
                    </div>
                    {/* Texto também herda a cor do hover/active pelo currentColor */}
                    <HeadingView level={6} className="ml-3 text-sm font-medium whitespace-nowrap">
                      {child.text}
                    </HeadingView>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </li>
    )
  }

  return (
    <div className="relative overflow-visible transition-all duration-500 ease-in-out">
      <aside
        className={`h-screen bg-distac-secondary text-default-light transition-all duration-500 ease-in-out shadow-lg shadow-default-dark sticky top-0 right-0 flex flex-col overflow-visible z-[9999] ${
          viewModel.isOpen ? 'w-80' : 'w-20'
        }`}
      >
        {/* Logo Header with Floating Toggle Button */}
        <div
          className={`relative flex items-center border-b border-default-light px-6 h-24 z-30 transition-all ease-in-out duration-500 overflow-visible ${
            viewModel.isOpen ? 'justify-start' : 'justify-center'
          }`}
        >
          {viewModel.isOpen ? (
            <LogoView
              height='40'
              className='text-default-light fill-current'
              linkTo={viewModel.homeRoute}
              linkClassName='inline-block transform transition-all duration-500 hover:scale-110 flex-shrink-0'
              linkTitle='Ir para a página inicial'
              linkAriaLabel='Ir para a página inicial'
            />
          ) : (
            <LogoView
              variant="mark"
              height='40'
              className='text-default-light fill-current'
              linkTo={viewModel.homeRoute}
              linkClassName='inline-block transform transition-all duration-500 hover:scale-110 flex-shrink-0'
              linkTitle='Ir para a página inicial'
              linkAriaLabel='Ir para a página inicial'
            />
          )}

          {/* Floating Toggle Button */}
          <button
            onClick={viewModel.toggleSidebar}
            className={`absolute transition-all duration-500 cursor-pointer flex-shrink-0 -right-5 bg-distac-primary border-2 border-distac-primary rounded-full p-2 shadow-lg hover:shadow-xl transform hover:scale-110 top-1/2 -translate-y-1/2`}
            aria-label={viewModel.isOpen ? 'Fechar menu' : 'Abrir menu'}
            title={viewModel.isOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            <div className="transition-transform duration-500 flex items-center justify-center">
              {viewModel.isOpen ? (
                <ChevronLeft size={20} className="text-default-light" />
              ) : (
                <ChevronRight size={20} className="text-default-light" />
              )}
            </div>
          </button>
        </div>

        {/* User Info Section */}
        <UserInfoView
          email={viewModel.userEmail}
          role={viewModel.userRole}
          isOpen={viewModel.isOpen}
        />

        {/* Menu Items */}
        <nav className="py-4 flex-1 overflow-y-auto">
          <ul className="space-y-1">
            {viewModel.menuItems.map(renderMenuItem)}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="border-t border-default-light p-4">
          <button
            onClick={viewModel.handleLogout}
            className={`flex w-full items-center px-6 py-3 transition-all duration-500 ease-in-out overflow-hidden cursor-pointer hover:bg-default-light text-default-light hover:text-default-dark border-l-4 border-transparent hover:border-distac-primary rounded-sm ${
              !viewModel.isOpen ? 'justify-center' : ''
            }`}
            title={!viewModel.isOpen ? 'Sair' : ''}
          >
            <div className="flex-shrink-0 transition-transform duration-500">
              <LogOut size={20} />
            </div>
            <div
              className={`ml-3 transition-all duration-500 ease-in-out ${
                viewModel.isOpen
                  ? 'opacity-100 w-auto translate-x-0'
                  : 'opacity-0 w-0 -translate-x-4'
              }`}
            >
              {viewModel.isOpen && (
                <HeadingView level={6} className="text-sm font-medium whitespace-nowrap">
                  Sair
                </HeadingView>
              )}
            </div>
          </button>
        </div>
      </aside>
    </div>
  )
}
