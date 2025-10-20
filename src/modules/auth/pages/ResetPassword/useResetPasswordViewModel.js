import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { ResetPasswordModel } from './ResetPasswordModel'
import { validateResetToken, resetPassword } from '../../../../shared/services/apiService'

export function useResetPasswordViewModel() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams();
  const location = useLocation()
  const resetPasswordModel = useMemo(() => new ResetPasswordModel(), [])

  // Estados principais da sua lógica de animação
  const [isActive, setIsActive] = useState(false)
  const currentResetType = resetPasswordModel.getResetTypeFromRoute(location.pathname)

  // Estados para a API e formulários
  const [validToken, setValidToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [alertConfig, setAlertConfig] = useState(null);

  const handleCloseAlert = useCallback(() => {
    setAlertConfig(null);
  }, []);

  // Sincroniza o estado 'isActive' com a rota atual
  useEffect(() => {
    setIsActive(currentResetType === resetPasswordModel.resetTypes.NEW_PASSWORD);
  }, [currentResetType, resetPasswordModel.resetTypes]);

  // Efeito para validar o token da URL assim que a página carrega
  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      const validate = async () => {
        setIsLoading(true);
        setError('');
        try {
          // 1. Valida o token com a API
          await validateResetToken(tokenFromUrl);
          // 2. Salva o token validado no estado
          setValidToken(tokenFromUrl);
          // 3. Navega para a tela de nova senha (o que aciona a animação)
          navigate(resetPasswordModel.getResetPasswordRoute(), { state: { token: tokenFromUrl } });
        } catch (err) {
          setError('Link de redefinição inválido ou expirado.');
        } finally {
          setIsLoading(false);
        }
      };
      validate();
    }
  }, [searchParams, navigate, resetPasswordModel]); // Dependências corrigidas

  // Handler para o formulário de verificação (se o usuário digitar o código)
  const handleVerificationSubmit = useCallback(async (formData) => {
    setIsLoading(true);
    setError('');
    try {
      await validateResetToken(formData.token);
      setValidToken(formData.token);
      // Navega para a próxima etapa, passando o token
      navigate(resetPasswordModel.getResetPasswordRoute(), { state: { token: formData.token } });
    } catch (err) {
      setError(err.response?.data?.message || 'Código inválido ou expirado.');
    } finally {
      setIsLoading(false);
    }
  }, [navigate, resetPasswordModel]); // Dependências corrigidas

  // Handler para o formulário de nova senha
  const handleNewPasswordSubmit = useCallback(async (formData) => {
    // Busca o token do estado da navegação (preferencial) ou do estado do hook
    const token = location.state?.token || validToken;

    if (!token) {
      const msg = 'Token de sessão perdido. Por favor, tente novamente.';
      setError(msg);
      setAlertConfig({ type: 'error', message: msg, onClose: handleCloseAlert });
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      const msg = 'As senhas não coincidem.';
      setError(msg);
      setAlertConfig({ type: 'error', message: msg, onClose: handleCloseAlert });
      return;
    }

    setIsLoading(true);
    setError('');
    setAlertConfig(null);

    try {
      await resetPassword({ token, newPassword: formData.newPassword });
      setAlertConfig({
        type: 'success',
        message: 'Senha redefinida com sucesso!',
        onClose: () => {
          setAlertConfig(null);
          navigate('/auth');
        }
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Ocorreu um erro ao redefinir a senha.';
      setError(errorMessage);
      setAlertConfig({ type: 'error', message: errorMessage, onClose: handleCloseAlert });
    } finally {
      setIsLoading(false);
    }
  }, [navigate, location.state, validToken, handleCloseAlert]); // 'handleCloseAlert' adicionado

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
    alertConfig,

    // Handlers
    handleVerificationSubmit,
    handleNewPasswordSubmit,
    handleBackToLogin,
    handleGoToNewPassword,
    handleGoToVerification,
    handleCloseAlert : () => setAlertConfig(null),

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
