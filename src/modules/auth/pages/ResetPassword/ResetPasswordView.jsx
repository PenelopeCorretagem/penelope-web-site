import { SectionView } from '@shared/components/layout/Section/SectionView'
import { useResetPasswordViewModel } from './useResetPasswordViewModel'
import { VerificationPanel } from '../../components/layout/VerificationPanel/VerificationPanel'
import { NewPasswordPanel } from '../../components/layout/NewPasswordPanel/NewPasswordPanel'
import { TogglePanelLeft } from '../../components/layout/TogglePanelLeft/TogglePanelLeft'
import { TogglePanelRight } from '../../components/layout/TogglePanelRight/TogglePanelRight'
import { ResetAlert } from '../../components/layout/ResetAlert/ResetAlert'

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

export function ResetPasswordView() {
  const {
    // Estado
    isActive,
    currentResetType,
    isLoading,
    error,
    token,
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
  } = useResetPasswordViewModel()

  return (
    <SectionView className="h-screen w-screen flex items-center justify-center overflow-hidden !p-0 !gap-0 md:!p-0 md:!gap-0">
      <div className={getAuthContainerClasses(isActive)}>

        {/* Verification Panel */}
        <VerificationPanel
          formConfig={verificationFormConfig}
          onSubmit={handleVerificationSubmit}
          isLoading={isLoading}
          error={error}
          token={token}
          onBackToLogin={handleBackToLogin}
          isActive={isActive}
        />

        {/* New Password Panel */}
        <NewPasswordPanel
          formConfig={newPasswordFormConfig}
          onSubmit={handleNewPasswordSubmit}
          isLoading={isLoading}
          error={error}
          onBackToLogin={handleBackToLogin}
          isActive={isActive}
        />

        {/* Toggle Container */}
        <div className={getAuthToggleContainerClasses(isActive)}>
          <div className={getAuthGradientClasses(isActive)}>

            {/* Toggle Left Panel */}
            <TogglePanelLeft
              content={leftPanelContent}
              isActive={isActive}
            />

            {/* Toggle Right Panel */}
            <TogglePanelRight
              content={rightPanelContent}
              onBackToLogin={handleBackToLogin}
              isActive={isActive}
              variant="reset"
            />

          </div>
        </div>

      </div>

      <ResetAlert
        alertConfig={alertConfig}
        onClose={handleCloseAlert}
      />

    </SectionView>
  )
}
