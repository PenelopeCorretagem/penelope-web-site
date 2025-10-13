import { TextView } from '@shared/components/ui/Text/TextView'
import { ImageView } from '@shared/components/ui/Image/ImageView'
import { useCardImageViewModel } from './useCardImageViewModel'

export function CardImageView({ src, alt, description, position, className }) {
  const {
    validation,
    positionClasses,
    paddingClasses,
    hasDescription,
    imageClassName
  } = useCardImageViewModel({ src, alt, description, position, className })

  return (
    <div className='flex flex-col items-start gap-1.5'>
      <div className={`relative w-fit ${paddingClasses}`}>
        <div className='relative z-0 w-fit rounded-sm bg-brand-gradient'>
          <div className={`relative z-10 ${positionClasses}`}>
            <ImageView
              src={src}
              alt={alt}
              className={imageClassName}
              title={!validation.isValid ? validation.errors.join(', ') : undefined}
            />
          </div>
        </div>
      </div>
      {hasDescription && (
        <TextView className='text-brand-dark-gray mt-2 text-sm'>
          {description}
        </TextView>
      )}
    </div>
  )
}
