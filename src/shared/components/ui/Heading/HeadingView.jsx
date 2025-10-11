/**
 * HeadingView - Componente de título
 * Renderiza títulos com diferentes níveis
 * @param {Node} children - Conteúdo do título
 * @param {number} level - Nível do título (1-6)
 * @param {string} className - Classes CSS (incluindo cores)
 */
export function HeadingView({
  children,
  level = 1,
  className = ''
}) {
  // Validação do nível
  const validLevel = (typeof level === 'number' && level >= 1 && level <= 6)
    ? Math.floor(level)
    : 1

  // Classes base por nível
  const levelClasses = {
    1: 'text-[28px] font-bold md:text-[44px]',
    2: 'text-[24px] font-semibold md:text-[38px]',
    3: 'text-[20px] font-semibold md:text-[32px]',
    4: 'text-[16px] font-medium md:text-[26px]',
    5: 'text-[12px] font-medium md:text-[20px]',
    6: 'text-[8px] font-normal md:text-[14px]',
  }

  // Classes base do componente
  const baseClasses = [
    'w-fit',
    'font-title-family',
    'leading-none',
    'uppercase',
    'text-brand-black',
    levelClasses[validLevel],
  ].join(' ')

  // Combina classes base com classes customizadas
  const finalClassName = className
    ? `${baseClasses} ${className}`
    : baseClasses

  // Obtém o componente dinamicamente
  const Component = `h${validLevel}`

  if (!children) {
    return null
  }

  return (
    <Component
      className={finalClassName}
      role="heading"
      aria-level={validLevel}
    >
      {children}
    </Component>
  )
}
