import { FormView } from '@shared/components/ui/Form/FormView'
import { TextView } from '@shared/components/ui/Text/TextView'
import { PanelHeader } from '../../ui/PanelHeader/PanelHeader'

// Classes Tailwind diretas
const AUTH_SIGN_IN_PANEL_BASE = 'absolute top-0 left-0 w-full md:w-3/5 h-full bg-default-light z-20 p-section md:p-section-md flex flex-col items-center justify-center transition-all duration-700 ease-in-out'
const AUTH_SIGN_IN_PANEL_ACTIVE = 'translate-x-[166.67%] opacity-0 invisible pointer-events-none'
const AUTH_SIGN_IN_PANEL_INACTIVE = 'translate-x-0 opacity-100 visible pointer-events-auto'
const AUTH_BACK_BUTTON_SIGN_IN = 'flex justify-start w-full'
const AUTH_FORM_CONTAINER_CLASSES = 'flex-1 flex flex-col w-full items-center justify-center gap-subsection md:gap-subsection-md'
const AUTH_LINK_CONTAINER_CLASSES = 'text-default-dark-muted flex gap-1 items-center justify-center'
const AUTH_LINK_BUTTON_CLASSES = 'font-semibold text-distac-primary hover:underline bg-transparent border-none cursor-pointer p-0 min-h-0 h-auto inline-block'

function getAuthSignInPanelClasses(isActive) {
  return isActive ? `${AUTH_SIGN_IN_PANEL_BASE} ${AUTH_SIGN_IN_PANEL_ACTIVE}` : `${AUTH_SIGN_IN_PANEL_BASE} ${AUTH_SIGN_IN_PANEL_INACTIVE}`
}

export function VerificationPanel({ formConfig, onSubmit, isLoading, error, token, onBackToLogin, isActive }) {
  return (
    <div className={getAuthSignInPanelClasses(isActive)}>
      <div className={AUTH_BACK_BUTTON_SIGN_IN}>
        <PanelHeader variant="signIn" />
      </div>

      <div className={AUTH_FORM_CONTAINER_CLASSES}>
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

        <TextView className={AUTH_LINK_CONTAINER_CLASSES}>
          Lembrou a senha?
          <button
            onClick={onBackToLogin}
            className={AUTH_LINK_BUTTON_CLASSES}
          >
            Acessar
          </button>
        </TextView>
      </div>
    </div>
  )
}
