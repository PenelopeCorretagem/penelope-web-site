import { Image } from 'lucide-react'
import { TextView } from '@shared/components/ui/Text/TextView'

/**
 * ImageView component renders an image with optional description.
 * If no image source is provided, a placeholder with an icon is displayed.
 *
 * @param {Object} props - Component props.
 * @param {string} props.src - The URL of the image to display.
 * @param {string} [props.alt=''] - Alternative text describing the image for accessibility.
 * @param {string} [props.description] - Optional description text displayed below the image.
 * @param {string} [props.className=''] - Additional CSS classes for styling the image.
 *
 * @returns {JSX.Element} - Returns an image or a placeholder if no image is provided.
 *
 * @example
 * <ImageView src="photo.jpg" alt="A beautiful scenery" description="Sunset view" />
 * <ImageView /> // Renders placeholder
 */
export function ImageView({ src, alt = '', description, className = '' }) {
  const hasImage = !!src
  const hasDescription = description?.trim() !== ''

  if (!hasImage) {
    return (
      <div className={`flex-1 flex items-center justify-center bg-default-light-secondary ${className}`}>
        <Image className="w-[100px] h-[100px] text-default-light-tertiary" />
      </div>
    )
  }

  return (

    <div className="flex flex-col gap-card md:gap-card-md bg-distac-gradient p-1 rounded-sm h-fit">
      <img
        src={src}
        alt={alt}
        className={`object-cover rounded-[2px] ${className}`}
      />
      {hasDescription ?? (
      <TextView className="text-default-dark-muted">
        {description}
      </TextView>
      )
      }
    </div>
  )
}
