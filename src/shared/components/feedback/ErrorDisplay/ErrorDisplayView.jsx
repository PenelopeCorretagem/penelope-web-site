import { AlertTriangle, Lock, FileX, Shield } from 'lucide-react'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
/**
 * ErrorDisplay - Componente reutilizável para exibição de erros
 * @param {Object} props
 * @param {string[]} props.messages - Lista de mensagens de erro
 * @param {string} props.position - Posição do erro (top, bottom, inline)
 * @param {string} props.variant - Variante visual (subtle, prominent)
 * @param {string} props.className - Classes CSS adicionais
 * @param {string|number} props.type - Tipo de erro (404, 403, 401) ou generic
 * @param {function} props.onBack - Função para voltar (opcional)
 */
export function ErrorDisplayView({
  messages = [],
  position = 'bottom',
  className = '',
  type = 'generic',
}) {
  const errorConfig = {
    404: {
      icon: FileX,
      defaultMessage: 'Página não encontrada',
    },
    403: {
      icon: Shield,
      defaultMessage: 'Acesso não autorizado',
    },
    401: {
      icon: Lock,
      defaultMessage: 'Token de autenticação necessário',
    },
    generic: {
      icon: AlertTriangle,
      defaultMessage: 'Erro encontrado',
    },
  }

  const config = errorConfig[type] || errorConfig.generic
  const Icon = config.icon

  // Use default message if no messages provided
  const displayMessages = messages && messages.length > 0
    ? messages
    : [config.defaultMessage]

  if (!displayMessages || displayMessages.length === 0) return null

  const getPositionClasses = () => {
    const positions = {
      top: 'absolute top-0 left-0 right-0 -translate-y-full',
      bottom: 'absolute bottom-0 left-0 right-0 translate-y-full',
      inline: 'relative mt-1',
    }
    return positions[position] || positions.bottom
  }

  const containerClasses = [
    'flex flex-col items-center gap-3 px-4 py-3',
    getPositionClasses(),
    className
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div role='alert' aria-live='polite' className={containerClasses}>
      <div className="flex items-center gap-2 text-sm text-distac-primary">
        <span aria-hidden='true'>
          <Icon size={28} />
        </span>
        <HeadingView level={4}>{Array.isArray(displayMessages) ? displayMessages.join(', ') : displayMessages}</HeadingView>
      </div>
    </div>
  )
}
