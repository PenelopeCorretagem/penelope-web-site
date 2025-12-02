import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { TextView } from '@shared/components/ui/Text/TextView'
import { LabelView } from '@shared/components/ui/Label/LabelView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { usePropertyCardViewModel } from './usePropertyCardViewModel'
import { Pencil, X } from 'lucide-react'
import { REAL_STATE_CARD_MODES } from '@constant/realStateCardModes'
import { PropertyFeatureView } from '@shared/components/ui//PropertyFeature/PropertyFeatureView'

export function PropertyCardView({
  realEstateAdvertisement,
  realStateCardMode = REAL_STATE_CARD_MODES.DEFAULT,
  className = '',
  onWhatsAppClick = null,
}) {
  const viewModel = usePropertyCardViewModel(
    realEstateAdvertisement,
    realStateCardMode,
    onWhatsAppClick
  )

  const containerClasses = () => {
    const baseClasses = ['flex', 'flex-col', 'w-[340px]', 'relative', 'justify-between']
    if (viewModel.isConfigMode || viewModel.isDefaultMode || viewModel.isRedirectionMode) baseClasses.push('shadow-md shadow-gray-400 h-full')
    if (viewModel.isConfigMode || viewModel.isDefaultMode) baseClasses.push('transition-transform', 'duration-200', 'hover:scale-105')
    if (!viewModel.isDistacMode) baseClasses.push('rounded-sm')
    return baseClasses.join(' ')
  }

  const cardClasses = () => {
    const baseClasses = [
      'bg-default-light', 'p-card', 'md:p-card-md', 'gap-card', 'md:gap-card-md',
      'flex', 'w-full', 'h-full', 'flex-col', 'items-start', 'relative'
    ]
    if (viewModel.realStateCardCoverImageUrl && !(viewModel.isDetailsMode || viewModel.isDistacMode || viewModel.isRedirectionMode)) {
      baseClasses.push('rounded-b-sm')
    } else {
      baseClasses.push('rounded-sm')
    }
    return baseClasses.join(' ')
  }

  const renderButtons = (isDetailsMode, isConfigMode, buttons) => {
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
      return (
        <div className="flex flex-col gap-3 w-full">
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
    <div className={viewModel.isDetailsMode || viewModel.isDistacMode ? 'w-full grid grid-cols-[35%_65%] h-[78vh]' : ''}>
      <div  className={viewModel.isDetailsMode || viewModel.isDistacMode ?'bg-distac-gradient p-section-y md:p-section-y-md flex flex-col items-center justify-center w-full h-full gap-subsection md:gap-subsection-md' : 'h-full'}>
        {viewModel.isDetailsMode || viewModel.isDistacMode ? (
          <HeadingView
            level={2}
            className='text-center text-default-light break-words'
          >
            Seu sonho começa com uma chave
          </HeadingView>
        ) : null}

        {realEstateAdvertisement ? (
          <div
            className={`${containerClasses()} ${className} ${!viewModel.isConfigMode ? 'cursor-pointer' : ''}`}
            role="button"
            tabIndex={0}
            aria-label={`Ver detalhes do imóvel ${viewModel.realStateCardTitle}`}
            onClick={(e) => {
              if (e.target.closest('button') || e.target.closest('a')) return
              // ação default
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                if (e.target.closest('button') || e.target.closest('a')) return
                // ação default
              }
            }}
          >
            {viewModel.isConfigMode && (
              <div className="absolute top-4 right-4 z-10 flex gap-card md:gap-card-md">
                <ButtonView
                  color={viewModel.realStateCardButtons[1].color}
                  type={viewModel.realStateCardButtons[1].type}
                  onClick={viewModel.realStateCardButtons[1].onClick}
                  aria-label={viewModel.realStateCardButtons[1].title}
                  shape={viewModel.realStateCardButtons[1].shape}
                  className='shadow-md shadow-gray/400 !p-3'
                  width='fit'
                >
                  <X size={30} className='text-default-light' />
                </ButtonView>

                <ButtonView
                  color={viewModel.realStateCardButtons[0].color}
                  type={viewModel.realStateCardButtons[0].type}
                  to={viewModel.realStateCardButtons[0].to ?? undefined} // <--- Passe a rota, assim o botão age como link
                  onClick={viewModel.realStateCardButtons[0].onClick ?? undefined} // <--- fallback para casos onde onClick existe
                  aria-label={viewModel.realStateCardButtons[0].title}
                  shape={viewModel.realStateCardButtons[0].shape}
                  className='shadow-md shadow-gray/400'
                  width='fit'
                >
                  <Pencil size={30} className='text-default-light' />
                </ButtonView>
              </div>
            )}

            {viewModel.renderRealStateCardCoverImage && viewModel.realStateCardCoverImageUrl && (
              <div className="relative">
                <div
                  className='w-full h-48 bg-cover bg-center bg-no-repeat rounded-t-sm'
                  style={{ backgroundImage: `url(${viewModel.realStateCardCoverImageUrl})` }}
                  role="img"
                  aria-label={`Imagem do imóvel ${viewModel.realStateCardTitle}`}
                />
              </div>
            )}

            <div className={cardClasses()}>
              {viewModel.renderRealStateCardCategoryLabel && viewModel.realStateCardCategory && (
                <LabelView model={viewModel.realStateCardCategory} />
              )}

              <div className='flex flex-col gap-2 w-full pt-2 md:pt-3'>
                <HeadingView level={4} className="text-default-dark">
                  {viewModel.realStateCardTitle}
                </HeadingView>
                <HeadingView level={5} className={`text-distac-primary`}>
                  {viewModel.realStateCardSubtitle}
                </HeadingView>
              </div>

              <TextView className='uppercase text-default-dark mb-auto'>
                {viewModel.realStateCardDescription}
              </TextView>

              {viewModel.renderRealStateCardFeatures && (
                <div className='gap-card md:gap-card-md grid w-full grid-cols-3'>
                  {viewModel.realStateCardFeatures.map((realStateFeature) => (
                    <PropertyFeatureView feature={realStateFeature} key={realStateFeature.id} />
                  ))}
                </div>
              )}

              {renderButtons(viewModel.isDetailsMode, viewModel.isConfigMode, viewModel.realStateCardButtons)}
            </div>
          </div>
        ) : (
          <div className="w-[340px] h-[200px] bg-default-light rounded-sm flex items-center justify-center">
            <TextView>Nenhum imóvel encontrado</TextView>
          </div>
        )}
      </div>

      {viewModel.isDetailsMode || viewModel.isDistacMode ? (
        <div className="h-full w-full overflow-hidden">
          {realEstateAdvertisement && viewModel.realStateCardCoverImageUrl && (
            <img
              src={viewModel.realStateCardCoverImageUrl}
              alt={`Imagem do imóvel ${viewModel.realStateCardTitle}`}
              className="!w-full !h-full !object-cover !object-center border-0"
            />
          )}
        </div>
      ) : null}
    </div>
  )
}
