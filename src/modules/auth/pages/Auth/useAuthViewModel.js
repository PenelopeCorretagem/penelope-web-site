import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AuthModel } from './AuthModel'
import { registerUser, loginUser, forgotPassword } from '../../../../shared/services/apiService'

/**
 * useAuthViewModel - ViewModel para gerenciar a lógica de autenticação
 * Centraliza estado, navegação e lógica de negócios
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

  // Handler de submit para login
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
        setAlertConfig(null)
        navigate('/home')
      }, 2000)
    } catch (err) {
      console.error('Erro no login:', err)
      setAlertConfig({
        type: 'error',
        message: 'E-mail ou senha inválidos.',
        onClose: handleCloseAlert,
        showForgotPassword: true
      })
    } finally {
      setIsLoading(false)
    }
  }, [navigate, handleCloseAlert])

  // Handler de submit para registro
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
        showLoginLink: true
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
        showForgotPassword: err.response?.status === 409
      })
    } finally {
      setIsLoading(false)
    }
  }, [handleCloseAlert])

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

    // Dados do modelo
    signInFormConfig,
    signUpFormConfig,
    forgotPasswordFormConfig,
    leftPanelContent,
    rightPanelContent
  }
}
