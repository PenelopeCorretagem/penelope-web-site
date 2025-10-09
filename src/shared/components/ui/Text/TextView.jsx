/**
 * TextView - Componente base para textos
 * Aplica estilos padrão de texto com responsividade
 * @param {Node} children - Conteúdo do texto
 * @param {string} className - Classes CSS (incluindo cores)
 */
export function TextView({
  children,
  className = ''
}) {
  // Classes base do componente
  const baseClasses = [
    'font-default-family',
    'text-[12px]',
    'leading-none',
    'md:text-[16px]',
    'text-brand-black',
  ].join(' ')

  // Combina classes base com classes customizadas
  const finalClassName = className
    ? `${baseClasses} ${className}`
    : baseClasses

  if (!children) {
    return null
  }

  return (
    <p
      className={finalClassName}
      role="text"
    >
      {children}
    </p>
  )
}
