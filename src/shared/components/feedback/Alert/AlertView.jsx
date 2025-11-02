import { useState, useCallback } from 'react'
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { TextView } from '@shared/components/ui/Text/TextView'

// Mapeamento de ícones por tipo de alerta
const alertIcons = {
  warning: <AlertTriangle size={64} className="text-default-light" />,
  info: <Info size={64} className="text-default-light" />,
  error: <XCircle size={64} className="text-default-light" />,
  success: <CheckCircle size={64} className="text-default-light" />,
}

const alertHeading = {
  warning: 'Aviso',
  info: 'Informação',
  error: 'Erro',
  success: 'Sucesso',
}

/**
 * Hook simples para gerenciar estado do alerta
 */
export function useAlert(initialVisible = false) {
  const [isVisible, setIsVisible] = useState(initialVisible)

  const show = useCallback(() => setIsVisible(true), [])
  const hide = useCallback(() => setIsVisible(false), [])
  const toggle = useCallback(() => setIsVisible(prev => !prev), [])

  return { isVisible, show, hide, toggle }
}

/**
 * Componente de alerta flutuante
 */
export function AlertView({
  isVisible = false,
  hasCloseButton = true,
  type = 'info',
  message = '',
  children = null,
  onClose = () => {},
  className = '',
}) {
  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Fundo escuro */}
      <div
        className="absolute inset-0 bg-default-dark opacity-70"
        onClick={handleClose}
        role="button"
        tabIndex={0}
        aria-label="Fechar alerta"
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') handleClose()
        }}
      />

      {/* Container do alerta */}
      <div
        className={`
          relative
          bg-default-light
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
        {/* Header: ícone + botão fechar */}
        <div className="flex items-center justify-center w-full p-card-md md:p-card-md bg-distac-primary">
          {alertIcons[type] || alertIcons.info}
        </div>

        {/* Conteúdo: mensagem + children */}
        <div className="flex flex-col justify-center items-center flex-1 w-full p-card-md md:p-card-md gap-card md:gap-card-md">
          {message && (
            <>
              <HeadingView level={3} className="text-center text-distac-primary">
                {alertHeading[type] || alertHeading.info}
              </HeadingView>
              <TextView className="text-center">{message}</TextView>
            </>
          )}
          <div className="flex justify-between items-center w-full">
            {children}
            {hasCloseButton ? (
              <ButtonView
                type="button"
                shape="square"
                color="border-distac-primary"
                onClick={handleClose}
                aria-label="Fechar alerta"
                width="fit"
              >
                Fechar
              </ButtonView>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
