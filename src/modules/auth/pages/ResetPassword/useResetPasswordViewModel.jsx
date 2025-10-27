import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { ResetPasswordModel } from './ResetPasswordModel'
import { validateResetToken, resetPassword } from '../../../../shared/services/apiService'

export function useResetPasswordViewModel() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const resetPasswordModel = useMemo(() => new ResetPasswordModel(), [])

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
          await validateResetToken(tokenFromUrl)
          setValidToken(tokenFromUrl)
          navigate(resetPasswordModel.getResetPasswordRoute(), { state: { token: tokenFromUrl } })
        } catch (err) {
          setError('Link de redefinição inválido ou expirado.')
        } finally {
          setIsLoading(false)
        }
      }
      validate()
    }
  }, [searchParams, navigate, resetPasswordModel])

  // Handler para o formulário de verificação
  const handleVerificationSubmit = useCallback(async (formData) => {
    setIsLoading(true)
    setError('')
    try {
      await validateResetToken(formData.token)
      setValidToken(formData.token)
      navigate(resetPasswordModel.getResetPasswordRoute(), { state: { token: formData.token } })
    } catch (err) {
      setError(err.response?.data?.message || 'Código inválido ou expirado.')
    } finally {
      setIsLoading(false)
    }
  }, [navigate, resetPasswordModel])

  // Handler para o formulário de nova senha
  const handleNewPasswordSubmit = useCallback(async (formData) => {
    const token = location.state?.token || validToken

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
      await resetPassword({ token, newPassword: formData.newPassword })
      setAlertConfig({
        type: 'success',
        message: 'Senha redefinida com sucesso!',
        onClose: () => {
          setAlertConfig(null)
          navigate('/auth')
        }
      })
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Ocorreu um erro ao redefinir a senha.'
      setError(errorMessage)
      setAlertConfig({ type: 'error', message: errorMessage, onClose: handleCloseAlert })
    } finally {
      setIsLoading(false)
    }
  }, [navigate, location.state, validToken, handleCloseAlert])

  const handleBackToLogin = useCallback(() => {
    navigate(resetPasswordModel.getLoginRoute())
  }, [navigate, resetPasswordModel])

  // Dados do modelo
  const verificationFormConfig = resetPasswordModel.getFormConfig(resetPasswordModel.resetTypes.VERIFICATION)
  const newPasswordFormConfig = resetPasswordModel.getFormConfig(resetPasswordModel.resetTypes.NEW_PASSWORD)
  const leftPanelContent = resetPasswordModel.getLeftPanelContent(currentResetType)
  const rightPanelContent = resetPasswordModel.getRightPanelContent()

  return {
    // Estado
    isActive,
    currentResetType,
    token: searchParams.get('token') || '',
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
