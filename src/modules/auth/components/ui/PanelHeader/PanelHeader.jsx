import { BackButtonView } from '@shared/components/ui/BackButton/BackButtonView'
import { LogoView } from '@shared/components/ui/Logo/LogoView'

export function PanelHeader({ variant = 'signIn' }) {
  if (variant === 'rightPanel') {
    return <LogoView className="text-default-light fill-current" />
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
