import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { TextView } from '@shared/components/ui/Text/TextView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { PanelHeader } from '../PanelHeader/PanelHeader'
import { getAuthLeftPanelThemeClasses, getAuthBackButtonThemeClasses, getAuthPanelContentThemeClasses } from '@shared/styles/theme'

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
    <div className={getAuthLeftPanelThemeClasses({ isActive })}>
      <div className={getAuthBackButtonThemeClasses({ variant: 'leftPanel' })}>
        <PanelHeader variant="leftPanel" />
      </div>

      <div className={getAuthPanelContentThemeClasses()}>
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
