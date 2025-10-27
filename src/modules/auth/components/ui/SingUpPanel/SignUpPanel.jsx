import { FormView } from '@shared/components/ui/Form/FormView'
import { TextView } from '@shared/components/ui/Text/TextView'
import { PanelHeader } from '../PanelHeader/PanelHeader'
import { getAuthSignUpPanelThemeClasses, getAuthBackButtonThemeClasses, getAuthLinkContainerThemeClasses, getAuthLinkButtonThemeClasses } from '@shared/styles/theme'

export function SignUpPanel({
  isActive,
  signUpFormConfig,
  isLoading,
  isForgotPassword,
  forgotPasswordFormConfig,
  onForgotPassword,
  onBackToLogin,
  onRegisterSubmit,
  onForgotPasswordSubmit
}) {
  return (
    <div className={getAuthSignUpPanelThemeClasses({ isActive })}>
      <div className={getAuthBackButtonThemeClasses({ variant: 'rightPanel' })}>
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
          <FormView
            title={signUpFormConfig.title}
            subtitle={signUpFormConfig.subtitle}
            fields={signUpFormConfig.fields}
            submitText={signUpFormConfig.submitText}
            onSubmit={onRegisterSubmit}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  )
}
