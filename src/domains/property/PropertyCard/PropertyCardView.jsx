import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { TextView } from '@shared/components/ui/Text/TextView'
import { LabelView } from '@shared/components/ui/Label/LabelView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { usePropertyCardViewModel } from './usePropertyCardViewModel'

export function PropertyCardView({
  category,
  title,
  subtitle,
  description,
  differences = [],
  buttonState = 'simple',
  hasLabel = true,
  hasDifference = false,
  hasButton = false,
  hasShadow = false,
  hasImage = false,
  hasHoverEffect = false,
  imageUrl,
  onButtonClick,
  className = '',
}) {
  const {
    categoryLabel,
    buttons,
    formattedDifferences,
    shouldRenderButtons,
    shouldRenderImage,
    shouldRenderLabel,
    shouldRenderDifferences,
    containerClasses,
    cardClasses,
    labelPosition,
    buttonLayout,
    handleButtonClick,
    hasError,
    model
  } = usePropertyCardViewModel({
    category,
    title,
    subtitle,
    description,
    differences,
    buttonState,
    hasLabel,
    hasButton,
    hasShadow,
    hasImage,
    hasHoverEffect,
    imageUrl,
    onButtonClick,
    className
  })

  if (hasError) {
    return (
      <div className={`flex flex-col max-w-sm bg-default-light-alt p-card rounded-sm ${className}`}>
        <TextView className="text-distac-primary">Erro ao carregar propriedade</TextView>
      </div>
    )
  }

  const renderButtons = () => {
    if (!shouldRenderButtons) return null

    if (buttonLayout === 'grid') {
      const [gallery, floorplan, video] = buttons
      return (
        <div className="flex flex-col gap-3 w-full">
          <div className="flex gap-2 w-full">
            <ButtonView
              variant={gallery.variant}
              type={gallery.type}
              onClick={() => handleButtonClick(gallery.action)}
            >
              {gallery.text}
            </ButtonView>
            <ButtonView
              variant={floorplan.variant}
              type={floorplan.type}
              onClick={() => handleButtonClick(floorplan.action)}
            >
              {floorplan.text}
            </ButtonView>
          </div>
          <ButtonView
            variant={video.variant}
            type={video.type}
            onClick={() => handleButtonClick(video.action)}
          >
            {video.text}
          </ButtonView>
        </div>
      )
    }

    if (buttonLayout === 'column') {
      return (
        <div className="flex flex-col gap-3 w-full">
          {buttons.map((button, index) => (
            <ButtonView
              key={`button-${index}`}
              variant={button.variant}
              type={button.type}
              onClick={() => handleButtonClick(button.action)}
            >
              {button.text}
            </ButtonView>
          ))}
        </div>
      )
    }

    return buttons.map((button, index) => (
      <ButtonView
        key={`button-${index}`}
        variant={button.variant}
        type={button.type}
        onClick={() => handleButtonClick(button.action)}
        className="mt-auto"
      >
        {button.text}
      </ButtonView>
    ))
  }

  return (
    <div className={`${containerClasses} ${className}`}>
      {shouldRenderImage && (
        <div
          className='w-full h-48 bg-cover bg-center bg-no-repeat rounded-t-sm'
          style={{ backgroundImage: `url(${model.imageUrl})` }}
          role="img"
          aria-label={`Imagem do imóvel ${model.title}`}
        />
      )}

      <div className={cardClasses}>
        {shouldRenderLabel && (
          <LabelView model={categoryLabel} className={labelPosition} />
        )}

        <div className='flex flex-col gap-2 w-full pt-2 md:pt-3'>
          <HeadingView level={4} className="text-default-dark">
            {model.title}
          </HeadingView>
          <HeadingView level={5} className={`text-distac-primary`}>
            {model.subtitle}
          </HeadingView>
        </div>

        <TextView className='uppercase text-default-dark'>
          {model.description}
        </TextView>

        {hasDifference && shouldRenderDifferences && (
          <div className='gap-card md:gap-card-md grid w-full grid-cols-3'>
            {formattedDifferences.map((labelModel, index) => (
              <LabelView key={`difference-${index}`} model={labelModel} />
            ))}
          </div>
        )}

        {renderButtons()}
      </div>
    </div>
  )
}
