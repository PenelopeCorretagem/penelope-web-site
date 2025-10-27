import { FormView } from '@shared/components/ui/Form/FormView'
import { TextView } from '@shared/components/ui/Text/TextView'
import { PanelHeader } from '../PanelHeader/PanelHeader'
import { getAuthSignInPanelThemeClasses, getAuthBackButtonThemeClasses, getAuthFormContainerThemeClasses, getAuthLinkContainerThemeClasses, getAuthLinkButtonThemeClasses } from '@shared/styles/theme'

export function VerificationPanel({ formConfig, onSubmit, isLoading, error, token, onBackToLogin, isActive }) {
  return (
    <div className={getAuthSignInPanelThemeClasses({ isActive })}>
      <div className={getAuthBackButtonThemeClasses({ variant: 'signIn' })}>
        <PanelHeader variant="signIn" />
      </div>

      <div className={getAuthFormContainerThemeClasses()}>
        <FormView
          title={formConfig.title}
          subtitle={formConfig.subtitle}
          fields={formConfig.fields}
          submitText={formConfig.submitText}
          onSubmit={onSubmit}
          isLoading={isLoading}
          errorMessage={error}
          initialValues={{ token }}
        />

        <TextView className={getAuthLinkContainerThemeClasses()}>
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
  )
}
