import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ResetPasswordModel } from './ResetPasswordModel'

/**
 * useResetPasswordViewModel - ViewModel para gerenciar a lógica de redefinição de senha
 * Centraliza estado, navegação e lógica de apresentação
 */
export function useResetPasswordViewModel() {
  const [isActive, setIsActive] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const resetPasswordModel = useMemo(() => new ResetPasswordModel(), [])

  // Estado computado baseado na rota atual
  const currentResetType = resetPasswordModel.getResetTypeFromRoute(location.pathname)

  // Sincroniza estado com a rota atual
  useEffect(() => {
    switch (currentResetType) {
      case resetPasswordModel.resetTypes.NEW_PASSWORD:
        setIsActive(true)
        break
      case resetPasswordModel.resetTypes.VERIFICATION:
      default:
        setIsActive(false)
        break
    }
  }, [currentResetType, resetPasswordModel.resetTypes])

  // Handlers de navegação
  const handleVerificationSubmit = useCallback(async (_formData) => {
    // Simular validação do código
    // Em caso real, validar com API
    navigate(resetPasswordModel.getResetPasswordRoute())
    return { success: true, message: 'Código verificado com sucesso!' }
  }, [navigate, resetPasswordModel])

  const handleNewPasswordSubmit = useCallback(async (_formData) => {
    // Simular redefinição de senha
    // Em caso real, enviar nova senha para API
    navigate(resetPasswordModel.getLoginRoute())
    return { success: true, message: 'Senha redefinida com sucesso!' }
  }, [navigate, resetPasswordModel])

  const handleBackToLogin = useCallback(() => {
    navigate(resetPasswordModel.getLoginRoute())
  }, [navigate, resetPasswordModel])

  const handleGoToNewPassword = useCallback(() => {
    setIsActive(true)
    navigate(resetPasswordModel.getResetPasswordRoute())
  }, [navigate, resetPasswordModel])

  const handleGoToVerification = useCallback(() => {
    setIsActive(false)
    navigate(resetPasswordModel.getVerificationRoute())
  }, [navigate, resetPasswordModel])

  // Configurações de CSS para animações (iguais ao AuthView)
  const getContainerClasses = () => ({
    base: 'relative w-full h-full bg-brand-white overflow-hidden transition-all duration-700 ease-in-out',
    active: isActive ? 'active' : ''
  })

  const getVerificationPanelStyles = () => ({
    transform: isActive ? 'translateX(calc(100% + 66.67%))' : 'translateX(0%)',
    opacity: isActive ? 0 : 1,
    visibility: isActive ? 'hidden' : 'visible',
    transition: isActive
      ? 'transform 0.7s ease-in-out, opacity 0.35s ease-in-out, visibility 0s 0.35s'
      : 'transform 0.7s ease-in-out, opacity 0.35s 0.35s ease-in-out, visibility 0s',
    pointerEvents: isActive ? 'none' : 'auto'
  })

  const getNewPasswordPanelStyles = () => ({
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
  const verificationFormConfig = resetPasswordModel.getFormConfig(resetPasswordModel.resetTypes.VERIFICATION)
  const newPasswordFormConfig = resetPasswordModel.getFormConfig(resetPasswordModel.resetTypes.NEW_PASSWORD)
  const leftPanelContent = resetPasswordModel.getLeftPanelContent(currentResetType)
  const rightPanelContent = resetPasswordModel.getRightPanelContent()

  return {
    // Estado
    isActive,
    currentResetType,

    // Handlers
    handleVerificationSubmit,
    handleNewPasswordSubmit,
    handleBackToLogin,
    handleGoToNewPassword,
    handleGoToVerification,

    // Configurações de estilo
    getContainerClasses,
    getVerificationPanelStyles,
    getNewPasswordPanelStyles,
    getToggleContainerClasses,
    getGradientClasses,
    getLeftPanelClasses,
    getRightPanelClasses,

    // Dados do modelo
    verificationFormConfig,
    newPasswordFormConfig,
    leftPanelContent,
    rightPanelContent
  }
}
