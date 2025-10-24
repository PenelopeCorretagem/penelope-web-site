import { Image } from 'lucide-react'
import { useImageViewModel } from './useImageViewModel'
import { TextView } from '@shared/components/ui/Text/TextView'

export function ImageView({ src, alt, description, mode, className }) {
  const {
    hasImage,
    isBackgroundMode,
    finalClassName,
    validation,
    hasDescription
  } = useImageViewModel({ src, alt, description, mode, className })

  if (!hasImage) {
    return (
      <div className={`flex-1 flex items-center justify-center bg-brand-white-secondary ${finalClassName}`}>
        <Image className='w-[100px] h-[100px] text-brand-white-tertiary' />
      </div>
    )
  }

  if (isBackgroundMode) {
    return (
      <div
        className={finalClassName}
        style={{ backgroundImage: `url(${src})` }}
        role="img"
        aria-label={alt}
        title={!validation.isValid ? validation.errors.join(', ') : undefined}
      />
    )
  }

  return (
    <div className="flex flex-col gap-card md:gap-card-md">
      <img
        src={src}
        alt={alt}
        className={`rounded-sm border-transparent bg-gradient-to-t from-brand-brown to-brand-pink p-0.5 w-fit ${finalClassName}`}
        title={!validation.isValid ? validation.errors.join(', ') : undefined}
      />
      {hasDescription && (
        <TextView className="text-brand-dark-gray">
          {description}
        </TextView>
      )}
    </div>
  )
}
