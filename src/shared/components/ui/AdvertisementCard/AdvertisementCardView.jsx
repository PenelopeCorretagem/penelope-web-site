import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { TextView } from '@shared/components/ui/Text/TextView'
import { LabelView } from '@shared/components/ui/Label/LabelView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { AlertView } from '@shared/components/feedback/Alert/AlertView'
import { useAdvertisementCardViewModel } from './useAdvertisementCardViewModel'
import { Pencil, X, Check, Trash2 } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { ADVERTISEMENT_CARD_MODES } from '@constant/advertisementCardModes'
import { MediaLightboxView } from '@shared/components/ui//MediaLightbox/MediaLightboxView'

export function AdvertisementCardView({
  advertisement,
  advertisementCardMode = ADVERTISEMENT_CARD_MODES.DEFAULT,
  className = '',
  onWhatsAppClick = null,
  medias,
  showLightbox,
  setShowLightbox,
  isCarouselItem = false,
}) {
  const viewModel = useAdvertisementCardViewModel(
    advertisement,
    advertisementCardMode,
    onWhatsAppClick,
    isCarouselItem,
  )

  console.log('ViewModel:', viewModel) // Log para depuração

  const containerClasses = () => {
    const baseClasses = ['flex', 'flex-col', 'w-[280px]', 'md:w-[340px]', 'relative', 'justify-between']
    baseClasses.push('group')
    if (viewModel.isConfigMode || viewModel.isDefaultMode || viewModel.isRedirectionMode) baseClasses.push('shadow-md shadow-gray-400 h-full')
    if (viewModel.isConfigMode || viewModel.isDefaultMode || viewModel.isDistacMode) baseClasses.push('transition-transform', 'duration-200', 'hover:scale-105')
    if (!viewModel.isDistacMode) baseClasses.push('rounded-sm')
    if (isCarouselItem && viewModel.isDefaultMode) baseClasses.push('cursor-pointer')
    return baseClasses.join(' ')
  }

  const cardClasses = () => {
    const baseClasses = [
      'bg-default-light', 'p-card', 'md:p-card-md', 'gap-card', 'md:gap-card-md',
      'flex', 'w-full', 'h-full', 'flex-col', 'items-start', 'relative'
    ]
    if (viewModel.advertisementCardCoverImageUrl && !(viewModel.isDetailsMode || viewModel.isDistacMode || viewModel.isRedirectionMode)) {
      baseClasses.push('rounded-b-sm')
    } else {
      baseClasses.push('rounded-sm')
    }
    return baseClasses.join(' ')
  }

  const renderButtons = (isDetailsMode, isConfigMode, buttons, isCarousel) => {
    if (isDetailsMode) {
      const [galleryButton, floorplanButton, videoButton] = buttons
      return (
        <div className="flex flex-col gap-3 w-full">
          <div className="flex gap-2 w-full">
            <ButtonView
              color={galleryButton.color}
              type={galleryButton.type}
              title={galleryButton.title}
              shape={galleryButton.shape}
              onClick={galleryButton.onClick}
            >
              {galleryButton.text}
            </ButtonView>
            <ButtonView
              color={floorplanButton.color}
              type={floorplanButton.type}
              title={floorplanButton.title}
              shape={floorplanButton.shape}
              onClick={floorplanButton.onClick}
            >
              {floorplanButton.text}
            </ButtonView>
          </div>
          <ButtonView
            color={videoButton.color}
            type={videoButton.type}
            title={videoButton.title}
            shape={videoButton.shape}
            onClick={videoButton.onClick}
          >
            {videoButton.text}
          </ButtonView>
        </div>
      )
    } else if(!isConfigMode) {
      // Se for carousel item, renderiza uma div rosa com o mesmo estilo do botão
      if (isCarousel) {
        return (
          <div className="flex z-2 flex-col gap-3 w-full">
            <div className="inline-flex items-center justify-center font-title font-bold uppercase leading-none text-button md:text-button-md transition-all duration-200 gap-[var(--gap-button)] md:gap-[var(--gap-button-md)] p-[var(--padding-button-rectangle)] md:p-[var(--padding-button-rectangle-md)] bg-distac-primary text-default-light w-full rounded-sm">
              {buttons[0].text}
            </div>
          </div>
        )
      }
      return (
        <div className="flex z-2 flex-col gap-3 w-full">
          {buttons.map((button, index) => (
            <ButtonView
              key={`button-${index}`}
              color={button.color}
              type={button.type}
              title={button.title}
              shape={button.shape}
              to={button.to ?? undefined}
              onClick={button.onClick ?? undefined}
            >
              {button.text}
            </ButtonView>
          ))}
        </div>
      )
    }
  }

  return (
    <div className={viewModel.isDetailsMode || viewModel.isDistacMode ? 'w-full flex flex-col-reverse md:grid md:grid-cols-[35%_65%] md:h-[78vh] relative' : 'relative'}>
      <div  className={viewModel.isDetailsMode || viewModel.isDistacMode ?'bg-distac-gradient p-section-y md:p-section-y-md flex flex-col items-center justify-center w-full md:h-full gap-subsection md:gap-subsection-md' : 'h-full'}>
        {viewModel.isDetailsMode || viewModel.isDistacMode ? (
          <HeadingView
            level={2}
            className='text-center text-default-light break-words'
          >
            Seu sonho começa com uma chave
          </HeadingView>
        ) : null}

        {advertisement ? (
          <div
            className={`${containerClasses()} ${className} ${!viewModel.isConfigMode ? 'cursor-pointer' : ''}`}
            role="button"
            tabIndex={0}
            aria-label={`Ver detalhes do imóvel ${viewModel.advertisementCardTitle}`}
            onClick={(e) => {
              if (e.target.closest('button') || e.target.closest('a')) return
              if (isCarouselItem && viewModel.isDefaultMode) {
                viewModel.handleCarouselItemClick()
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                if (e.target.closest('button') || e.target.closest('a')) return
                if (isCarouselItem && viewModel.isDefaultMode) {
                  viewModel.handleCarouselItemClick()
                }
              }
            }}
          >
            {viewModel.isConfigMode && (
              <div className="absolute top-4 right-4 z-10 flex gap-card md:gap-card-md">
                <ButtonView
                  color={viewModel.advertisementCardButtons[1].color}
                  type={viewModel.advertisementCardButtons[1].type}
                  onClick={viewModel.advertisementCardButtons[1].onClick}
                  aria-label={viewModel.advertisementCardButtons[1].title}
                  shape={viewModel.advertisementCardButtons[1].shape}
                  className='shadow-md shadow-gray/400 !p-3'
                  width='fit'
                >
                  {viewModel.isActiveAdvertisement? (<X size={30} className='text-default-light' />) : (<Check size={30} className='text-default-light' />)}
                </ButtonView>

                <ButtonView
                  color={viewModel.advertisementCardButtons[2].color}
                  type={viewModel.advertisementCardButtons[2].type}
                  onClick={viewModel.advertisementCardButtons[2].onClick}
                  aria-label={viewModel.advertisementCardButtons[2].title}
                  shape={viewModel.advertisementCardButtons[2].shape}
                  className='shadow-md shadow-gray/400 !p-3'
                  width='fit'
                >
                  <Trash2 size={26} className='text-default-light' />
                </ButtonView>

                <ButtonView
                  color={viewModel.advertisementCardButtons[0].color}
                  type={viewModel.advertisementCardButtons[0].type}
                  to={viewModel.advertisementCardButtons[0].to ?? undefined} // <--- Passe a rota, assim o botão age como link
                  onClick={viewModel.advertisementCardButtons[0].onClick ?? undefined} // <--- fallback para casos onde onClick existe
                  aria-label={viewModel.advertisementCardButtons[0].title}
                  shape={viewModel.advertisementCardButtons[0].shape}
                  className='shadow-md shadow-gray/400'
                  width='fit'
                >
                  <Pencil size={30} className='text-default-light' />
                </ButtonView>
              </div>
            )}

            {viewModel.renderAdvertisementCoverImage && viewModel.advertisementCardCoverImageUrl && (
              <div className="relative">
                <div
                  className='w-full h-48 bg-cover bg-center bg-no-repeat rounded-t-sm'
                  style={{ backgroundImage: `url(${viewModel.advertisementCardCoverImageUrl})` }}
                  role="img"
                  aria-label={`Imagem do imóvel ${viewModel.advertisementCardTitle}`}
                />
              </div>
            )}

            <div className={cardClasses()}>
              {viewModel.renderAdvertisementCategoryLabel && viewModel.advertisementCardCategory && (
                <LabelView model={viewModel.advertisementCardCategory} />
              )}

              <div className='flex flex-col gap-2 w-full pt-2 md:pt-3'>
                <HeadingView level={4} className="text-default-dark">
                  {viewModel.advertisementCardTitle}
                </HeadingView>
                <HeadingView level={5} className={`text-distac-primary`}>
                  {viewModel.advertisementCardSubtitle}
                </HeadingView>
              </div>

              <TextView className='uppercase text-default-dark mb-auto'>
                {viewModel.advertisementCardDescription}
              </TextView>

              {viewModel.renderAdvertisementAmenities && (
                <div className="w-full">
                  <div className="grid grid-cols-4 gap-5">
                    {viewModel.advertisementCardAmenities.slice(0, 4).map((amenity) => {
                      const iconName = amenity?.icon
                      const IconComponent = iconName ? LucideIcons[iconName] : null
                      
                      console.log('Amenity:', amenity) // Log para depuração
                      return (
                        <div
                          key={amenity?.id}
                          className="flex items-center justify-center bg-default-dark-light rounded-sm aspect-square"
                          title={amenity?.description}
                        >
                          {IconComponent && (
                            <IconComponent className="w-7 h-7 text-default-light" />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {renderButtons(viewModel.isDetailsMode, viewModel.isConfigMode, viewModel.advertisementCardButtons, isCarouselItem)}
            </div>
            {!viewModel.isActiveAdvertisement ? (
              <div className="absolute inset-0 bg-default-dark opacity-50 rounded-sm">
              </div>
            ) : null}
          </div>
        ) : (
          <div className="w-full md:w-[340px] h-[200px] bg-default-light rounded-sm flex items-center justify-center">
            <TextView>Nenhum imóvel encontrado</TextView>
          </div>
        )}
      </div>

      {viewModel.isDetailsMode || viewModel.isDistacMode ? (
        <div className="h-[40vh] md:h-full w-full overflow-hidden">
          {advertisement && viewModel.advertisementCardCoverImageUrl && (
            <img
              src={viewModel.advertisementCardCoverImageUrl}
              alt={`Imagem do imóvel ${viewModel.advertisementCardTitle}`}
              className="!w-full !h-full !object-cover !object-center border-0"
            />
          )}
        </div>
      ) : null}

      {/* ✅ Lightbox com imagens da API */}
      {viewModel.showLightbox && (
        <MediaLightboxView
          isOpen={viewModel.showLightbox}
          medias={viewModel.medias}
          onClose={() => viewModel.setShowLightbox(false)}
        />
      )}

      <AlertView
        isVisible={!!viewModel.alertConfig}
        type={viewModel.alertConfig?.type}
        message={viewModel.alertConfig?.message}
        hasCloseButton={!viewModel.alertConfig?.isConfirm}
        onClose={viewModel.handleCloseAlert}
        buttonsLayout="col"
      >
        {viewModel.alertConfig?.isConfirm && (
          <div className="flex justify-center gap-card md:gap-card-md w-full">
            <ButtonView
              type="button"
              shape="square"
              color="border-distac-primary"
              onClick={viewModel.handleCloseAlert}
              width="fit"
            >
              Cancelar
            </ButtonView>
            <ButtonView
              type="button"
              shape="square"
              color={viewModel.alertConfig?.confirmColor || 'pink'}
              onClick={viewModel.handleConfirmAction}
              width="fit"
              disabled={viewModel.isProcessingStatus}
            >
              {viewModel.alertConfig?.confirmText || 'Confirmar'}
            </ButtonView>
          </div>
        )}
      </AlertView>
    </div>
  )
}
