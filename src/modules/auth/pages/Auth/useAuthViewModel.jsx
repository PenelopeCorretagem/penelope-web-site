import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AuthModel } from './AuthModel'
import { registerUser, loginUser, forgotPassword } from '../../../../shared/services/apiService'
import { TextView } from '@shared/components/ui/Text/TextView'
/**
 * useAuthViewModel - ViewModel para gerenciar a lógica de autenticação
 * Centraliza estado, navegação e lógica de apresentação
 */
export function useAuthViewModel() {
  const [isActive, setIsActive] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [alertConfig, setAlertConfig] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()
  const authModel = useMemo(() => new AuthModel(), [])

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
  const handleRegisterClick = useCallback((event) => {
    event?.preventDefault?.()
    setIsActive(true)
    setIsForgotPassword(false)
    navigate(authModel.routes[authModel.authTypes.REGISTER])
  }, [navigate, authModel])


  const handleCloseAlert = useCallback(() => {
    setAlertConfig(null)
  }, [])

  const handleLoginClick = useCallback(() => {
    setIsActive(false)
    setIsForgotPassword(false)
    navigate(authModel.routes[authModel.authTypes.LOGIN])
  }, [navigate, authModel])

  const handleForgotPasswordClick = useCallback((event) => {
    event?.preventDefault?.()
    setIsForgotPassword(true)
    setIsActive(true)
    navigate(authModel.routes[authModel.authTypes.FORGOT_PASSWORD])
  }, [navigate, authModel])

  const handleBackToLogin = useCallback((event) => {
    event?.preventDefault?.()
    setIsActive(false)
    navigate(authModel.routes[authModel.authTypes.LOGIN])
    setTimeout(() => {
      setIsForgotPassword(false)
    }, 700)
  }, [navigate, authModel])

  // Handler de submit
  const handleLoginSubmit = useCallback(async (formData) => {
    setIsLoading(true)
    setAlertConfig(null)
    try {
      const response = await loginUser(formData)
      const { token } = response.data
      localStorage.setItem('jwtToken', token)
      console.log('Login bem-sucedido, token:', token)
      setAlertConfig({
        type: 'success',
        message: 'Login bem-sucedido! Redirecionando ...',
      })

      setTimeout(() => {
        setAlertConfig(null) // Fecha o pop-up
        navigate('/home')      // Navega para a home
      }, 2000) // 2000ms = 2 segundos
    } catch (err) {
      console.error('Erro no login:', err)
      setAlertConfig({
        type: 'error',
        message: 'E-mail ou senha inválidos.',
        onClose: handleCloseAlert,
        children: (
          <TextView className='text-brand-dark-gray flex gap-1 items-center justify-center'>
            <button
              onClick={() => {
                handleCloseAlert()
                handleForgotPasswordClick()
              }}
              className='font-semibold text-brand-pink hover:underline bg-transparent border-none cursor-pointer'
            >
              Recuperar senha
            </button>
          </TextView>
        )
      })
    } finally {
      if (error) setIsLoading(false)
    }
  }, [navigate, handleCloseAlert, handleForgotPasswordClick])

  // Handler de register
  const handleRegisterSubmit = useCallback(async (formData) => {
    setIsLoading(true)
    setAlertConfig(null)
    try {
      const response = await registerUser(formData)
      console.log('Cadastro bem-sucedido:', response.data)
      setAlertConfig({
        type: 'success',
        message: 'Cadastro realizado com sucesso!',
        onClose: handleCloseAlert,
        children: (
          <TextView className='text-brand-dark-gray flex gap-1 items-center justify-center'>
            Por favor, clique para acessar sua conta.
            <button
              onClick={() => {
                handleCloseAlert()
                handleLoginClick()
              }}
              className='font-semibold text-brand-pink hover:underline bg-transparent border-none cursor-pointer'
            >
              Fazer Login
            </button>
          </TextView>
        )
      })
    } catch (err) {
      console.error('Erro no cadastro:', err)
      let errorMessage = 'Ocorreu um erro no cadastro.'
      if (err.response?.data) {
        if (err.response.status === 409) {
          errorMessage = err.response.data.message
        } else if (err.response.status === 400) {
          errorMessage = Object.values(err.response.data).join(', ')
        }
      }
      setAlertConfig({
        type: 'error',
        message: errorMessage,
        onClose: handleCloseAlert,
        children: err.response?.status === 409 && (
          <TextView className='text-brand-dark-gray flex gap-1 items-center justify-center'>
            <button
              onClick={() => {
                handleCloseAlert()
                handleForgotPasswordClick()
              }}
              className='font-semibold text-brand-pink hover:underline bg-transparent border-none cursor-pointer'
            >
              Recuperar senha
            </button>
          </TextView>
        )
      })
    } finally {
      setIsLoading(false)
    }
  }, [handleLoginClick, handleCloseAlert, handleForgotPasswordClick])

  // Handler específico para esqueci minha senha
  const handleForgotPasswordSubmit = useCallback(async (formData) => {
    setIsLoading(true)
    setAlertConfig(null)
    try {
      const response = await forgotPassword(formData.email)
      console.log('Solicitação de recuperação de senha enviada:', response.data)
      setAlertConfig({
        type: 'info',
        message: response.data || 'Se o e-mail estiver cadastrado, as instruções de recuperação serão enviadas.',
        onClose: () => {
          setAlertConfig(null)
          handleBackToLogin()
        }
      })
    } catch (error) {
      setIsLoading(false)
      const errorMessage = error.response?.data?.message || 'Erro ao processar a requisição.'
      console.error('Erro na recuperação de senha:', error)
      setAlertConfig({
        type: 'error',
        message: errorMessage,
        onClose: handleCloseAlert
      })
    } finally {
      setIsLoading(false)
    }
  }, [handleBackToLogin, handleCloseAlert])

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
    isLoading,
    alertConfig,

    // Handlers
    handleRegisterClick,
    handleLoginClick,
    handleForgotPasswordClick,
    handleBackToLogin,
    handleLoginSubmit,
    handleRegisterSubmit,
    handleForgotPasswordSubmit,
    handleCloseAlert,

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
