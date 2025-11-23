import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { TextView } from '@shared/components/ui/Text/TextView'
import { LabelView } from '@shared/components/ui/Label/LabelView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { usePropertyCardViewModel } from './usePropertyCardViewModel'
import { Pencil, X } from 'lucide-react'

export function PropertyCardView({
  realEstateAdvertisement,
  realStateCardMode,
  className = '',
}) {
  const viewModel = usePropertyCardViewModel(realEstateAdvertisement, realStateCardMode)

  const containerClasses = () => {
    const baseClasses = ['flex', 'flex-col', 'w-[340px]', 'relative', 'rounded-sm']
    if (viewModel.isConfigMode || viewModel.isDefaultMode) baseClasses.push('shadow-md shadow-gray-400')
    if (viewModel.isConfigMode || viewModel.isDefaultMode) baseClasses.push('transition-transform', 'duration-200', 'hover:scale-105')
    return baseClasses.join(' ')
  }

  const cardClasses = () => {
    const baseClasses = [
      'bg-default-light', 'p-card', 'md:p-card-md', 'gap-card', 'md:gap-card-md',
      'flex', 'w-full', 'flex-col', 'items-start', 'relative'
    ]
    if (viewModel.realStateCardCoverImageUrl) {
      baseClasses.push('rounded-b-sm')
    } else {
      baseClasses.push('rounded-sm')
    }
    return baseClasses.join(' ')
  }

  const labelPosition = viewModel.realStateCardCategoryLabelPosition

  const formattedDifferences = viewModel.realStateCardDifferences || []

  const renderButtons = (isMoreDetailsMode, isConfigMode, buttons) => {
    if (isMoreDetailsMode) {
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
            className='shadow-md shadow-gray/400'
          >
            <X size={30} className='text-default-light' />
          </ButtonView>

          <ButtonView
            color={viewModel.realStateCardButtons[0].color}
            type={viewModel.realStateCardButtons[0].type}
            shape={viewModel.realStateCardButtons[0].shape}
            onClick={viewModel.realStateCardButtons[0].onClick}
            aria-label={viewModel.realStateCardButtons[0].title}
            className='shadow-md shadow-gray/400'
          >
            <Pencil size={30} className='text-default-light' />
          </ButtonView>
        </div>
      )}

      {viewModel.shouldRenderRealStateCardCoverImage && viewModel.realStateCardCoverImageUrl && (
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
        {viewModel.shouldRenderRealStateCardCategoryLabel && viewModel.realStateCardCategory && (
          <LabelView model={viewModel.realStateCardCategory} className={labelPosition} />
        )}

        <div className='flex flex-col gap-2 w-full pt-2 md:pt-3'>
          <HeadingView level={4} className="text-default-dark">
            {viewModel.realStateCardTitle}
          </HeadingView>
          <HeadingView level={5} className={`text-distac-primary`}>
            {viewModel.realStateCardSubtitle}
          </HeadingView>
        </div>

        <TextView className='uppercase text-default-dark'>
          {viewModel.realStateCardDescription}
        </TextView>

        {viewModel.shouldRenderRealStateCardDifferences && formattedDifferences.length > 0 && (
          <div className='gap-card md:gap-card-md grid w-full grid-cols-3'>
            {formattedDifferences.map((labelModel, index) => (
              <LabelView key={`difference-${index}`} model={labelModel} />
            ))}
          </div>
        )}

        {renderButtons(viewModel.isMoreDetailsMode, viewModel.isConfigMode, viewModel.realStateCardButtons)}
      </div>
    </div>
  )
}
