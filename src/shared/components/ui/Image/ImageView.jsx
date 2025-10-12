import { Image } from 'lucide-react'
import { useImageViewModel } from './useImageViewModel'

export function ImageView({ src, alt, mode, className }) {
  const {
    hasImage,
    isBackgroundMode,
    finalClassName,
    validation
  } = useImageViewModel({ src, alt, mode, className })

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
    <img
      src={src}
      alt={alt}
      className={`rounded-sm border-transparent bg-gradient-to-t from-brand-brown to-brand-pink p-0.5 w-fit ${finalClassName}`}
      title={!validation.isValid ? validation.errors.join(', ') : undefined}
    />
  )
}
