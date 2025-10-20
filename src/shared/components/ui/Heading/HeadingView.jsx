import { useHeadingFactory } from '@shared/components/ui/Heading/useHeadingViewModel'

/**
 * HeadingView - Componente de título
 * Renderiza títulos com diferentes níveis
 * @param {Node} children - Conteúdo do título
 * @param {number} level - Nível do título (1-6)
 * @param {string} color - Cor do título
 * @param {string} className - Classes CSS adicionais
 */
export function HeadingView({
  children,
  level = 1,
  color = 'black',
  className = ''
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
      role="heading"
      aria-level={level}
      aria-invalid={hasErrors}
      title={hasErrors ? errorMessages : undefined}
    >
      {children}
    </Component>
  )
}
