import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { TextView } from '@shared/components/ui/Text/TextView'
import { LabelView } from '@shared/components/ui/Label/LabelView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { usePropertyCardViewModel } from '@shared/components/ui/PropertyCard/usePropertyCardViewModel'
import { EPropertyCardCategory } from '@shared/components/ui/PropertyCard/EPropertyCardCategory.js'

export function PropertyDetailsCardView({
  hasLabel = true,
  category = EPropertyCardCategory.LANCAMENTO,
  title,
  subtitle,
  description,
  hasDifference = false,
  hasButton = false,
  hasShadow = false,
  hasImage = false,
  hasHoverEffect = false,
  imageUrl,
}) {
  const {
    categoryLabel,
    handleButtonClick,
  } = usePropertyCardViewModel({
    category,
    title,
    subtitle,
    description,
  })

  const buttonColorMap = {
    [EPropertyCardCategory.LANCAMENTO]: 'pink',
    [EPropertyCardCategory.EM_OBRAS]: 'soft-brown',
    [EPropertyCardCategory.DISPONIVEL]: 'brown',
  }
  const buttonColor = buttonColorMap[category] || 'pink'
  const labelPosition = hasImage ? 'absolute top-0 -translate-y-1/2 left-[1.5rem]' : ''

  return (
    <div className={`flex flex-col max-w-sm ${hasHoverEffect ? 'transition-transform hover:scale-105' : ''}`}>
      {hasImage && imageUrl && (
        <div
          className='w-full h-48 bg-cover bg-center bg-no-repeat rounded-t-sm'
          style={{ backgroundImage: `url(${imageUrl})` }}
          role="img"
          aria-label="Imagem do imóvel"
        />
      )}
      <div
        className={`bg-brand-white-secondary p-card md:p-card-md gap-card md:gap-card-md flex w-full flex-col items-start ${hasImage ? 'rounded-b-sm' : 'rounded-sm'} ${hasShadow ? 'drop-shadow-md' : ''}`}
      >
        {hasLabel && <LabelView model={categoryLabel} className={labelPosition} />}
        <div className='flex flex-col gap-2'>
          <HeadingView level={3}>{title}</HeadingView>
          <HeadingView level={4} className={`text-brand-${categoryLabel.variant}`}>
            {subtitle}
          </HeadingView>
        </div>
        <TextView className='uppercase'>{description}</TextView>
        {hasButton && (
          <div className="flex flex-col gap-3 w-full">
            <ButtonView
              variant={buttonColor}
              type="button"
              onClick={handleButtonClick}
            >
              Conversar pelo WhatsApp
            </ButtonView>
            <ButtonView
              variant="brown"
              type="button"
              onClick={handleButtonClick}
            >
              Agendar Visita
            </ButtonView>
          </div>
        )}
      </div>
    </div>
  )
}
