import { useState } from 'react'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { TextView } from '@shared/components/ui/Text/TextView'
import { LabelView } from '@shared/components/ui/Label/LabelView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { ScreeningFormView } from '@shared/components/ui/ScreeningForm/ScreeningFormView'
import { MediaLightboxView } from '@shared/components/ui/MediaLightbox/MediaLightboxView'
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
    // ✅ Novas propriedades de imagens da API
    galleryImages,
    floorplanImages,
    videoImages,
    hasGalleryImages,
    hasFloorplanImages,
    hasVideoImages,
    isLoadingImages
  } = usePropertyCardViewModel(props)

  const [showForm, setShowForm] = useState(false)
  const [showLightbox, setShowLightbox] = useState(false)
  const [mediaType, setMediaType] = useState(null) // gallery | floorplan | video

  // ✅ Mocks como fallback (caso não tenha imagens da API)
  const mockGallery = [
    'https://portalhospitaisbrasil.com.br/wp-content/uploads/Loca%C3%BE%C2%A7es-imobili%C3%9Frias-Nerplan.jpg',
    'https://eeon9q568x2.exactdn.com/wp-content/uploads/2025/06/Fachada-iconica-do-edificio-escultural-no-Itaim-Bibi-1024x890.jpg',
    'https://img.freepik.com/fotos-gratis/tiro-vertical-de-um-edificio-branco-sob-o-ceu-claro_181624-4575.jpg?semt=ais_incoming&w=740&q=80',
    'https://eeon9q568x2.exactdn.com/wp-content/uploads/2025/06/Fachada-iconica-do-edificio-escultural-no-Itaim-Bibi-1024x890.jpg',
  ]

  const mockFloorplans = [
    'https://portalhospitaisbrasil.com.br/wp-content/uploads/Loca%C3%BE%C2%A7es-imobili%C3%9Frias-Nerplan.jpg',
    'https://portalhospitaisbrasil.com.br/wp-content/uploads/Loca%C3%BE%C2%A7es-imobili%C3%9Frias-Nerplan.jpg',
  ]

  const mockVideos = [
    'https://www.w3schools.com/html/mov_bbb.mp4'
  ]

  const handleCardClick = (e) => {
    if (e.target.closest('button') || e.target.closest('a')) return
    handleButtonClick('default')
  }

  const handleButtonAction = (action) => {
    console.log('🟢 Botão clicado:', action)

    if (action === 'contato' || action === 'whatsapp') {
      setShowForm(true)
      return
    }

    if (action === 'gallery' || action === 'floorplan' || action === 'video') {
      setMediaType(action)
      setShowLightbox(true)
      return
    }

    handleButtonClick(action)
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

  // ✅ Função para obter as imagens corretas baseadas no tipo
  const getMediaForLightbox = () => {
    switch (mediaType) {
      case 'gallery':
        // Usa imagens da API se disponíveis, senão usa mock
        return hasGalleryImages ? galleryImages : mockGallery

      case 'floorplan':
        // Usa plantas da API se disponíveis, senão usa mock
        return hasFloorplanImages ? floorplanImages : mockFloorplans

      case 'video':
        // Usa vídeos da API se disponíveis, senão usa mock
        return hasVideoImages ? videoImages : mockVideos

      default:
        return []
    }
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

          {/* ✅ Indicador de carregamento de imagens (opcional) */}
          {isLoadingImages && (
            <TextView className="text-xs text-gray-500">
              Carregando imagens...
            </TextView>
          )}

          {renderButtons()}
        </div>
      </div>

      {/* ✅ Modal do formulário de contato */}
      {showForm && (
        <ScreeningFormView
          onClose={() => setShowForm(false)}
          property={model}
        />
      )}

      {/* ✅ Lightbox com imagens da API ou fallback para mocks */}
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
