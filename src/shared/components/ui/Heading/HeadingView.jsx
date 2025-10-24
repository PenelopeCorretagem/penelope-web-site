import { useHeadingFactory } from '@shared/components/ui/Heading/useHeadingViewModel'

/**
 * HeadingView - Componente de título
 * Renderiza títulos com diferentes níveis
 * @param {Node} children - Conteúdo do título
 * @param {number} level - Nível do título (1-6)
 * @param {string} color - Cor do título
 * @param {string} className - Classes CSS adicionais
 * @param {object} style - Estilos inline (sobrescreve classes CSS)
 */
export function HeadingView({
  children,
  level = 1,
  color = 'black',
  state = 'default',
  className = '',
  style = {},
  ...props
}) {
  const {
    componentTag,
    finalClassName,
    hasContent,
    hasErrors,
    errorMessages,
  } = useHeadingFactory({
    level,
    color,
    state,
    children,
    className,
  })

  if (!hasContent && !children) {
    return null
  }

  // Obtém o componente dinamicamente
  const Component = componentTag

  return (
    <Component
      className={finalClassName}
      style={style}
      role="heading"
      aria-level={level}
      aria-invalid={hasErrors}
      title={hasErrors ? errorMessages : undefined}
      {...props}
    >
      {children}
    </Component>
  )
}
