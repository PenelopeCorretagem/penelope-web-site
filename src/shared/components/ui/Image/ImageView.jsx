import { Image } from 'lucide-react'
import { useImageViewModel } from './useImageViewModel'
import { TextView } from '@shared/components/ui/Text/TextView'
import {
  getImageThemeClasses,
  getImageContainerThemeClasses,
  getImagePlaceholderThemeClasses,
  getImagePlaceholderIconThemeClasses,
  getImageDescriptionThemeClasses
} from '@shared/styles/theme'

export function ImageView({ src, alt, description, mode, className }) {
  const {
    hasImage,
    isBackgroundMode,
    hasDescription,
    alt: processedAlt
  } = useImageViewModel({ src, alt, description, mode, className })

  if (!hasImage) {
    return (
      <div className={getImagePlaceholderThemeClasses({ className })}>
        <Image className={getImagePlaceholderIconThemeClasses()} />
      </div>
    )
  }

  if (isBackgroundMode) {
    return (
      <div
        className={getImageThemeClasses({ mode: 'background', className })}
        style={{ backgroundImage: `url(${src})` }}
        role="img"
        aria-label={processedAlt}
      />
    )
  }

  return (
    <div className={getImageContainerThemeClasses()}>
      <img
        src={src}
        alt={processedAlt}
        className={getImageThemeClasses({ mode: 'image', className })}
      />
      {hasDescription && (
        <TextView className={getImageDescriptionThemeClasses()}>
          {description}
        </TextView>
      )}
    </div>
  )
}
