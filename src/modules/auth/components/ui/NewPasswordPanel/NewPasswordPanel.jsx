import { FormView } from '@shared/components/ui/Form/FormView'
import { TextView } from '@shared/components/ui/Text/TextView'
import { PanelHeader } from '../PanelHeader/PanelHeader'
import { getAuthSignUpPanelThemeClasses, getAuthBackButtonThemeClasses, getAuthLinkContainerThemeClasses, getAuthLinkButtonThemeClasses } from '@shared/styles/theme'

export function NewPasswordPanel({ formConfig, onSubmit, isLoading, error, onBackToLogin, isActive }) {
  return (
    <div className={getAuthSignUpPanelThemeClasses({ isActive })}>
      <div className={getAuthBackButtonThemeClasses({ variant: 'rightPanel' })}>
        <PanelHeader variant="rightPanel" />
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="w-full">
          <FormView
            title={formConfig.title}
            subtitle={formConfig.subtitle}
            fields={formConfig.fields}
            submitText={formConfig.submitText}
            onSubmit={onSubmit}
            isLoading={isLoading}
            errorMessage={error}
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
      </div>
    </div>
  )
}
