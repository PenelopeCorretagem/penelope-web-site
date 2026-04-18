import { FormView } from '@shared/components/ui/Form/FormView'
import { TextView } from '@shared/components/ui/Text/TextView'
import { BackButtonView } from '@shared/components/ui/BackButton/BackButtonView'
import { PanelHeader } from '../PanelHeader/PanelHeader'
import { getAuthSignUpPanelThemeClasses, getAuthBackButtonThemeClasses, getAuthLinkContainerThemeClasses, getAuthLinkButtonThemeClasses } from '@shared/styles/theme'

export function SignUpPanel({
  isActive,
  signUpFormConfig,
  isLoading,
  isForgotPassword,
  forgotPasswordFormConfig,
  onBackToLogin,
  onLogin,
  onRegisterSubmit,
  onForgotPasswordSubmit
}) {
  return (
    <div className={getAuthSignUpPanelThemeClasses({ isActive })}>
      <div className="flex justify-start w-full md:hidden">
        <BackButtonView className="text-distac-primary" />
      </div>
      <div className={getAuthBackButtonThemeClasses({ variant: 'rightPanel', className: 'hidden md:flex' })}>
        <PanelHeader variant="rightPanel" />
      </div>

      <div className="flex-1 flex items-center justify-center">
        {isForgotPassword ? (
          <div className="w-full">
            <FormView
              title={forgotPasswordFormConfig.title}
              subtitle={forgotPasswordFormConfig.subtitle}
              fields={forgotPasswordFormConfig.fields}
              submitText={forgotPasswordFormConfig.submitText}
              onSubmit={onForgotPasswordSubmit}
              isLoading={isLoading}
            />

            <TextView className={getAuthLinkContainerThemeClasses({ className: 'mt-6' })}>
              Lembrou a senha?
              <button
                onClick={onBackToLogin}
                className={getAuthLinkButtonThemeClasses()}
              >
                Acessar
              </button>
            </TextView>
          </div>
        ) : (
          <div className="w-full">
            <FormView
              title={signUpFormConfig.title}
              subtitle={signUpFormConfig.subtitle}
              fields={signUpFormConfig.fields}
              submitText={signUpFormConfig.submitText}
              onSubmit={onRegisterSubmit}
              isLoading={isLoading}
            />

            <TextView className={getAuthLinkContainerThemeClasses({ className: 'mt-4 md:hidden' })}>
              Já tem conta?
              <button
                onClick={onLogin}
                className={getAuthLinkButtonThemeClasses()}
              >
                Acessar
              </button>
            </TextView>
          </div>
        )}
      </div>
    </div>
  )
}
