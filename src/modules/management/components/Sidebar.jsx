import { useNavigate, useLocation } from 'react-router-dom'
import { User, Settings, Users, Building2, ChevronLeft, Menu, LogOut } from 'lucide-react'
import { LogoView } from '@shared/components/ui/Logo/LogoView'
import { Link } from 'react-router-dom'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'

const Sidebar = ({ open, onToggle, isAdmin = false }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const baseRoute = isAdmin ? '/admin/management' : '/management'

  const allMenuItems = [
    { text: 'Profile', icon: User, path: `${baseRoute}/profile`, roles: ['user', 'admin'] },
    { text: 'Account', icon: Settings, path: `${baseRoute}/account`, roles: ['user', 'admin'] },
    { text: 'Users', icon: Users, path: `${baseRoute}/users`, roles: ['admin'] },
    { text: 'Properties', icon: Building2, path: `${baseRoute}/properties`, roles: ['admin'] }
  ]

  // Filtra itens baseado no role do usuário
  const menuItems = allMenuItems.filter(item =>
    isAdmin ? item.roles.includes('admin') : item.roles.includes('user')
  )

  const handleNavigate = (path) => {
    navigate(path)
  }

  const handleLogout = () => {
    localStorage.removeItem('jwtToken')
    localStorage.removeItem('userRole')
    window.location.href = '/'
  }

  return (
    <aside
      className={`h-screen bg-distac-secondary text-default-light transition-all duration-500 ease-in-out shadow-lg shadow-default-dark sticky top-0 right-0 flex flex-col ${
        open ? 'w-64' : 'w-20'
      }`}
    >
      {/* Header */}
      <div className={`flex h-24 items-center border-b border-default-light px-6 overflow-hidden ${
        open ? 'justify-between' : 'justify-center'
      }`}
      >
        <div
          className={`transition-all duration-500 ease-in-out ${
            open ? 'opacity-100 w-auto' : 'opacity-0 w-0'
          }`}
        >
          {open && (
            <Link
              to='/'
              className={`inline-block transform transition-transform duration-300 hover:scale-110`}
            >
              <LogoView height={'40'} className='text-default-light fill-current' />
            </Link>
          )}
        </div>
        <button
          onClick={onToggle}
          className="transition-all duration-300 cursor-pointer flex-shrink-0"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        >
          <div className="transition-transform duration-300">
            {open ? <ChevronLeft size={25} /> : <Menu size={25} />}
          </div>
        </button>
      </div>

      {/* Menu Items */}
      <nav className="py-4 flex-1">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            const IconComponent = item.icon
            return (
              <li key={item.text} className="w-full">
                <button
                  onClick={() => handleNavigate(item.path)}
                  className={`flex w-full items-center px-6 py-3 transition-all duration-500 ease-in-out overflow-hidden cursor-pointer ${
                    isActive
                      ? 'bg-default-light text-distac-secondary border-l-4 border-distac-primary'
                      : 'hover:bg-default-light-muted hover:text-distac-secondary text-default-light border-l-4 border-transparent'
                  } ${!open ? 'justify-center' : ''}`}
                  title={!open ? item.text : ''}
                >
                  <div className="flex-shrink-0 transition-transform duration-300">
                    <IconComponent size={20} />
                  </div>
                  <div
                    className={`ml-3 transition-all duration-500 ease-in-out ${
                      open
                        ? 'opacity-100 w-auto translate-x-0'
                        : 'opacity-0 w-0 -translate-x-4'
                    }`}
                  >
                    {open && (
                      <HeadingView level={6} className="text-sm font-medium whitespace-nowrap">
                        {item.text}
                      </HeadingView>
                    )}
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="border-t border-default-light p-4">
        <button
          onClick={handleLogout}
          className={`flex w-full items-center px-6 py-3 transition-all duration-500 ease-in-out overflow-hidden cursor-pointer hover:bg-default-light  text-default-light hover:text-default-dark border-l-4 border-transparent hover:border-distac-primary rounded-sm ${
            !open ? 'justify-center' : ''
          }`}
          title={!open ? 'Logout' : ''}
        >
          <div className="flex-shrink-0 transition-transform duration-300">
            <LogOut size={20} />
          </div>
          <div
            className={`ml-3 transition-all duration-500 ease-in-out ${
              open
                ? 'opacity-100 w-auto translate-x-0'
                : 'opacity-0 w-0 -translate-x-4'
            }`}
          >
            {open && (
              <HeadingView level={6} className="text-sm font-medium whitespace-nowrap">
                Logout
              </HeadingView>
            )}
          </div>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
