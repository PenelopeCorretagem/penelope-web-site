import { BackButtonView } from '@shared/components/ui/BackButton/BackButtonView'
import { LogoView } from '@shared/components/ui/Logo/LogoView'
import { ROUTES } from '@shared/constants/routes'

export function PanelHeader({ variant = 'signIn', logoClassName = 'text-default-light fill-current' }) {
  if (variant === 'rightPanel') {
    return (
      <LogoView
        className={logoClassName}
        linkTo={ROUTES.HOME.path}
        linkClassName="inline-block transition-all duration-300 hover:scale-105"
        linkTitle="Ir para a página inicial"
        linkAriaLabel="Ir para a página inicial"
      />
    )
  }
  if (variant === 'leftPanel') {
    return (
      <BackButtonView
        className="text-default-light"
      />
    )
  }
  // Default SignIn variant
  return (
    <BackButtonView
      className="text-distac-primary"
    />
  )
}
