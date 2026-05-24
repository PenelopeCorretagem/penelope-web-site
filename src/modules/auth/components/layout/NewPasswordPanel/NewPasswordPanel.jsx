import { FormView } from '@shared/components/ui/Form/FormView'
import { TextView } from '@shared/components/ui/Text/TextView'
import { BackButtonView } from '@shared/components/ui/BackButton/BackButtonView'
import { PanelHeader } from '../PanelHeader/PanelHeader'

// Classes Tailwind diretas
const AUTH_SIGN_UP_PANEL_BASE = 'absolute top-0 right-0 w-full md:w-3/5 h-full bg-default-light p-section md:p-section-md flex flex-col transition-all duration-700 ease-in-out'
const AUTH_SIGN_UP_PANEL_ACTIVE = 'translate-x-0 opacity-100 visible z-50'
const AUTH_SIGN_UP_PANEL_INACTIVE = 'translate-x-[-166.67%] opacity-0 invisible z-10'
const AUTH_BACK_BUTTON_RIGHT_PANEL = 'flex justify-end w-full'
const AUTH_LINK_CONTAINER_CLASSES = 'text-default-dark-muted flex gap-1 items-center justify-center'
const AUTH_LINK_BUTTON_CLASSES = 'font-semibold text-distac-primary hover:underline bg-transparent border-none cursor-pointer p-0 min-h-0 h-auto inline-block'

function getAuthSignUpPanelClasses(isActive) {
  return isActive ? `${AUTH_SIGN_UP_PANEL_BASE} ${AUTH_SIGN_UP_PANEL_ACTIVE}` : `${AUTH_SIGN_UP_PANEL_BASE} ${AUTH_SIGN_UP_PANEL_INACTIVE}`
}

export function NewPasswordPanel({ formConfig, onSubmit, isLoading, error, onBackToLogin, isActive }) {
  return (
    <div className={getAuthSignUpPanelClasses(isActive)}>
      <div className="flex justify-start w-full md:hidden">
        <BackButtonView className="text-distac-primary" />
      </div>
      <div className={`${AUTH_BACK_BUTTON_RIGHT_PANEL} hidden md:flex`}>
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

          <TextView className={`${AUTH_LINK_CONTAINER_CLASSES} mt-6`}>
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
    </div>
  )
}
