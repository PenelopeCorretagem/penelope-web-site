import { useSectionViewModel } from '@shared/components/layout/Section/useSectionViewModel'

export function SectionView({
  children,
  backgroundColor = 'white',
  paddingClasses = 'p-section md:p-section-md',
  gapClasses = 'gap-section md:gap-section-md',
  className = '',
  ...props
}) {
  const { getSectionClasses, hasErrors, errorMessages } = useSectionViewModel({
    children,
    backgroundColor,
    paddingClasses,
    gapClasses,
    className,
  })

  if (props.id) {
    console.log(`SectionView recebeu id: ${props.id}`)
  }

  return (
    <section id={props.id} className={getSectionClasses()}>
      {hasErrors && (
        <div className="text-red-500 text-sm mb-2">
          Erro: {errorMessages}
        </div>
      )}
      {children}
    </section>
  )
}
