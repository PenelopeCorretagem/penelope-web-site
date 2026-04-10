import { useState, useCallback, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AuthModel } from './AuthModel'
import { login, register } from '@api-penelopec/authApi'
import { getAllUsers, forgotPassword } from '@service-penelopec/userService'
import { userMapper } from '@mappers/userMapper'

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

  const handleLoginSubmit = useCallback(async (formData) => {
    setIsLoading(true)



    try {
      const response = await login({
        email: formData.email,
        password: formData.senha
      })



      // Validar e salvar token
      const token = response.token
      if (!token || typeof token !== 'string') {
        throw new Error('Token não recebido do servidor')
      }

      // Salvar dados essenciais IMEDIATAMENTE usando sessionStorage
      sessionStorage.setItem('token', token)
      sessionStorage.setItem('jwtToken', token)

      // Processar dados do usuário
      let userEntity = null
      let userId = response.id
      const accessLevel = response.accessLevel

      // Determinar se é admin PRIMEIRO, antes de qualquer outra lógica
      let isAdminUser = false
      if (accessLevel) {
        isAdminUser = accessLevel === 'ADMINISTRADOR' || accessLevel === 'Administrador'
      }

      // Salvar dados essenciais IMEDIATAMENTE
      if (userId) {
        sessionStorage.setItem('userId', userId.toString())
      }

      sessionStorage.setItem('userEmail', formData.email)
      sessionStorage.setItem('userRole', isAdminUser ? 'admin' : 'user')

      // Se não temos user nem id na resposta, buscar na API
      if (!response.user && !response.id) {

        try {
          const users = await getAllUsers()

          const currentUser = users.find(u =>
            u.email?.toLowerCase() === formData.email.toLowerCase()
          )

          if (currentUser) {


            // Tentar extrair ID de várias formas
            userId = currentUser.id ||
                    currentUser.userId ||
                    currentUser.user_id ||
                    currentUser.ID



            if (!userId) {
              console.warn('⚠️ API não retorna ID! Usando email como fallback')
              userId = formData.email
            }

            userEntity = currentUser
          } else {
            console.error('❌ Usuário não encontrado na API')
            throw new Error('Não foi possível encontrar os dados do usuário')
          }
        } catch (userError) {
          console.error('❌ Erro ao buscar usuários:', userError)
          throw new Error('Erro ao carregar dados do usuário')
        }
      } else if (response.user) {
        try {
          userEntity = userMapper.toEntity(response.user)
          userId = userEntity.id || response.id

        } catch (mapError) {
          console.error('❌ Erro ao mapear usuário:', mapError)
          throw new Error('Erro ao processar dados do usuário')
        }
      }

      // Validar userId
      if (!userId) {
        console.error('❌ ERRO: userId não disponível após login!')
        console.warn('⚠️ FALLBACK: Usando email como identificador')
        userId = formData.email
      }

      // Atualizar userId se necessário
      if (userId !== sessionStorage.getItem('userId')) {
        sessionStorage.setItem('userId', userId.toString())

      }

      // Salvar dados completos do usuário se disponível, MAS PRESERVAR ROLE
      if (userEntity) {
        sessionStorage.setItem('userName', userEntity.nomeCompleto || userEntity.email || formData.email)

        // IMPORTANTE: Só sobrescrever userRole se userEntity tiver info mais atual
        if (userEntity.accessLevel && userEntity.isAdmin) {
          const entityIsAdmin = userEntity.isAdmin()
          if (entityIsAdmin !== isAdminUser) {

            sessionStorage.setItem('userRole', entityIsAdmin ? 'admin' : 'user')
            isAdminUser = entityIsAdmin
          }
        }


      } else {
        // Garantir que dados mínimos estão salvos
        sessionStorage.setItem('userName', formData.email)

      }

      window.dispatchEvent(new CustomEvent('authChanged'))
      setTimeout(() => {
        navigate(model.getHomeRoute())
      }, 2000)

      return { success: true }
    } catch (error) {
      console.error('Erro no login:', error)

      let errorMessage = 'Erro ao fazer login. Tente novamente.'

      if (error.response?.status === 403) {
        errorMessage = 'Email ou senha incorretos.'
      } else if (error.response?.status === 401) {
        errorMessage = 'Não autorizado. Verifique suas credenciais.'
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
        primaryButton: { text: 'Tentar novamente', action: 'close' },
        secondaryButton: { text: 'Esqueci minha senha', action: 'forgotPassword' }
      })

      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
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
