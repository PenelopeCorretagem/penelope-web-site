import { useState, useCallback, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AuthModel } from './AuthModel'
import { login, register, forgotPassword } from '@app/services/api/authApi'
import { getAllUsers } from '@app/services/api/userApi'
import { userMapper } from '@app/services/mapper/userMapper'

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

    console.log('Tentando login com:', { email: formData.email })

    try {
      const response = await login({
        email: formData.email,
        senha: formData.senha
      })

      console.log('🔍 [LOGIN] Response da API:', response)

      // Validar e salvar token
      const token = response.token
      if (!token || typeof token !== 'string') {
        throw new Error('Token não recebido do servidor')
      }

      // Salvar dados essenciais IMEDIATAMENTE usando sessionStorage
      sessionStorage.setItem('token', token)
      sessionStorage.setItem('jwtToken', token)
      console.log('✅ Token salvo')

      // Processar dados do usuário
      let userEntity = null
      let userId = response.id
      const accessLevel = response.accessLevel

      // Determinar se é admin PRIMEIRO, antes de qualquer outra lógica
      let isAdminUser = false
      if (accessLevel) {
        isAdminUser = accessLevel === 'ADMINISTRADOR' || accessLevel === 'Administrador'
        console.log('✅ AccessLevel recebido do login:', accessLevel, '-> isAdmin:', isAdminUser)
      }

      // Salvar dados essenciais IMEDIATAMENTE
      if (userId) {
        sessionStorage.setItem('userId', userId.toString())
        console.log('✅ userId salvo:', userId)
      }

      sessionStorage.setItem('userEmail', formData.email)
      sessionStorage.setItem('userRole', isAdminUser ? 'admin' : 'user')
      console.log('✅ Dados essenciais salvos:', {
        userId,
        userEmail: formData.email,
        userRole: isAdminUser ? 'admin' : 'user',
        accessLevel
      })

      // Se não temos user nem id na resposta, buscar na API
      if (!response.user && !response.id) {
        console.log('⚠️ Resposta sem user/id, buscando na API...')

        try {
          const users = await getAllUsers()
          console.log(`✓ ${users.length} usuários encontrados na API`)

          if (users.length > 0) {
            console.log('📋 Primeiro usuário (debug):', users[0])
          }

          const currentUser = users.find(u =>
            u.email?.toLowerCase() === formData.email.toLowerCase()
          )

          if (currentUser) {
            console.log('✓ Usuário encontrado (objeto completo):', currentUser)

            // Tentar extrair ID de várias formas
            userId = currentUser.id ||
                    currentUser.userId ||
                    currentUser.user_id ||
                    currentUser.ID

            console.log('✓ userId tentando extrair:', userId)

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
          console.log('✓ UserEntity criada da resposta')
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
        console.log('✅ userId atualizado:', userId)
      }

      // Salvar dados completos do usuário se disponível, MAS PRESERVAR ROLE
      if (userEntity) {
        sessionStorage.setItem('userName', userEntity.nomeCompleto || userEntity.email || formData.email)

        // IMPORTANTE: Só sobrescrever userRole se userEntity tiver info mais atual
        if (userEntity.accessLevel && userEntity.isAdmin) {
          const entityIsAdmin = userEntity.isAdmin()
          if (entityIsAdmin !== isAdminUser) {
            console.log('⚠️ Conflito de admin status, usando userEntity:', entityIsAdmin)
            sessionStorage.setItem('userRole', entityIsAdmin ? 'admin' : 'user')
            isAdminUser = entityIsAdmin
          }
        }

        console.log('✅ Login completo! Dados salvos:', {
          userId,
          userName: userEntity.nomeCompleto,
          userEmail: userEntity.email,
          isAdmin: isAdminUser
        })
      } else {
        // Garantir que dados mínimos estão salvos
        sessionStorage.setItem('userName', formData.email)
        console.log('⚠️ Dados mínimos salvos, preservando role:', sessionStorage.getItem('userRole'))
      }

      setAlertConfig({
        type: 'success',
        message: `Bem-vindo de volta${userEntity?.nomeCompleto ? `, ${userEntity.nomeCompleto}` : ''}!`,
        onClose: () => {
          setAlertConfig(null)

          // Disparar evento de mudança de auth ANTES do redirect
          window.dispatchEvent(new CustomEvent('authChanged'))

          // Pequeno delay para garantir que o estado seja atualizado
          setTimeout(() => {
            // Redireciona usando o isAdminUser calculado
            if (isAdminUser) {
              console.log('🔀 Redirecionando para /admin/imoveis')
              navigate('/admin/imoveis')
            } else {
              console.log('🔀 Redirecionando para /imoveis')
              navigate('/imoveis')
            }
          }, 100)
        }
      })

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
  }, [navigate])

  const handleRegisterSubmit = useCallback(async (formData) => {
    setIsLoading(true)
    try {
      if (formData.senha !== formData.confirmSenha) {
        throw new Error('As senhas não coincidem.')
      }

      await register({
        nomeCompleto: formData.nomeCompleto,
        email: formData.email,
        senha: formData.senha
      })

      setAlertConfig({
        type: 'success',
        message: `Cadastro realizado com sucesso! Faça login para continuar.`,
        primaryButton: { text: 'Fazer login', action: 'login' }
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
      const message = await forgotPassword(formData.email)

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
