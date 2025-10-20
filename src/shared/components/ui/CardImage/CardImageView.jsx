import { TextView } from '@shared/components/ui/Text/TextView'
import { ImageView } from '@shared/components/ui/Image/ImageView'
import { useCardImageViewModel } from './useCardImageViewModel'
import {
  getCardImageContainerThemeClasses,
  getCardImageWrapperThemeClasses,
  getCardImageBackgroundThemeClasses,
  getCardImagePositionThemeClasses,
  getCardImageDescriptionThemeClasses
} from '@shared/styles/theme'

export function CardImageView({ src, alt, description, position = 'bottom-right', className }) {
  const {
    hasDescription,
    src: processedSrc,
    alt: processedAlt,
    description: processedDescription,
    position: processedPosition,
    className: processedClassName
  } = useCardImageViewModel({ src, alt, description, position, className })

  return (
    <div className={getCardImageContainerThemeClasses()}>
      <div className={getCardImageWrapperThemeClasses({ position: processedPosition })}>
        <div className={getCardImageBackgroundThemeClasses()}>
          <div className={getCardImagePositionThemeClasses({ position: processedPosition })}>
            <ImageView
              src={processedSrc}
              alt={processedAlt}
              className={processedClassName}
            />
          </div>
        </div>
      </div>
      {hasDescription && (
        <TextView className={getCardImageDescriptionThemeClasses()}>
          {processedDescription}
        </TextView>
      )}
    </div>
  )
}
