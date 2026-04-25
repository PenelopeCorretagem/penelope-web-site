import { useState, useCallback } from 'react'
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { TextView } from '@shared/components/ui/Text/TextView'

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
 * @typedef {Object} AlertAction
 * @property {string}    label        - Texto do botão
 * @property {Function}  onClick      - Callback ao clicar
 * @property {string}   [color]       - Variante de cor do ButtonView (padrão: 'distac-primary')
 * @property {string}   [shape]       - Forma do botão (padrão: 'square')
 * @property {string}   [width]       - Largura do botão (padrão: 'fit')
 * @property {string}   [ariaLabel]   - Acessibilidade
 */

export function useAlert(initialVisible = false) {
  const [isVisible, setIsVisible] = useState(initialVisible)

  const show = useCallback(() => setIsVisible(true), [])
  const hide = useCallback(() => setIsVisible(false), [])
  const toggle = useCallback(() => setIsVisible(prev => !prev), [])

  return { isVisible, show, hide, toggle }
}

/**
 * Componente de alerta flutuante.
 *
 * Ações podem ser passadas de duas formas (não use as duas ao mesmo tempo):
 *  - `actions` (preferido): array de { label, onClick, color?, shape?, width?, ariaLabel? }
 *  - `children`: JSX arbitrário para casos que `actions` não cobre
 *
 * O botão "Fechar" (hasCloseButton) é sempre renderizado por último.
 */
export function AlertView({
  isVisible = false,
  hasCloseButton = true,
  type = 'info',
  message = '',
  actions = [],        // <-- novo: array de ações declarativas
  children = null,     // mantido como escape hatch
  onClose = () => {},
  className = '',
  buttonsLayout = 'row',
}) {
  const handleClose = useCallback(() => onClose(), [onClose])

  // Total de elementos na linha de ações
  const totalActions = actions.length + (children ? 1 : 0) + (hasCloseButton ? 1 : 0)
  const rowAlignment =
    totalActions === 1 ? 'justify-center' :
      totalActions === 2 ? 'justify-between' :
        'justify-center gap-card md:gap-card-md flex-wrap'

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
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

      {/* Card */}
      <div
        className={`
          relative bg-default-light rounded-sm shadow-2xl
          w-xl min-h-[300px] flex flex-col items-center
          transition-all duration-300 scale-100 overflow-hidden
          ${className}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-center w-full p-card-md md:p-card-md bg-distac-primary">
          {alertIcons[type] ?? alertIcons.info}
        </div>

        {/* Body */}
        <div className="flex flex-col justify-center items-center flex-1 w-full p-card-md md:p-card-md gap-card md:gap-card-md">
          {message && (
            <>
              <HeadingView level={3} className="text-center text-distac-primary">
                {alertHeading[type] ?? alertHeading.info}
              </HeadingView>
              <TextView className="text-center">{message}</TextView>
            </>
          )}

          {/* Linha de ações */}
          <div
            className={`flex items-center w-full ${
              buttonsLayout === 'col'
                ? 'flex-col justify-center gap-card md:gap-card-md'
                : `flex-row ${rowAlignment}`
            }`}
          >
            {/* Ações declarativas */}
            {actions.map((action, index) => (
              <ButtonView
                key={index}
                type="button"
                shape={action.shape ?? 'square'}
                color={action.color ?? 'distac-primary'}
                width={action.width ?? 'fit'}
                aria-label={action.ariaLabel ?? action.label}
                onClick={action.onClick}
              >
                {action.label}
              </ButtonView>
            ))}

            {/* Escape hatch: JSX livre */}
            {children && (
              <div className={buttonsLayout === 'col' ? 'w-full text-center' : ''}>
                {children}
              </div>
            )}

            {/* Fechar — sempre por último */}
            {hasCloseButton && (
              <ButtonView
                type="button"
                shape="square"
                color="border-distac-primary"
                width="fit"
                aria-label="Fechar alerta"
                onClick={handleClose}
              >
                Fechar
              </ButtonView>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}