import { useState } from 'react'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { TextView } from '@shared/components/ui/Text/TextView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { PanelHeader } from '../PanelHeader/PanelHeader'

// Classes Tailwind diretas
const AUTH_RIGHT_PANEL_BASE = 'absolute right-0 w-1/2 h-full p-section md:p-section-md flex flex-col top-0 transition-all duration-700 ease-in-out'
const AUTH_RIGHT_PANEL_ACTIVE = 'transform translate-x-[200%]'
const AUTH_RIGHT_PANEL_INACTIVE = 'transform translate-x-0'
const AUTH_BACK_BUTTON_RIGHT_PANEL = 'flex justify-end w-full'
const AUTH_PANEL_CONTENT_CLASSES = 'w-full text-center flex-1 flex flex-col items-center justify-center gap-subsection md:gap-subsection-md'
const AUTH_TOGGLE_BUTTON_CLASSES = ''

function getAuthRightPanelClasses(isActive) {
  return isActive ? `${AUTH_RIGHT_PANEL_BASE} ${AUTH_RIGHT_PANEL_ACTIVE}` : `${AUTH_RIGHT_PANEL_BASE} ${AUTH_RIGHT_PANEL_INACTIVE}`
}

export function TogglePanelRight({ content, onRegister, onBackToLogin, isActive, variant = 'auth' }) {
  const logoColor = !isActive ? 'white' : 'pink'

  return (
    <div className={getAuthRightPanelClasses(isActive)}>
      <div className={AUTH_BACK_BUTTON_RIGHT_PANEL}>
        <PanelHeader
          variant="rightPanel"
          logoColor={logoColor}
        />
      </div>

      <div className={AUTH_PANEL_CONTENT_CLASSES}>
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
            className={AUTH_TOGGLE_BUTTON_CLASSES}
            onClick={onBackToLogin}
          >
            {content.buttonText}
          </ButtonView>
        )}
      </div>
    </div>
  )
}
