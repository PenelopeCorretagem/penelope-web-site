import { TextView } from '@shared/components/ui/Text/TextView'
import { ImageView } from '@shared/components/ui/Image/ImageView'
import {
  getCardImageContainerThemeClasses,
  getCardImageWrapperThemeClasses,
  getCardImageBackgroundThemeClasses,
  getCardImagePositionThemeClasses,
  getCardImageDescriptionThemeClasses
} from '@shared/styles/theme'

export function CardImageView({ src, alt, description, position = 'bottom-right', className = '' }) {
  const hasDescription = description?.trim() !== ''

  return (
    <div className={getCardImageContainerThemeClasses()}>
      <div className={getCardImageWrapperThemeClasses({ position })}>
        <div className={getCardImageBackgroundThemeClasses()}>
          <div className={getCardImagePositionThemeClasses({ position })}>
            <ImageView src={src} alt={alt} className={className} />
          </div>
        </div>
      </div>
      {hasDescription && (
        <TextView className={getCardImageDescriptionThemeClasses()}>
          {description}
        </TextView>
      )}
    </div>
  )
}
