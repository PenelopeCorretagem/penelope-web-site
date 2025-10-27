import { SectionView } from '@shared/components/layout/Section/SectionView'
import { useResetPasswordViewModel } from './useResetPasswordViewModel'
import { VerificationPanel } from '../../components/ui/VerificationPanel/VerificationPanel'
import { NewPasswordPanel } from '../../components/ui/NewPasswordPanel/NewPasswordPanel'
import { TogglePanelLeft } from '../../components/ui/TogglePanelLeft/TogglePanelLeft'
import { TogglePanelRight } from '../../components/ui/TogglePanelRight/TogglePanelRight'
import { ResetAlert } from '../../components/ui/ResetAlert/ResetAlert'
import {
  getAuthContainerThemeClasses,
  getAuthToggleContainerThemeClasses,
  getAuthGradientThemeClasses
} from '@shared/styles/theme'

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
      <div className={getAuthContainerThemeClasses({ isActive })}>

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
        <div className={getAuthToggleContainerThemeClasses({ isActive })}>
          <div className={getAuthGradientThemeClasses({ isActive })}>

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
