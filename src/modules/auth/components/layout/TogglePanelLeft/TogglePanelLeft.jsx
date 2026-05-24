import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { TextView } from '@shared/components/ui/Text/TextView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { PanelHeader } from '../PanelHeader/PanelHeader'

// Classes Tailwind diretas
const AUTH_LEFT_PANEL_BASE = 'absolute w-1/2 h-full p-section md:p-section-md flex flex-col top-0 transition-all duration-700 ease-in-out'
const AUTH_LEFT_PANEL_ACTIVE = 'transform translate-x-0'
const AUTH_LEFT_PANEL_INACTIVE = 'transform -translate-x-[200%]'
const AUTH_BACK_BUTTON_LEFT_PANEL = 'flex justify-start w-full'
const AUTH_PANEL_CONTENT_CLASSES = 'w-full text-center flex-1 flex flex-col items-center justify-center gap-subsection md:gap-subsection-md'

function getAuthLeftPanelClasses(isActive) {
  return isActive ? `${AUTH_LEFT_PANEL_BASE} ${AUTH_LEFT_PANEL_ACTIVE}` : `${AUTH_LEFT_PANEL_BASE} ${AUTH_LEFT_PANEL_INACTIVE}`
}

export function TogglePanelLeft({ content, onRegister, onLogin, isActive }) {
  const handleButtonClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (content.buttonAction === 'register') {
      onRegister(e)
    } else {
      onLogin(e)
    }
  }

  return (
    <div className={getAuthLeftPanelClasses(isActive)}>
      <div className={AUTH_BACK_BUTTON_LEFT_PANEL}>
        <PanelHeader variant="leftPanel" />
      </div>

      <div className={AUTH_PANEL_CONTENT_CLASSES}>
        <HeadingView level={1} className='text-default-light'>
          {content.title}
        </HeadingView>

        <TextView className='text-default-light'>
          {content.subtitle}
        </TextView>

        {content.description && (
          <TextView className='text-default-light'>
            {content.description}
          </TextView>
        )}

        {content.buttonText && (
          <ButtonView
            color="border-white"
            type="button"
            width="fit"
            shape="square"
            onClick={handleButtonClick}
            aria-label={`Alternar para formulário de ${content.buttonAction}`}
            aria-pressed={content.buttonAction === 'register' ? isActive : !isActive}
          >
            {content.buttonText}
          </ButtonView>
        )}
      </div>
    </div>
  )
}
