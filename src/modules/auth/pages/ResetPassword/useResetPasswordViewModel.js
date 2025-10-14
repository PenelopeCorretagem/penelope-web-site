import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { ResetPasswordModel } from './ResetPasswordModel'
import { validateResetToken, resetPassword } from '../../../../shared/services/apiService'

/**
 * useResetPasswordViewModel - ViewModel para gerenciar a lógica de redefinição de senha
 * Centraliza estado, navegação e lógica de apresentação
 */
export function useResetPasswordViewModel() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams();
  const location = useLocation()
  const resetPasswordModel = useMemo(() => new ResetPasswordModel(), [])

  const [isActive, setIsActive] = useState(false)
  const [status, setStatus] = useState('validating');

  const [validToken, setValidToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Estado computado baseado na rota atual
  const currentResetType = resetPasswordModel.getResetTypeFromRoute(location.pathname)

  useEffect(() => {
    setIsActive(currentResetType === resetPasswordModel.resetTypes.NEW_PASSWORD);
  }, [currentResetType, resetPasswordModel.resetTypes]);

   useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      const validate = async () => {
        setIsLoading(true);
        setError('');
        try {
          await validateResetToken(tokenFromUrl);
          setValidToken(tokenFromUrl);
          // SUCESSO: Navega para a próxima etapa, passando o token
          navigate(resetPasswordModel.getResetPasswordRoute(), { state: { token: tokenFromUrl } });
        } catch (err) {
          setError('Link de redefinição inválido ou expirado.');
        } finally {
          setIsLoading(false);
        }
      };
      validate();
    }
  }, [searchParams, navigate, resetPasswordModel]);

  // Handler para o formulário de verificação (caso o usuário chegue sem token)
  const handleVerificationSubmit = useCallback(async (formData) => {
    setIsLoading(true);
    setError('');
    try {
      await validateResetToken(formData.token);
      setValidToken(formData.token);
      navigate(resetPasswordModel.getResetPasswordRoute(), { state: { token: formData.token } });
    } catch (err) {
      setError(err.response?.data?.message || 'Código inválido ou expirado.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handler para o formulário de nova senha
  const handleNewPasswordSubmit = useCallback(async (formData) => {
    const tokenFromState = location.state?.token || validToken;
    if (!tokenFromState) {
        setError('Token de sessão perdido. Por favor, tente novamente.');
        return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await resetPassword({ token: tokenFromState, newPassword: formData.newPassword });
      alert('Senha redefinida com sucesso!');
      handleBackToLogin();
    } catch (err) {
      setError(err.response?.data?.message || 'Ocorreu um erro ao redefinir a senha.');
    } finally {
      setIsLoading(false);
    }
  }, [navigate, location.state, validToken]);

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
    token: searchParams.get('token') || '',
    isLoading,
    error,

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
