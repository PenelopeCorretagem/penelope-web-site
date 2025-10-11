import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { TextView } from '@shared/components/ui/Text/TextView'
import { LabelView } from '@shared/components/ui/Label/LabelView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { usePropertyCardViewModel } from '@shared/components/ui/PropertyCard/usePropertyCardViewModel'

export function PropertyCardView({
  hasLabel = true,
  category,
  title,
  subtitle,
  description,
  hasDifference = false,
  differences = [],
  hasButton = false,
  hasShadow = false,
  hasImage = false,
  hasHoverEffect = false,
  imageUrl,
}) {
  const {
    categoryLabel,
    button: buttonProps,
    formattedDifferences,
    handleButtonClick,
  } = usePropertyCardViewModel({
    category,
    title,
    subtitle,
    description,
    differences,
  })

  const labelPosition = hasImage ? 'absolute top-0 -translate-y-1/2 left-[1.5rem]' : ''

  return (
    <div className={`flex flex-col max-w-sm ${hasHoverEffect ? 'hover:scale-105' : ''}`}>
      {hasImage && imageUrl && (
        <div
          className='w-full h-48 bg-cover bg-center bg-no-repeat rounded-t-sm'
          style={{
            backgroundImage: `url(${imageUrl})`
          }}
          role="img"
          aria-label="Imagem do imóvel"
        />
      )}
      <div
        className={`bg-brand-white-secondary p-card md:p-card-md gap-card md:gap-card-md flex w-full flex-col items-start ${hasImage ? 'rounded-b-sm' : 'rounded-sm'} ${hasShadow ? 'drop-shadow-md' : ''}`}
      >
        {hasLabel && <LabelView model={categoryLabel} className={labelPosition} />}
        <div className='flex flex-col gap-2'>
          <HeadingView level={3} className="text-brand-black">{title}</HeadingView>
          <HeadingView level={4} className={`text-brand-${categoryLabel.variant}`}>
            {subtitle}
          </HeadingView>
        </div>
        <TextView className='uppercase text-brand-black'>{description}</TextView>
        {hasDifference && (
        <div className='gap-card md:gap-card-md grid w-full grid-cols-3'>
          {formattedDifferences.map((labelModel, index) => (
            <LabelView key={index} model={labelModel} />
          ))}
        </div>
        )}
        {hasButton && (
          <ButtonView
            variant={buttonProps.variant}
            type={buttonProps.type}
            onClick={handleButtonClick}
          >
            {buttonProps.text}
          </ButtonView>
        )}
      </div>
    </div>
  )
}
