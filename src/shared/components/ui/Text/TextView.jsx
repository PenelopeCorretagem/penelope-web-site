import { useTextViewModel } from '@shared/components/ui/Text/useTextViewModel'

/**
 * TextView - Componente base para textos
 * Aplica estilos padrão de texto com responsividade usando MVVM
 * @param {Node} children - Conteúdo do texto
 * @param {string} className - Classes CSS adicionais
 */
export function TextView({
  children,
  className = ''
}) {
  // Usa o ViewModel para gerenciar CSS
  const {
    hasContent,
    hasErrors,
    errorMessages,
    finalClassName,
  } = useTextViewModel({
    children,
    className,
  })

  if (!hasContent && !children) {
    return null
  }

  return (
    <p
      className={finalClassName}
      role="text"
      aria-invalid={hasErrors}
      title={hasErrors ? errorMessages : undefined}
    >
      {children}
    </p>
  )
}
