/**
 * SectionView - Componente de seção
 * @param {React.ReactNode} children - Conteúdo da seção
 * @param {string} className - Classes CSS adicionais
 */
export function SectionView({
  children,
  className = '',
  ...props
}) {
  const baseClasses = [
    'section',
    'flex',
    'w-full',
    'max-w-full',
    'h-fit',
    'bg-default-light',
    'p-section md:p-section-md',
    'gap-section md:gap-section-md',
    'overflow-hidden'
  ].join(' ')

  return (
    <section
      id={props.id}
      className={`${baseClasses} ${className}`}
    >
      {children}
    </section>
  )
}
