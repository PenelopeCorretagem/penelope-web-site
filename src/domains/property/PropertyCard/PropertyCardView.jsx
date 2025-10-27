import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { TextView } from '@shared/components/ui/Text/TextView'
import { LabelView } from '@shared/components/ui/Label/LabelView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { usePropertyCardViewModel } from '@domains/property/PropertyCard/usePropertyCardViewModel'

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
  onButtonClick,
}) {
  const {
    categoryLabel,
    button: buttonProps,
    formattedDifferences,
    hasDifferences,
    handleButtonClick,
    hasError
  } = usePropertyCardViewModel({
    category,
    title,
    subtitle,
    description,
    differences,
    onButtonClick
  })

  if (hasError) {
    return (
      <div className="flex flex-col max-w-sm bg-default-light-alt p-card rounded-sm">
        <TextView className="text-distac-primary">Erro ao carregar propriedade</TextView>
      </div>
    )
  }

  const labelPosition = hasImage ? 'absolute top-0 -translate-y-1/2 left-[1.5rem]' : ''
  const containerClasses = [
    'flex flex-col max-w-sm transition-transform duration-200',
    hasHoverEffect ? 'hover:scale-105' : ''
  ].filter(Boolean).join(' ')

  const cardClasses = [
    'bg-default-light p-card md:p-card-md gap-card md:gap-card-md',
    'flex w-full flex-col items-start relative',
    hasImage ? 'rounded-b-sm' : 'rounded-sm',
    hasShadow ? 'drop-shadow-md' : ''
  ].filter(Boolean).join(' ')

  return (
    <div className={containerClasses}>
      {hasImage && imageUrl && (
        <div
          className='w-full h-48 bg-cover bg-center bg-no-repeat rounded-t-sm'
          style={{ backgroundImage: `url(${imageUrl})` }}
          role="img"
          aria-label={`Imagem do imóvel ${title}`}
        />
      )}

      <div className={cardClasses}>
        {hasLabel && categoryLabel && (
          <LabelView model={categoryLabel} className={labelPosition} />
        )}

        <div className='flex flex-col gap-2 w-full pt-2 md:pt-3'>
          <HeadingView level={4} className="text-default-dark">
            {title}
          </HeadingView>
          <HeadingView level={5} className={`text-distac-primary`}>
            {subtitle}
          </HeadingView>
        </div>

        <TextView className='uppercase text-default-dark'>
          {description}
        </TextView>

        {hasDifference && hasDifferences && (
          <div className='gap-card md:gap-card-md grid w-full grid-cols-3'>
            {formattedDifferences.map((labelModel, index) => (
              <LabelView key={`difference-${index}`} model={labelModel} />
            ))}
          </div>
        )}

        {hasButton && buttonProps && (
          <ButtonView
            variant={buttonProps.variant}
            type={buttonProps.type}
            onClick={handleButtonClick}
            className="mt-auto"
          >
            {buttonProps.text}
          </ButtonView>
        )}
      </div>
    </div>
  )
}
