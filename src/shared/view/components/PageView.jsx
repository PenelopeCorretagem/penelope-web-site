import { useState } from 'react'
import { MenuView } from '@shared/view/components/MenuView'
import { RouterView } from '@shared/view/components/RouterView'

export function PageView() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
  }
  return (
    <div className='flex min-h-screen w-full flex-col '>
      <MenuView isAuthenticated={isAuthenticated} />
      <RouterView isAuthenticated={isAuthenticated} />

      {/* Botões de teste */}
      {process.env.NODE_ENV === 'development' && (
        <div className='fixed right-4 bottom-4 flex gap-2 rounded bg-gray-800/50 p-4'>
          {!isAuthenticated ? (
            <button
              onClick={handleLogin}
              className='rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'
            >
              Login (DEV)
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className='rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600'
            >
              Logout (DEV)
            </button>
          )}
        </div>
      )}
    </div>
  )
}
