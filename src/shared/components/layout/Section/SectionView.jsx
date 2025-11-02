import { getSectionThemeClasses } from '@shared/styles/theme'

/**
 * SectionView - Componente de seção
 * @param {React.ReactNode} children - Conteúdo da seção
 * @param {string} backgroundColor - Cor de fundo ('white', 'white-secondary', 'pink', 'pinkGradient')
 * @param {string} className - Classes CSS adicionais (podem sobrescrever padding e gap padrões)
 */
export function SectionView({
  children,
  className = '',
  ...props
}) {

  const getSectionClasses = () => {
    return [getSectionThemeClasses(),
      className]
      .filter(Boolean)
      .join(' ')
  }

  return (
    <section id={props.id} className={getSectionClasses()}>
      {children}
    </section>
  )
}
