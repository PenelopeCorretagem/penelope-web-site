import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { BackButtonView } from '@shared/components/ui/BackButton/BackButtonView'
import { LogoView } from '@shared/components/ui/Logo/LogoView'

export function PanelHeader({ variant = 'rightPanel', logoColor = 'pink' }) {
  const location = useLocation()
  const navigate = useNavigate()

  const handleItemClick = useCallback(() => {
    const routePath = '/'

    if (location.pathname === routePath) {
      window.location.href = routePath
      return
    }

    navigate(routePath)
  }, [location.pathname, navigate])
  if (variant === 'rightPanel') {
    const logoClass = logoColor === 'pink'
      ? 'text-distac-primary fill-current'
      : 'text-default-light fill-current'

    return(
      <button
        onClick={() => handleItemClick('/')}
        className={`hidden md:inline-block transform transition-all duration-500 ease-in-out hover:scale-110 bg-transparent border-none cursor-pointer p-0`}
      >
        <LogoView className={logoClass} />
      </button>
    )
  }

  if (variant === 'leftPanel') {
    return (
      <BackButtonView
        className="text-default-light"
      />
    )
  }
  // Default SignIn variant
  return (
    <BackButtonView
      className="text-distac-primary"
    />
  )
}
