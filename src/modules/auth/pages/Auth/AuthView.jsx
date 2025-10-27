import { SectionView } from '@shared/components/layout/Section/SectionView'
import { AlertView } from '@shared/components/feedback/Alert/AlertView'
import { useAuthViewModel } from './useAuthViewModel'
import { SignInPanel } from '../../components/ui/SingInPanel/SignInPanel'
import { SignUpPanel } from '../../components/ui/SingUpPanel/SignUpPanel'
import { TogglePanelLeft } from '../../components/ui/TogglePanelLeft/TogglePanelLeft'
import { TogglePanelRight } from '../../components/ui/TogglePanelRight/TogglePanelRight'
import { AlertContent } from '../../components/ui/AlertContent/AlertContent'
import {
  getAuthContainerThemeClasses,
  getAuthToggleContainerThemeClasses,
  getAuthGradientThemeClasses
} from '@shared/styles/theme'

export function AuthView() {
  const {
    // Estado
    isActive,
    isForgotPassword,
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
  } = useAuthViewModel()

  const handleAlertForgotPassword = () => {
    handleCloseAlert()
    handleForgotPasswordClick()
  }

  const handleAlertLogin = () => {
    handleCloseAlert()
    handleLoginClick()
  }

  return (
    <SectionView className="h-screen w-screen flex items-center justify-center overflow-hidden !p-0 !gap-0 md:!p-0 md:!gap-0">
      <div className={getAuthContainerThemeClasses({ isActive })}>

        {/* Sign In Form */}
        <SignInPanel
          isActive={isActive}
          signInFormConfig={signInFormConfig}
          isLoading={isLoading}
          onForgotPassword={handleForgotPasswordClick}
          onLoginSubmit={handleLoginSubmit}
        />

        {/* Sign Up Form / Forgot Password Form */}
        <SignUpPanel
          isActive={isActive}
          signUpFormConfig={signUpFormConfig}
          isLoading={isLoading}
          isForgotPassword={isForgotPassword}
          forgotPasswordFormConfig={forgotPasswordFormConfig}
          onForgotPassword={handleForgotPasswordClick}
          onBackToLogin={handleBackToLogin}
          onRegisterSubmit={handleRegisterSubmit}
          onForgotPasswordSubmit={handleForgotPasswordSubmit}
        />

        {/* Toggle Container */}
        <div className={getAuthToggleContainerThemeClasses({ isActive })}>
          <div className={getAuthGradientThemeClasses({ isActive })}>

            {/* Toggle Left Panel */}
            <TogglePanelLeft
              content={leftPanelContent}
              onRegister={handleRegisterClick}
              onLogin={handleLoginClick}
              isActive={isActive}
            />

            {/* Toggle Right Panel */}
            <TogglePanelRight
              content={rightPanelContent}
              onRegister={handleRegisterClick}
              isActive={isActive}
              variant="auth"
            />

          </div>
        </div>
      </div>

      <AlertView
        isVisible={!!alertConfig}
        type={alertConfig?.type}
        message={alertConfig?.message}
        onClose={alertConfig?.onClose || handleCloseAlert}
      >
        <AlertContent
          alertConfig={alertConfig}
          onForgotPassword={handleAlertForgotPassword}
          onLogin={handleAlertLogin}
        />
      </AlertView>

    </SectionView>
  )
}
