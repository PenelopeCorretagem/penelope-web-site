import { LogoView } from '@shared/components/ui/Logo/LogoView'

/**
 * LoadingView - Página de carregamento
 */
export function LoadingView() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-distac-primary">
      <div className="animate-pulse flex items-center justify-center">
        <LogoView variant="mark" height="120" className="text-white fill-current drop-shadow-2xl" />
      </div>
    </div>
  )
}
