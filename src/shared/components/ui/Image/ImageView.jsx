import { Image } from 'lucide-react'
import { TextView } from '@shared/components/ui/Text/TextView'
import {
  getImageThemeClasses,
  getImageContainerThemeClasses,
  getImagePlaceholderThemeClasses,
  getImagePlaceholderIconThemeClasses,
  getImageDescriptionThemeClasses
} from '@shared/styles/theme'

/**
 * ImageView component renders an image with optional description and supports
 * multiple display modes: standard image or background image.
 * If no image source is provided, a placeholder with an icon is displayed.
 *
 * @param {Object} props - Component props.
 * @param {string} props.src - The URL of the image to display.
 * @param {string} [props.alt=''] - Alternative text describing the image for accessibility.
 * @param {string} [props.description] - Optional description text displayed below the image.
 * @param {string} [props.mode='auto'] - Display mode: 'image', 'background', or 'auto'.
 *   - 'image': renders a standard <img> element.
 *   - 'background': renders a <div> with the image as CSS background.
 *   - 'auto': decides automatically based on className patterns.
 * @param {string} [props.className=''] - Additional CSS classes for styling the image or container.
 *
 * @returns {JSX.Element} - Returns an image, a background container, or a placeholder if no image is provided.
 *
 * @example
 * <ImageView src="photo.jpg" alt="A beautiful scenery" description="Sunset view" />
 * <ImageView mode="background" src="banner.jpg" className="bg-cover flex-1" />
 * <ImageView /> // Renders placeholder
 */
export function ImageView({ src, alt = '', description, mode = 'auto', className = '' }) {
  const hasImage = !!src
  const hasDescription = description?.trim() !== ''

  const isBackgroundMode =
    mode === 'background' ||
    (mode === 'auto' && (className.includes('bg-cover') || className.includes('flex-1')))

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
        aria-label={alt}
      />
    )
  }

  return (
    <div className={getImageContainerThemeClasses()}>
      <img
        src={src}
        alt={alt}
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
