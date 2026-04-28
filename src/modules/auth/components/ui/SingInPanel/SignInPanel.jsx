import { FormView } from '@shared/components/ui/Form/FormView'
import { TextView } from '@shared/components/ui/Text/TextView'
import { PanelHeader } from '../PanelHeader/PanelHeader'
import { getAuthFormContainerThemeClasses, getAuthBackButtonThemeClasses, getAuthLinkContainerThemeClasses, getAuthLinkButtonThemeClasses, getAuthSignInPanelThemeClasses } from '@shared/styles/theme'

export function SignInPanel({ isActive, signInFormConfig, isLoading, onForgotPassword, onLoginSubmit, onRegister }) {
  return (
    <div className={getAuthSignInPanelThemeClasses({ isActive })}>
      <div className={getAuthBackButtonThemeClasses({ variant: 'signIn' })}>
        <PanelHeader variant="signIn" />
      </div>

      <div className={getAuthFormContainerThemeClasses()}>
        <FormView
          title={signInFormConfig.title}
          subtitle={signInFormConfig.subtitle}
          fields={signInFormConfig.fields}
          submitText={signInFormConfig.submitText}
          onSubmit={onLoginSubmit}
          isLoading={isLoading}
        />

        <TextView className={getAuthLinkContainerThemeClasses()}>
          Esqueceu a senha?
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault()
              onForgotPassword()
            }}
            className={getAuthLinkButtonThemeClasses()}
          >
            Redefinir senha
          </button>
        </TextView>

        <TextView className={getAuthLinkContainerThemeClasses({ className: 'mt-4 md:hidden' })}>
          Não tem conta?
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault()
              onRegister()
            }}
            className={getAuthLinkButtonThemeClasses()}
          >
            Cadastre-se
          </button>
        </TextView>
      </div>
    </div>
  )
}
