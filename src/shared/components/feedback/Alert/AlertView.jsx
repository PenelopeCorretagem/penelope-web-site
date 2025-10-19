import { X, AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react'
import { useAlertViewModel } from './useAlertViewModel'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'

// Mapeamento de ícones por tipo de alerta
const alertIcons = {
  warning: <AlertTriangle size={28} className="text-brand-white" />,
  info: <Info size={28} className="text-brand-white" />,
  error: <XCircle size={28} className="text-brand-white" />,
  success: <CheckCircle size={28} className="text-brand-white" />,
}

export function AlertView({
  isVisible = false,
  type = 'info',
  message = '',
  children = null,
  onClose = () => {},
  className = '',
}) {
  const { handleClose } = useAlertViewModel({
    isVisible,
    message,
    onClose,
    children,
    type,
  })

  if (!isVisible) return null


  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Fundo escuro */}
      <div
        className="absolute inset-0 bg-brand-black opacity-70"
        onClick={handleClose}
        role="button"
        tabIndex={0}
        aria-label="Fechar alerta"
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') handleClose()
        }}
      />
      {/* Container quadrado branco flutuante */}
      <div
        className={`
          relative
          bg-brand-white
          rounded-sm
          shadow-2xl
          w-xl
          min-h-[300px]
          flex flex-col
          items-center
          transition-all
          duration-300
          scale-100
          overflow-hidden
          ${className}
        `}
      >
        {/* Header: ícone + botão de fechar */}
        <div className="flex items-center justify-between w-full p-card-md md:p-card-md bg-brand-pink">
          <div className="flex items-center">
            {alertIcons[type] || alertIcons.info}
          </div>
          <ButtonView
            width="fit"
            variant="transparent"
            onClick={handleClose}
            className="p-0"
            aria-label="Fechar"
          >
            <X size={28} />
          </ButtonView>
        </div>

        {/* Conteúdo: mensagem + children, centralizados e espaçados */}
        <div className="flex flex-col justify-center items-center flex-1 w-full px-8 py-6 gap-4">
          {message && (
            <HeadingView level={3} className="text-center">
              {message}
            </HeadingView>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}
