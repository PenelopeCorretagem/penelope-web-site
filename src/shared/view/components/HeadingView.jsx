/**
 * Heading - Componente de título
 * Renderiza títulos com diferentes níveis e cores
 * @param {Node} children - Conteúdo do título
 * @param {number} level - Nível do título (1-6)
 * @param {string} color - Cor do título ('black'|'pink'|'white'|'softBrown')
 * @param {string} className - Classes CSS adicionais
 */
export function HeadingView({ children, level, color = 'black', className = '' }) {
  const Component = `h${level}`

  const levels = {
    1: 'text-[28px] font-bold md:text-[44px]',
    2: 'text-[24px] font-semibold md:text-[38px]',
    3: 'text-[20px] font-semibold md:text-[32px]',
    4: 'text-[16px] font-medium md:text-[26px]',
    5: 'text-[12px] font-medium md:text-[20px]',
    6: 'text-[8px] font-normal md:text-[14px]',
  }
  const colors = {
    black: 'text-brand-black',
    pink: 'text-brand-pink',
    white: 'text-brand-white',
    softBrown: 'text-brand-soft-brown',
  }

  // Função para mesclar classes removendo conflitos de font-weight
  const mergeClasses = (baseClasses, customClasses) => {
    const base = baseClasses.split(' ')
    const custom = customClasses.split(' ')

    // Remove classes de font-weight conflitantes se houver uma personalizada
    const fontWeightClasses = ['font-thin', 'font-extralight', 'font-light', 'font-normal', 'font-medium', 'font-semibold', 'font-bold', 'font-extrabold', 'font-black']
    const hasCustomFontWeight = custom.some(cls => fontWeightClasses.includes(cls))

    let finalClasses = base
    if (hasCustomFontWeight) {
      finalClasses = base.filter(cls => !fontWeightClasses.includes(cls))
    }

    return [...finalClasses, ...custom].join(' ')
  }

  const baseClasses = `w-fit font-title-family leading-none uppercase ${levels[level] ?? levels[1]} ${colors[color]}`
  const finalClassName = className ? mergeClasses(baseClasses, className) : baseClasses

  return (
    <Component className={finalClassName}>
      {children}
    </Component>
  )
}
