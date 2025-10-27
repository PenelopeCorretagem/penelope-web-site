import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { TextView } from '@shared/components/ui/Text/TextView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { PanelHeader } from '../PanelHeader/PanelHeader'
import { getAuthRightPanelThemeClasses, getAuthBackButtonThemeClasses, getAuthPanelContentThemeClasses, getAuthToggleButtonThemeClasses } from '@shared/styles/theme'

export function TogglePanelRight({ content, onRegister, onBackToLogin, isActive, variant = 'auth' }) {
  return (
    <div className={getAuthRightPanelThemeClasses({ isActive })}>
      <div className={getAuthBackButtonThemeClasses({ variant: 'rightPanel' })}>
        <PanelHeader variant="rightPanel" />
      </div>

      <div className={getAuthPanelContentThemeClasses()}>
        <HeadingView level={1} className='text-default-light'>
          {variant === 'auth' ? (
            <>
              <span>É novo</span>
              <span className='mt-2 block'>por aqui?</span>
            </>
          ) : (
            content.title
          )}
        </HeadingView>

        <TextView className='text-default-light'>
          {content.subtitle}
        </TextView>

        {variant === 'auth' && onRegister ? (
          <ButtonView
            color="border-white"
            type="button"
            width="fit"
            shape="square"
            onClick={onRegister}
            aria-label="Alternar para formulário de cadastro"
          >
            {content.buttonText}
          </ButtonView>
        ) : (
          <ButtonView
            type="button"
            shape="square"
            width="fit"
            color="border-white"
            className={getAuthToggleButtonThemeClasses()}
            onClick={onBackToLogin}
          >
            {content.buttonText}
          </ButtonView>
        )}
      </div>
    </div>
  )
}
