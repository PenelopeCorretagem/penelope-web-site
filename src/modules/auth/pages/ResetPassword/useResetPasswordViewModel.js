import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { ResetPasswordModel } from './ResetPasswordModel'
import { validateResetToken, resetPassword } from '@app/services/api/authApi'

export function useResetPasswordViewModel() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const resetPasswordModel = useMemo(() => new ResetPasswordModel(), [])
  const redirectTimeoutRef = useRef(null)

  // Estados principais da lógica de animação
  const [isActive, setIsActive] = useState(false)
  const currentResetType = resetPasswordModel.getResetTypeFromRoute(location.pathname)

  // Estados para a API e formulários
  const [validToken, setValidToken] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [alertConfig, setAlertConfig] = useState(null)

  const handleCloseAlert = useCallback(() => {
    setAlertConfig(null)
  }, [])

  // Sincroniza o estado 'isActive' com a rota atual
  useEffect(() => {
    setIsActive(currentResetType === resetPasswordModel.resetTypes.NEW_PASSWORD)
  }, [currentResetType, resetPasswordModel.resetTypes])

  // Efeito para validar o token da URL assim que a página carrega
  useEffect(() => {
    const tokenFromUrl = searchParams.get('token')
    if (tokenFromUrl) {
      const validate = async () => {
        setIsLoading(true)
        setError('')
        try {
          const trimmed = (tokenFromUrl || '').trim()
          const response = await validateResetToken(trimmed)
          console.log('Token validation response:', response)
          setValidToken(trimmed)

          try { sessionStorage.setItem('resetToken', trimmed) } catch (e) { /* ignore */ }
          const resetRoute = resetPasswordModel.getResetPasswordRoute()
          if (location.pathname !== resetRoute) {
            navigate(`${resetRoute}?token=${trimmed}`, { replace: true, state: { token: trimmed } })
          } else {
            navigate(location.pathname + location.search, { replace: true, state: { token: trimmed } })
          }
        } catch (err) {
          console.error('validateResetToken error (url):', err.response ?? err)
          setError(err.response?.data?.message || 'Link de redefinição inválido ou expirado.')
        } finally {
          setIsLoading(false)
        }
      }
      validate()
    }
  }, [searchParams, navigate, resetPasswordModel, location.pathname])

  // Handler para o formulário de verificação
  const handleVerificationSubmit = useCallback(async (formData) => {
    setIsLoading(true)
    setError('')
    try {
      const trimmed = (formData.token || '').trim()
      const response = await validateResetToken(trimmed)
      console.log('Token validation response:', response)
      setValidToken(trimmed)
      try { sessionStorage.setItem('resetToken', trimmed) } catch (e) { }
      const resetRoute = resetPasswordModel.getResetPasswordRoute()
      navigate(`${resetRoute}?token=${trimmed}`, { replace: true, state: { token: trimmed } })
    } catch (err) {
      console.error('validateResetToken error (form):', err.response ?? err)
      setError(err.response?.data?.message || 'Código inválido ou expirado.')
    } finally {
      setIsLoading(false)
    }
  }, [navigate, resetPasswordModel])

  // Handler para o formulário de nova senha
  const handleNewPasswordSubmit = useCallback(async (formData) => {
    const token = location.state?.token || searchParams.get('token') || validToken || (() => {
      try { return sessionStorage.getItem('resetToken') || '' } catch (e) { return '' }
    })()

    if (!token) {
      const msg = 'Token de sessão perdido. Por favor, tente novamente.'
      setError(msg)
      setAlertConfig({ type: 'error', message: msg, onClose: handleCloseAlert })
      return
    }
    if (formData.newPassword !== formData.confirmPassword) {
      const msg = 'As senhas não coincidem.'
      setError(msg)
      setAlertConfig({ type: 'error', message: msg, onClose: handleCloseAlert })
      return
    }

    setIsLoading(true)
    setError('')
    setAlertConfig(null)

    try {
      const response = await resetPassword({ token, newPassword: formData.newPassword })
      console.log('Password reset response:', response)
      setAlertConfig({
        type: 'success',
        message: 'Senha redefinida com sucesso!',
        onClose: () => {
          setAlertConfig(null)
          try { sessionStorage.removeItem('resetToken') } catch (e) { }
          navigate('/login')
        }
      })
      if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current)
      redirectTimeoutRef.current = setTimeout(() => {
        setAlertConfig(null)
        try { sessionStorage.removeItem('resetToken') } catch (e) { }
        navigate('/login')
      }, 2000)
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Ocorreu um erro ao redefinir a senha.'
      setError(errorMessage)
      setAlertConfig({ type: 'error', message: errorMessage, onClose: handleCloseAlert })
    } finally {
      setIsLoading(false)
    }
  }, [navigate, location.state, validToken, handleCloseAlert, searchParams])

  const handleBackToLogin = useCallback(() => {
    navigate(resetPasswordModel.getLoginRoute())
  }, [navigate, resetPasswordModel])

  // Dados do modelo
  const verificationFormConfig = resetPasswordModel.getFormConfig(resetPasswordModel.resetTypes.VERIFICATION)
  const newPasswordFormConfig = resetPasswordModel.getFormConfig(resetPasswordModel.resetTypes.NEW_PASSWORD)
  const leftPanelContent = resetPasswordModel.getLeftPanelContent(currentResetType)
  const rightPanelContent = resetPasswordModel.getRightPanelContent()

  // Cleanup for redirect timeout
  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current)
      }
    }
  }, [])

  return {
    // Estado
    isActive,
    currentResetType,
    token: searchParams.get('token') || location.state?.token || validToken,
    isLoading,
    error,
    alertConfig,

    // Handlers
    handleVerificationSubmit,
    handleNewPasswordSubmit,
    handleBackToLogin,
    handleCloseAlert,

    // Dados do modelo
    verificationFormConfig,
    newPasswordFormConfig,
    leftPanelContent,
    rightPanelContent
  }
}
