import { useState } from 'react'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { TextView } from '@shared/components/ui/Text/TextView'
import { LabelView } from '@shared/components/ui/Label/LabelView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { ScreeningFormView } from '@shared/components/ui/ScreeningForm/ScreeningFormView'
import { MediaLightboxView } from '@shared/components/ui/MediaLightbox/MediaLightboxView' // ✅ ADICIONADO
import { usePropertyCardViewModel } from './usePropertyCardViewModel'

export function PropertyCardView(props) {
  const {
    hasDifference = false,
    className = '',
  } = props

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
    handleButtonClick,
    hasError,
    model,
    galleryImages, // ✅ ADICIONADO
    floorplanImages, // ✅ ADICIONADO
    videoImages, // ✅ ADICIONADO
    hasGalleryImages, // ✅ ADICIONADO
    hasFloorplanImages, // ✅ ADICIONADO
    hasVideoImages, // ✅ ADICIONADO
  } = usePropertyCardViewModel(props)

  const [showForm, setShowForm] = useState(false)
  const [showLightbox, setShowLightbox] = useState(false) // ✅ ADICIONADO
  const [mediaType, setMediaType] = useState(null) // ✅ ADICIONADO

  const handleCardClick = (e) => {
    if (e.target.closest('button') || e.target.closest('a')) return
    handleButtonClick('default')
  }

  const handleButtonAction = (action) => {
    if (action === 'contato' || action === 'whatsapp') {
      setShowForm(true)
      return // ✅ ADICIONADO return
    }

    // ✅ ADICIONADO - Abre lightbox para galeria/planta/vídeo
    if (action === 'gallery' || action === 'floorplan' || action === 'video') {
      setMediaType(action)
      setShowLightbox(true)
      return
    }

    handleButtonClick(action)
  }

  const DEFAULT_VIDEO = 'https://www.youtube.com/embed/NA0u8QCrZfY'

  const getMediaForLightbox = () => {
    switch (mediaType) {
      case 'gallery':
        return hasGalleryImages ? galleryImages : []

      case 'floorplan':
        return hasFloorplanImages ? floorplanImages : []

      case 'video':
        return hasVideoImages
          ? [DEFAULT_VIDEO, ...videoImages]
          : [DEFAULT_VIDEO]

      default:
        return []
    }
  }


  const renderButtons = () => {
    if (!shouldRenderButtons) return null

    return buttons.map((button, index) => (
      <ButtonView
        key={index}
        variant={button.variant}
        type={button.type}
        onClick={(e) => {
          e.stopPropagation()
          handleButtonAction(button.action)
        }}
        className="mt-auto"
      >
        {button.text}
      </ButtonView>
    ))
  }

  if (hasError) {
    return (
      <div className={`flex flex-col max-w-sm bg-default-light-alt p-card rounded-sm ${className}`}>
        <TextView className="text-distac-primary">
          Erro ao carregar propriedade
        </TextView>
      </div>
    )
  }

  return (
    <>
      <div
        className={`${containerClasses} ${className} cursor-pointer`}
        onClick={handleCardClick}
      >
        {shouldRenderImage && (
          <div
            className="w-full h-48 bg-cover bg-center bg-no-repeat rounded-t-sm"
            style={{ backgroundImage: `url(${model.imageUrl})` }}
            role="img"
            aria-label={`Imagem do imóvel ${model.title}`}
          />
        )}

        <div className={cardClasses}>
          {shouldRenderLabel && (
            <LabelView model={categoryLabel} className={labelPosition} />
          )}

          <div className="flex flex-col gap-2 w-full pt-2 md:pt-3">
            <HeadingView level={4} className="text-default-dark">
              {model.title}
            </HeadingView>
            <HeadingView level={5} className="text-distac-primary">
              {model.subtitle}
            </HeadingView>
          </div>

          <TextView className="uppercase text-default-dark">
            {model.description}
          </TextView>

          {hasDifference && shouldRenderDifferences && (
            <div className="gap-card md:gap-card-md grid w-full grid-cols-3">
              {formattedDifferences.map((labelModel, index) => (
                <LabelView key={`difference-${index}`} model={labelModel} />
              ))}
            </div>
          )}

          {renderButtons()}
        </div>
      </div>

      {showForm && (
        <ScreeningFormView
          onClose={() => setShowForm(false)}
          property={model}
        />
      )}

      {/* ✅ ADICIONADO - Lightbox com imagens da API */}
      {showLightbox && (
        <MediaLightboxView
          type={mediaType}
          onClose={() => setShowLightbox(false)}
          medias={getMediaForLightbox()}
        />
      )}
    </>
  )
}
