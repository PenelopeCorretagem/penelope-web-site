import { useSectionViewModel } from '@shared/components/layout/Section/useSectionViewModel'

/**
 * SectionView - Componente de seção
 * @param {React.ReactNode} children - Conteúdo da seção
 * @param {string} backgroundColor - Cor de fundo ('white', 'white-secondary', 'pink', 'pinkGradient')
 * @param {string} paddingClasses - Classes de padding
 * @param {string} gapClasses - Classes de espaçamento
 * @param {string} className - Classes CSS adicionais
 */
export function SectionView({
  children,
  backgroundColor = 'white',
  paddingClasses = 'p-section md:p-section-md',
  gapClasses = 'gap-section md:gap-section-md',
  className = '',
}) {
  const { getSectionClasses, hasErrors, errorMessages } = useSectionViewModel({
    children,
    backgroundColor,
    paddingClasses,
    gapClasses,
    className,
  })

  return (
    <section className={getSectionClasses()}>
      {hasErrors && (
        <div className="text-red-500 text-sm mb-2">
          Erro: {errorMessages}
        </div>
      )}
      {children}
    </section>
  )
}
