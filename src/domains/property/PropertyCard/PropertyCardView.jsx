import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { TextView } from '@shared/components/ui/Text/TextView'
import { LabelView } from '@shared/components/ui/Label/LabelView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { usePropertyCardViewModel } from './usePropertyCardViewModel'
import { Pencil, X } from 'lucide-react'

export function PropertyCardView({
  id,
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
  supportMode = false,
  onEdit,
  onDelete,
}) {
  const {
    categoryLabel,
    buttons,
    formattedDifferences,
    shouldRenderButtons,
    shouldRenderImage,
    shouldRenderLabel,
    shouldRenderDifferences,
    shouldRenderEditButtons,
    containerClasses,
    cardClasses,
    labelPosition,
    buttonLayout,
    handleButtonClick,
    handleEdit,
    handleDelete,
    imageOverlayClasses,
    hasError,
    model
  } = usePropertyCardViewModel({
    id,
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
    className,
    supportMode,
    onEdit,
    onDelete
  })

  if (hasError) {
    return (
      <div className={`flex flex-col w-full bg-default-light-alt p-card rounded-sm ${className}`}>
        <TextView className="text-distac-primary">Erro ao carregar propriedade</TextView>
      </div>
    )
  }

  const handleCardClick = (e) => {
    // Ignora clique se foi em um botão ou link ou se está em modo de suporte
    if (e.target.closest('button') || e.target.closest('a') || supportMode) {
      return
    }

    handleButtonClick('default')
  }

  const handleCardKeyDown = (e) => {
    // Enter ou Space ativam o card
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()

      // Ignora se o foco está em um botão ou link ou se está em modo de suporte
      if (e.target.closest('button') || e.target.closest('a') || supportMode) {
        return
      }

      handleButtonClick('default')
    }
  }

  const renderButtons = () => {
    if (!shouldRenderButtons) return null

    if (buttonLayout === 'grid') {
      const [gallery, floorplan, video] = buttons
      return (
        <div className="flex flex-col gap-3 w-full">
          <div className="flex gap-2 w-full">
            <ButtonView
              color={gallery.color}
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleButtonClick(gallery.action)
              }}
            >
              {gallery.text}
            </ButtonView>
            <ButtonView
              color={floorplan.color}
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleButtonClick(floorplan.action)
              }}
            >
              {floorplan.text}
            </ButtonView>
          </div>
          <ButtonView
            color={video.color}
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handleButtonClick(video.action)
            }}
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
              color={button.color}
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleButtonClick(button.action)
              }}
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
        color={button.color}
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          handleButtonClick(button.action)
        }}
        className="mt-auto"
      >
        {button.text}
      </ButtonView>
    ))
  }

  return (
    <div
      className={`${containerClasses} ${className} ${!supportMode ? 'cursor-pointer' : ''}`}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      role={!supportMode ? 'button' : undefined}
      tabIndex={!supportMode ? 0 : undefined}
      aria-label={!supportMode ? `Ver detalhes do imóvel ${model.title}` : undefined}
    >

      {shouldRenderEditButtons && (
      <div className="absolute top-4 right-4 z-10 flex gap-card md:gap-card-md">
        <ButtonView
          color={'soft-brown'}
          type={'button'}
          width={'fit'}
          className='!p-button-y md:!p-button-y-md shadow-md shadow-gray/400'
          onClick={(e) => {
            e.stopPropagation()
            handleDelete()
          }}
          aria-label="Excluir imóvel"
        >
          <X size={30} className='text-default-light' />
        </ButtonView>

        <ButtonView
          color={'pink'}
          type={'button'}
          width={'fit'}
          className='!p-button-y md:!p-button-y-md shadow-md shadow-gray/400'
          onClick={(e) => {
            e.stopPropagation()
            handleEdit()
          }}
        >
          <Pencil size={30} className='text-default-light' />
        </ButtonView>
      </div>
      )}

      {shouldRenderImage && (
        <div className={`relative ${imageOverlayClasses}`}>
          <div
            className='w-full h-48 bg-cover bg-center bg-no-repeat rounded-t-sm'
            style={{ backgroundImage: `url(${model.imageUrl})` }}
            role="img"
            aria-label={`Imagem do imóvel ${model.title}`}
          />

        </div>
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
