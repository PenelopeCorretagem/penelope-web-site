import { ChevronLeft, Menu, LogOut } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { LogoView } from '@shared/components/ui/Logo/LogoView'
import { Link } from 'react-router-dom'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { useSidebarViewModel } from './useSidebarViewModel'

/**
 * SidebarView - Componente de apresentação do menu lateral
 *
 * RESPONSABILIDADES:
 * - Renderizar UI do sidebar
 * - Delegar ações para o ViewModel
 * - Aplicar estilos e animações
 *
 * @param {boolean} isAdmin - Se usuário é admin
 * @param {boolean} initialOpen - Estado inicial (aberto/fechado) - padrão: false
 */
export function SidebarView({ isAdmin = false, initialOpen = false }) {
  const viewModel = useSidebarViewModel(isAdmin, initialOpen)

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
          <div className="flex-shrink-0 transition-transform duration-300">
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
    <aside
      className={`h-screen bg-distac-secondary text-default-light transition-all duration-500 ease-in-out shadow-lg shadow-default-dark sticky top-0 right-0 flex flex-col ${
        viewModel.isOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Header */}
      <div className={`flex h-24 items-center border-b border-default-light px-6 overflow-hidden ${
        viewModel.isOpen ? 'justify-between' : 'justify-center'
      }`}
      >
        <div
          className={`transition-all duration-500 ease-in-out ${
            viewModel.isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'
          }`}
        >
          {viewModel.isOpen && (
            <Link
              to={viewModel.homeRoute}
              className="inline-block transform transition-transform duration-300 hover:scale-110"
            >
              <LogoView height={'40'} className='text-default-light fill-current' />
            </Link>
          )}
        </div>
        <button
          onClick={viewModel.toggleSidebar}
          className="transition-all duration-300 cursor-pointer flex-shrink-0"
          aria-label={viewModel.isOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          <div className="transition-transform duration-300">
            {viewModel.isOpen ? <ChevronLeft size={25} /> : <Menu size={25} />}
          </div>
        </button>
      </div>

      {/* Menu Items */}
      <nav className="py-4 flex-1">
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
          <div className="flex-shrink-0 transition-transform duration-300">
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
  )
}
