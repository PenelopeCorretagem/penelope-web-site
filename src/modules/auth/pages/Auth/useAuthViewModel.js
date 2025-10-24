import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AuthModel } from './AuthModel'
import { RouterModel } from '@routes/RouterModel'

/**
 * useAuthViewModel - ViewModel para gerenciar a lógica de autenticação
 * Centraliza estado, navegação e lógica de apresentação
 */
export function useAuthViewModel() {
  const [isActive, setIsActive] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const authModel = useMemo(() => new AuthModel(), [])
  const routerModel = useMemo(() => RouterModel.getInstance(), [])

  // Estado computado baseado na rota atual
  const currentAuthType = authModel.getAuthTypeFromRoute(location.pathname)

  // Sincroniza estado com a rota atual
  useEffect(() => {
    switch (currentAuthType) {
      case authModel.authTypes.REGISTER:
        setIsActive(true)
        setIsForgotPassword(false)
        break
      case authModel.authTypes.FORGOT_PASSWORD:
        setIsActive(true)
        setIsForgotPassword(true)
        break
      case authModel.authTypes.LOGIN:
      default:
        setIsActive(false)
        setIsForgotPassword(false)
        break
    }
  }, [currentAuthType, authModel.authTypes])

  // Handlers de navegação
  const handleRegisterClick = useCallback(() => {
    setIsActive(true)
    setIsForgotPassword(false)
    navigate(authModel.routes[authModel.authTypes.REGISTER])
  }, [navigate, authModel])

  const handleLoginClick = useCallback(() => {
    setIsActive(false)
    setIsForgotPassword(false)
    navigate(authModel.routes[authModel.authTypes.LOGIN])
  }, [navigate, authModel])

  const handleForgotPasswordClick = useCallback(() => {
    setIsForgotPassword(true)
    setIsActive(true)
    navigate(authModel.routes[authModel.authTypes.FORGOT_PASSWORD])
  }, [navigate, authModel])

  const handleBackToLogin = useCallback(() => {
    setIsActive(false)
    navigate(authModel.routes[authModel.authTypes.LOGIN])
    // Espera a transição terminar antes de limpar o isForgotPassword
    setTimeout(() => {
      setIsForgotPassword(false)
    }, 700)
  }, [navigate, authModel])

  // Handler de submit
  const handleSubmit = useCallback(async (_formData) => {
    // Sua lógica aqui
    return { success: true, message: 'Sucesso!' }
  }, [])

  // Handler específico para esqueci minha senha
  const handleForgotPasswordSubmit = useCallback(async (_formData) => {
    // Aqui você faria a chamada da API para enviar o email de reset
    // Por enquanto, vamos apenas navegar para a página de verificação
    navigate(routerModel.get('VERIFICATION_CODE').replace('-:token', ''))
    return { success: true, message: 'E-mail de recuperação enviado!' }
  }, [navigate, routerModel])

  // Configurações de CSS para animações
  const getContainerClasses = () => ({
    base: 'relative w-full h-full bg-brand-white overflow-hidden transition-all duration-700 ease-in-out',
    active: isActive ? 'active' : ''
  })

  const getSignInPanelStyles = () => ({
    transform: isActive ? 'translateX(calc(100% + 66.67%))' : 'translateX(0%)',
    opacity: isActive ? 0 : 1,
    visibility: isActive ? 'hidden' : 'visible',
    transition: isActive
      ? 'transform 0.7s ease-in-out, opacity 0.35s ease-in-out, visibility 0s 0.35s'
      : 'transform 0.7s ease-in-out, opacity 0.35s 0.35s ease-in-out, visibility 0s',
    pointerEvents: isActive ? 'none' : 'auto'
  })

  const getSignUpPanelStyles = () => ({
    transform: isActive ? 'translateX(0%)' : 'translateX(calc(-100% - 66.67%))',
    opacity: isActive ? 1 : 0,
    visibility: isActive ? 'visible' : 'hidden',
    transition: isActive
      ? 'transform 0.7s ease-in-out, opacity 0.35s 0.35s ease-in-out, visibility 0s'
      : 'transform 0.7s ease-in-out, opacity 0.35s ease-in-out, visibility 0s 0.35s',
    zIndex: isActive ? 50 : 10
  })

  const getToggleContainerClasses = () => ({
    base: 'absolute top-0 left-3/5 w-2/5 h-full overflow-hidden z-[1000] transition-all duration-700 ease-in-out',
    transform: isActive ? 'transform -translate-x-[150%]' : ''
  })

  const getGradientClasses = () => ({
    base: 'bg-brand-gradient h-full relative -left-full w-[200%] transform transition-all duration-700 ease-in-out',
    transform: isActive ? 'translate-x-1/2' : 'translate-x-0'
  })

  const getLeftPanelClasses = () => ({
    base: 'absolute w-1/2 h-full p-section md:p-section-md flex flex-col top-0 transition-all duration-700 ease-in-out',
    transform: isActive ? 'transform translate-x-0' : 'transform -translate-x-[200%]'
  })

  const getRightPanelClasses = () => ({
    base: 'absolute right-0 w-1/2 h-full p-section md:p-section-md flex flex-col top-0 transition-all duration-700 ease-in-out',
    transform: isActive ? 'transform translate-x-[200%]' : 'transform translate-x-0'
  })

  // Dados do modelo
  const signInFormConfig = authModel.getFormConfig(authModel.authTypes.LOGIN)
  const signUpFormConfig = authModel.getFormConfig(authModel.authTypes.REGISTER)
  const forgotPasswordFormConfig = authModel.getFormConfig(authModel.authTypes.FORGOT_PASSWORD)
  const leftPanelContent = authModel.getLeftPanelContent(currentAuthType)
  const rightPanelContent = authModel.getRightPanelContent()

  return {
    // Estado
    isActive,
    isForgotPassword,
    currentAuthType,

    // Handlers
    handleRegisterClick,
    handleLoginClick,
    handleForgotPasswordClick,
    handleBackToLogin,
    handleSubmit,
    handleForgotPasswordSubmit,

    // Configurações de estilo
    getContainerClasses,
    getSignInPanelStyles,
    getSignUpPanelStyles,
    getToggleContainerClasses,
    getGradientClasses,
    getLeftPanelClasses,
    getRightPanelClasses,

    // Dados do modelo
    signInFormConfig,
    signUpFormConfig,
    forgotPasswordFormConfig,
    leftPanelContent,
    rightPanelContent
  }
}
