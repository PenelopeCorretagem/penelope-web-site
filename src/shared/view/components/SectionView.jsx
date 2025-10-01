import { useSectionViewModel } from '@shared/hooks/components/useSectionViewModel'

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
