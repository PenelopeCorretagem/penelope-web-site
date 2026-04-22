import { useState, useCallback, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AuthModel } from './AuthModel'
import { login, register } from '@api-penelopec/authApi'
import { forgotPassword } from '@service-penelopec/userService'
import { authSessionUtil } from '@shared/utils/authSession/authSessionUtil'

export function useAuthViewModel() {
  const navigate = useNavigate()
  const location = useLocation()
  const [model] = useState(() => new AuthModel())

  const [isActive, setIsActive] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [alertConfig, setAlertConfig] = useState(null)

  useEffect(() => {
    const currentPath = location.pathname
    const authType = model.getAuthTypeFromRoute(currentPath)

    if (authType === model.authTypes.REGISTER) {
      setIsActive(true)
      setIsForgotPassword(false)
    } else if (authType === model.authTypes.FORGOT_PASSWORD) {
      setIsActive(false)
      setIsForgotPassword(true)
    } else {
      setIsActive(false)
      setIsForgotPassword(false)
    }
  }, [location.pathname, model])

  useEffect(() => {
    if (!alertConfig?.autoCloseMs) return undefined

    const timeoutId = setTimeout(() => {
      setAlertConfig(null)
    }, alertConfig.autoCloseMs)

    return () => clearTimeout(timeoutId)
  }, [alertConfig])

  const handleRegisterClick = useCallback(() => {
    setIsActive(true)
    setIsForgotPassword(false)
    navigate(model.getRouteFromAuthType(model.authTypes.REGISTER))
  }, [navigate, model])

  const handleLoginClick = useCallback(() => {
    setIsActive(false)
    setIsForgotPassword(false)
    navigate(model.getRouteFromAuthType(model.authTypes.LOGIN))
  }, [navigate, model])

  const handleForgotPasswordClick = useCallback(() => {
    setIsActive(false)
    setIsForgotPassword(true)
    navigate(model.getRouteFromAuthType(model.authTypes.FORGOT_PASSWORD))
  }, [navigate, model])

  const handleBackToLogin = useCallback(() => {
    setIsForgotPassword(false)
    navigate(model.getRouteFromAuthType(model.authTypes.LOGIN))
  }, [navigate, model])

  // handleLoginSubmit — trecho corrigido em useAuthViewModel.js
const handleLoginSubmit = useCallback(async (formData) => {
  setIsLoading(true)
  try {
    const response = await login({ email: formData.email, password: formData.senha })

    const token = response.token
    if (!token || typeof token !== 'string') {
      throw new Error('Token não recebido do servidor.')
    }

    const isAdmin = response.accessLevel === 'ADMINISTRADOR'
    const userId  = response.id ?? formData.email // fallback apenas se API não retornar id

    authSessionUtil.save({
      token,
      userId,
      email: formData.email,
      isAdmin,
      name: response.user?.nomeCompleto ?? formData.email,
    })

    // Dispara transição de login antes de navegar
    window.dispatchEvent(new CustomEvent('authTransition', {
      detail: { type: 'login', message: 'Autenticando sua conta...' }
    }))
    window.dispatchEvent(new CustomEvent('authChanged'))

    setTimeout(() => navigate(model.getHomeRoute()), 600)
    return { success: true }

  } catch (error) {
    setIsLoading(false)

    const status = error.response?.status
    const serverMsg = error.response?.data?.message
                   ?? (typeof error.response?.data === 'string' ? error.response.data : null)

    const errorMessage =
      status === 403 ? 'E-mail ou senha incorretos.' :
      status === 401 ? 'Não autorizado. Verifique suas credenciais.' :
      serverMsg       ? serverMsg :
      error.message   ? error.message :
      'Erro ao fazer login. Tente novamente.'

    setAlertConfig({
      type: 'error',
      message: errorMessage,
      primaryButton:   { text: 'Tentar novamente',   action: 'close' },
      secondaryButton: { text: 'Esqueci minha senha', action: 'forgotPassword' }
    })
    return { success: false, error: errorMessage }
  }
}, [navigate, model])
  const handleRegisterSubmit = useCallback(async (formData) => {
    setIsLoading(true)
    try {
      if (formData.senha !== formData.confirmSenha) {
        throw new Error('As senhas não coincidem.')
      }
      if (!formData.lgpdConsent) {
        throw new Error('Você deve aceitar os termos da LGPD para prosseguir.')
      }


      await register({
        name: formData.nomeCompleto,
        email: formData.email,
        password: formData.senha
      })

      setAlertConfig({
        type: 'success',
        message: `Cadastro realizado com sucesso! Faça login para continuar.`,
        autoCloseMs: 1000,
        hideCloseButton: true
      })

      setIsActive(false)

      return { success: true }
    } catch (error) {
      console.error('Erro no registro:', error)

      let errorMessage = 'Erro ao criar conta. Tente novamente.'

      if (error.response?.status === 409) {
        errorMessage = 'Este email já está cadastrado.'
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (typeof error.response?.data === 'string') {
        errorMessage = error.response.data
      } else if (error.message) {
        errorMessage = error.message
      }

      setAlertConfig({
        type: 'error',
        message: errorMessage,
        primaryButton: { text: 'Tentar novamente', action: 'close' }
      })

      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleForgotPasswordSubmit = useCallback(async (formData) => {
    setIsLoading(true)
    try {
      const responseMessage = await forgotPassword(formData.email)
      const message = typeof responseMessage === 'string'
        ? responseMessage
        : responseMessage?.message

      setAlertConfig({
        type: 'success',
        message: message || 'Se o e-mail estiver cadastrado, um código de verificação será enviado.',
        primaryButton: { text: 'Voltar ao login', action: 'login' }
      })

      return { success: true }
    } catch (error) {
      console.error('Erro ao recuperar senha:', error)
      const errorMessage = error.response?.data?.message ||
                          error.response?.data ||
                          'Erro ao enviar email de recuperação. Tente novamente.'

      setAlertConfig({
        type: 'error',
        message: errorMessage,
        primaryButton: { text: 'Tentar novamente', action: 'close' }
      })

      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleCloseAlert = useCallback(() => {
    setAlertConfig(null)
  }, [])

  return {
    isActive,
    isForgotPassword,
    isLoading,
    alertConfig,
    handleRegisterClick,
    handleLoginClick,
    handleForgotPasswordClick,
    handleBackToLogin,
    handleLoginSubmit,
    handleRegisterSubmit,
    handleForgotPasswordSubmit,
    handleCloseAlert,
    signInFormConfig: model.getFormConfig(model.authTypes.LOGIN),
    signUpFormConfig: model.getFormConfig(model.authTypes.REGISTER),
    forgotPasswordFormConfig: model.getFormConfig(model.authTypes.FORGOT_PASSWORD),
    leftPanelContent: model.getLeftPanelContent(isForgotPassword ? model.authTypes.FORGOT_PASSWORD : (isActive ? model.authTypes.REGISTER : model.authTypes.LOGIN)),
    rightPanelContent: model.getRightPanelContent()
  }
}
