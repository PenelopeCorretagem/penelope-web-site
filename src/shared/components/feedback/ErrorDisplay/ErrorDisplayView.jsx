/**
 * ErrorDisplay - Componente reutilizável para exibição de erros
 * @param {Object} props
 * @param {string[]} props.messages - Lista de mensagens de erro
 * @param {string} props.position - Posição do erro (top, bottom, inline)
 * @param {string} props.variant - Variante visual (subtle, prominent)
 * @param {string} props.className - Classes CSS adicionais
 */
export function ErrorDisplayView({
  messages = [],
  position = 'bottom',
  variant = 'subtle',
  className = '',
}) {
  if (!messages || messages.length === 0) return null

  const getPositionClasses = () => {
    const positions = {
      top: 'absolute top-0 left-0 right-0 -translate-y-full',
      bottom: 'absolute bottom-0 left-0 right-0 translate-y-full',
      inline: 'relative mt-1',
    }
    return positions[position] || positions.bottom
  }

  const getVariantClasses = () => {
    const variants = {
      subtle: 'border-b border-red-200 bg-red-50 px-4 py-2',
      prominent: 'border-2 border-red-500 bg-red-100 px-4 py-3',
    }
    return variants[variant] || variants.subtle
  }

  const containerClasses = [
    'flex items-center gap-2',
    getPositionClasses(),
    getVariantClasses(),
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div role='alert' aria-live='polite' className={containerClasses}>
      <div className='flex items-center gap-2 text-sm text-red-600'>
        <span aria-hidden='true'>⚠️</span>
        <span>{Array.isArray(messages) ? messages.join(', ') : messages}</span>
      </div>
    </div>
  )
}
