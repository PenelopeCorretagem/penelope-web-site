import { useLocation } from 'react-router-dom'
import { SectionView } from '@shared/components/layout/Section/SectionView'
import { AlertView } from '@shared/components/feedback/Alert/AlertView'
import { useAuthViewModel } from './useAuthViewModel'
import { SignInPanel } from '../../components/layout/SingInPanel/SignInPanel'
import { SignUpPanel } from '../../components/layout/SingUpPanel/SignUpPanel'
import { TogglePanelLeft } from '../../components/layout/TogglePanelLeft/TogglePanelLeft'
import { TogglePanelRight } from '../../components/layout/TogglePanelRight/TogglePanelRight'
import { AlertContent } from '../../components/layout/AlertContent/AlertContent'

// Classes Tailwind diretas
const AUTH_CONTAINER_BASE = 'relative w-full h-full bg-default-light overflow-hidden transition-all duration-700 ease-in-out'
const AUTH_TOGGLE_CONTAINER_BASE = 'hidden md:block absolute top-0 left-3/5 w-2/5 h-full overflow-hidden z-[1000] transition-all duration-700 ease-in-out'
const AUTH_TOGGLE_CONTAINER_ACTIVE = 'transform -translate-x-[150%]'
const AUTH_TOGGLE_CONTAINER_INACTIVE = 'transform translate-x-0'
const AUTH_GRADIENT_BASE = 'bg-distac-gradient h-full relative -left-full w-[200%] transform transition-all duration-700 ease-in-out'
const AUTH_GRADIENT_ACTIVE = 'translate-x-1/2'
const AUTH_GRADIENT_INACTIVE = 'translate-x-0'

function getAuthContainerClasses(isActive) {
  return AUTH_CONTAINER_BASE
}

function getAuthToggleContainerClasses(isActive) {
  return isActive ? `${AUTH_TOGGLE_CONTAINER_BASE} ${AUTH_TOGGLE_CONTAINER_ACTIVE}` : `${AUTH_TOGGLE_CONTAINER_BASE} ${AUTH_TOGGLE_CONTAINER_INACTIVE}`
}

function getAuthGradientClasses(isActive) {
  return isActive ? `${AUTH_GRADIENT_BASE} ${AUTH_GRADIENT_ACTIVE}` : `${AUTH_GRADIENT_BASE} ${AUTH_GRADIENT_INACTIVE}`
}

export function AuthView() {
  const location = useLocation()

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
      <div className={getAuthContainerClasses(isActive || isForgotPassword)}>

        {/* Sign In Form */}
        <SignInPanel
          key={`${location.pathname}-signin`}
          isActive={isActive || isForgotPassword}
          signInFormConfig={signInFormConfig}
          isLoading={isLoading}
          onForgotPassword={handleForgotPasswordClick}
          onLoginSubmit={handleLoginSubmit}
          onRegister={handleRegisterClick}
        />

        {/* Sign Up Form / Forgot Password Form */}
        <SignUpPanel
          key={`${location.pathname}-signup`}
          isActive={isActive || isForgotPassword}
          signUpFormConfig={signUpFormConfig}
          isLoading={isLoading}
          isForgotPassword={isForgotPassword}
          forgotPasswordFormConfig={forgotPasswordFormConfig}
          onForgotPassword={handleForgotPasswordClick}
          onBackToLogin={handleBackToLogin}
          onLogin={handleLoginClick}
          onRegisterSubmit={handleRegisterSubmit}
          onForgotPasswordSubmit={handleForgotPasswordSubmit}
        />

        {/* Toggle Container */}
        <div className={getAuthToggleContainerClasses(isActive || isForgotPassword)}>
          <div className={getAuthGradientClasses(isActive || isForgotPassword)}>

            {/* Toggle Left Panel */}
            <TogglePanelLeft
              content={leftPanelContent}
              onRegister={handleRegisterClick}
              onLogin={handleLoginClick}
              isActive={isActive || isForgotPassword}
            />

            {/* Toggle Right Panel */}
            <TogglePanelRight
              content={rightPanelContent}
              onRegister={handleRegisterClick}
              isActive={isActive || isForgotPassword}
              variant="auth"
            />

          </div>
        </div>
      </div>

      <AlertView
        isVisible={!!alertConfig}
        type={alertConfig?.type}
        message={alertConfig?.message}
        hasCloseButton={!alertConfig?.hideCloseButton}
        onClose={alertConfig?.onClose || handleCloseAlert}
        buttonsLayout='col'
      >
        <AlertContent
          alertConfig={alertConfig}
          onForgotPassword={handleAlertForgotPassword}
          onLogin={handleAlertLogin}
          onClose={handleCloseAlert}
        />
      </AlertView>

    </SectionView>
  )
}
