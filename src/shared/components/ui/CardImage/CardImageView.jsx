import { TextView } from '@shared/components/ui/Text/TextView'
import { ImageView } from '@shared/components/ui/Image/ImageView'

// Classes Tailwind diretas para CardImage
const CARD_IMAGE_CONTAINER_CLASSES = 'flex flex-col items-start gap-1.5'
const CARD_IMAGE_BACKGROUND_CLASSES = 'relative z-0 w-fit rounded-sm bg-distac-gradient'
const CARD_IMAGE_IMAGE_CONTAINER_CLASSES = 'relative z-10'
const CARD_IMAGE_DESCRIPTION_CLASSES = 'text-default-dark-muted mt-2 text-sm'

// Mapeamento de posições com transform e padding
const POSITION_CLASSES = {
  'bottom-left': {
    wrapper: 'relative w-fit -translate-x-8 translate-y-8 pl-8 pb-8',
    container: 'relative z-10',
  },
  'bottom-right': {
    wrapper: 'relative w-fit translate-x-8 translate-y-8 pr-8 pb-8',
    container: 'relative z-10',
  },
  'top-left': {
    wrapper: 'relative w-fit -translate-x-8 -translate-y-8 pl-8 pt-8',
    container: 'relative z-10',
  },
  'top-right': {
    wrapper: 'relative w-fit translate-x-8 -translate-y-8 pr-8 pt-8',
    container: 'relative z-10',
  },
}

export function CardImageView({ src, alt, description, position = 'bottom-right', className = '' }) {
  const hasDescription = description?.trim() !== ''
  const positionClasses = POSITION_CLASSES[position] || POSITION_CLASSES['bottom-right']

  return (
    <div className={CARD_IMAGE_CONTAINER_CLASSES}>
      <div className={positionClasses.wrapper}>
        <div className={CARD_IMAGE_BACKGROUND_CLASSES}>
          <div className={positionClasses.container}>
            <ImageView src={src} alt={alt} className={className} />
          </div>
        </div>
      </div>
      {hasDescription && (
        <TextView className={CARD_IMAGE_DESCRIPTION_CLASSES}>
          {description}
        </TextView>
      )}
    </div>
  )
}
