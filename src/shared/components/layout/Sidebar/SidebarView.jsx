import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { LogoView } from '@shared/components/ui/Logo/LogoView'
import { Link } from 'react-router-dom'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { UserInfoView } from '../../ui/UserInfo/UserInfoView'
import { useSidebarViewModel } from './useSidebarViewModel'
import { useEffect } from 'react'

/**
 * SidebarView - Componente de apresentação do menu lateral
 *
 * RESPONSABILIDADES:
 * - Renderizar UI do sidebar com comportamento fluido
 * - Logo dinâmica (completa/mark)
 * - Seção de usuário
 * - Botão de toggle flutuante
 * - Transições animadas
 * - Delegar ações para o ViewModel
 *
 * @param {boolean} isAdmin - Se usuário é admin
 * @param {boolean} initialOpen - Estado inicial (aberto/fechado) - padrão: false
 */
export function SidebarView({ isAdmin = false, initialOpen = false }) {
  const viewModel = useSidebarViewModel(isAdmin, initialOpen)

  // Debug: log quando isAdmin muda
  useEffect(() => {
  }, [isAdmin, viewModel.menuItems])

  const renderIcon = (iconName) => {
    const Icon = LucideIcons[iconName]
    return Icon ? <Icon size={20} /> : null
  }

  const renderMenuItem = (item) => {
    const isActive = viewModel.isRouteActive(item.path)

    return (
      <li key={item.id} className="w-full">
        <button
          onClick={() => viewModel.navigateTo(item.path)}
          className={`flex w-full items-center px-6 py-3 transition-all duration-500 ease-in-out overflow-hidden cursor-pointer ${
            isActive
              ? 'bg-default-light text-distac-secondary border-l-4 border-distac-primary'
              : 'hover:bg-default-light-muted hover:text-distac-secondary text-default-light border-l-4 border-transparent'
          } ${!viewModel.isOpen ? 'justify-center' : ''}`}
          title={!viewModel.isOpen ? item.text : ''}
        >
          <div className="flex-shrink-0 transition-transform duration-500">
            {renderIcon(item.icon)}
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
                {item.text}
              </HeadingView>
            )}
          </div>
        </button>
      </li>
    )
  }

  return (
    <div className="relative overflow-visible transition-all duration-500 ease-in-out ">
      <aside
        className={`h-screen bg-distac-secondary text-default-light transition-all duration-500 ease-in-out shadow-lg shadow-default-dark sticky top-0 right-0 flex flex-col overflow-visible z-[9999] ${
          viewModel.isOpen ? 'w-72' : 'w-20'
        }`}
      >
        {/* Logo Header with Floating Toggle Button */}
        <div
          className={`relative flex items-center border-b border-default-light px-6 h-24 z-30 transition-all ease-in-out  duration-500 overflow-visible ${
            viewModel.isOpen ? 'justify-start' : 'justify-center'
          }`}
        >
          {/* Logo - Changes based on sidebar state */}
          <Link
            to={viewModel.homeRoute}
            className="inline-block transform transition-all duration-500 hover:scale-110 flex-shrink-0"
            title="Ir para home"
          >
            {viewModel.isOpen ? (
              <LogoView height={'40'} className='text-default-light fill-current' />
            ) : (
              <LogoView variant="mark" height={'40'} className='text-default-light fill-current' />
            )}
          </Link>

          {/* Floating Toggle Button - Positioned absolutely */}
          <button
            onClick={viewModel.toggleSidebar}
            className={`absolute transition-all duration-500 cursor-pointer flex-shrink-0 ${
              viewModel.isOpen
                ? '-right-5'
                : '-right-5'
            } bg-distac-primary border-2 border-distac-primary rounded-full p-2 shadow-lg hover:shadow-xl transform hover:scale-110 top-1/2 -translate-y-1/2`}
            aria-label={viewModel.isOpen ? 'Fechar menu' : 'Abrir menu'}
            title={viewModel.isOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            <div className="transition-transform duration-500 flex items-center justify-center">
              {viewModel.isOpen ? (
                <ChevronLeft size={20} className="text-default-light " />
              ) : (
                <ChevronRight size={20} className="text-default-light " />
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
