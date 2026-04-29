import { useCallback } from 'react'
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
 * @property {boolean}  [disabled]    - Desabilita a ação
 */

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
  disableBackdropClose = false,
}) {
  const handleClose = useCallback(() => onClose(), [onClose])
  const rowAlignment = 'justify-center gap-card md:gap-card-md flex-wrap'

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <button
        type="button"
        className={`absolute inset-0 border-0 bg-default-dark opacity-70 ${disableBackdropClose ? 'cursor-not-allowed' : ''}`}
        onClick={disableBackdropClose ? undefined : handleClose}
        disabled={disableBackdropClose}
        aria-label="Fechar alerta"
      />

      {/* Card */}
      <div
        className={`
          relative bg-default-light rounded-sm shadow-2xl w-80%
          md:w-xl min-h-[300px] flex flex-col items-center
          transition-all duration-300 scale-100 overflow-hidden
          ${className}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-center w-full p-card-md md:p-card-md bg-distac-primary">
          {alertIcons[type] ?? alertIcons.info}
        </div>

        {/* Body */}
        <div className="flex flex-col justify-center items-center flex-1 w-full p-card-md md:p-card-md gap-card-md">
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
                width={action.width ?? 'full'}
                className="flex-1"
                aria-label={action.ariaLabel ?? action.label}
                onClick={action.onClick}
                disabled={action.disabled}
              >
                {action.label}
              </ButtonView>
            ))}

            {/* Escape hatch: JSX livre */}
            {children && (
              <div className={`flex-1 ${buttonsLayout === 'col' ? 'w-full text-center' : ''}`}>
                {children}
              </div>
            )}

            {/* Fechar — sempre por último */}
            {hasCloseButton && (
              <ButtonView
                type="button"
                shape="square"
                color="border-distac-primary"
                width="full"
                className="flex-1"
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
