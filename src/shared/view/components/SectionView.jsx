import { SectionModel } from '@shared/model/components/SectionModel'
import { useSectionViewModel } from '@shared/hooks/components/useSectionViewModel'

export function SectionView({
  leftContent,
  rightContent,
  backgroundColor = 'white',
  className = '',
}) {
  const model = new SectionModel({ backgroundColor })
  const { validateBackgroundColor, hasErrors } = useSectionViewModel(model)

  // Mapeamento de cores lógicas para classes CSS (específico da view)
  const BACKGROUND_COLOR_CLASSES = {
    white: 'bg-brand-white',
    'white-secondary': 'bg-brand-white-secondary',
    pink: 'bg-brand-pink',
    pinkGradient: 'bg-brand-pink-gradient',
  }

  const getBackgroundColorClass = () => {
    const validColor = validateBackgroundColor()
    return BACKGROUND_COLOR_CLASSES[validColor]
  }

  const getSectionClasses = () => {
    return [
      'grid grid-cols-1 grid-rows-2 md:grid-cols-2 md:grid-rows-1 gap-6',
      'w-full h-fit p-section md:psection-md',
      getBackgroundColorClass(),
      className,
      hasErrors ? 'border-2 border-red-500' : '',
    ]
      .filter(Boolean)
      .join(' ')
  }

  return (
    <section className={getSectionClasses()}>
      <div className='flex h-fit w-full items-center justify-center md:justify-start'>
        {leftContent}
      </div>
      <div className='flex h-fit w-full items-center justify-center md:justify-end'>
        {rightContent}
      </div>
    </section>
  )
}
