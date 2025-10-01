import { HeadingView } from '@shared/view/components/HeadingView'
import { TextView } from '@shared/view/components/TextView'
import { LabelView } from '@shared/view/components/LabelView'
import { ButtonView } from '@shared/view/components/ButtonView'
import { useCardViewModel } from '@shared/hooks/components/useCardViewModel'
import { useRef, useEffect, useState } from 'react'

export function CardView({
  hasLabel = true,
  category,
  title,
  subtitle,
  description,
  hasDifference = false,
  differences = [],
  hasButton = false,
  hasShadow = false,
  hasImage = false,
  imageUrl,
}) {
  const {
    categoryLabel,
    button: buttonProps,
    formattedDifferences,
    handleButtonClick,
  } = useCardViewModel({
    category,
    title,
    subtitle,
    description,
    differences,
  })

  const cardRef = useRef(null)
  const [cardDimensions, setCardDimensions] = useState({ width: 0, height: 0 })
  const labelPosition = hasImage ? 'absolute top-0 -translate-y-1/2 left-[1.5rem]' : ''

  useEffect(() => {
    if (cardRef.current) {
      const { offsetWidth, offsetHeight } = cardRef.current
      setCardDimensions({
        width: offsetWidth,
        height: offsetHeight * 1.2
      })
    }
  }, [])

  return (
    <div className='flex flex-col w-fit'>
      {hasImage && imageUrl && (
        <div
          className='w-full bg-cover bg-center bg-no-repeat rounded-t-sm'
          style={{
            backgroundImage: `url(${imageUrl})`,
            width: `${cardDimensions.width}px`,
            height: `${cardDimensions.height}px`
          }}
          role="img"
          aria-label="Imagem do imóvel"
        />
      )}
      <div
        ref={cardRef}
        className={`bg-brand-white-secondary p-card md:p-card-md gap-card md:gap-card-md flex w-fit flex-col items-start ${hasImage ? 'rounded-b-sm' : 'rounded-sm'} ${hasShadow ? 'drop-shadow-md' : ''}`}
      >
        {hasLabel && <LabelView model={categoryLabel} className={labelPosition} />}
        <div className='flex flex-col gap-2'>
          <HeadingView level={3}>{title}</HeadingView>
          <HeadingView level={4} color={categoryLabel.variant}>
            {subtitle}
          </HeadingView>
        </div>
        <TextView className='uppercase'>{description}</TextView>
        {hasDifference && (
        <div className='gap-card md:gap-card-md grid w-full grid-cols-3'>
          {formattedDifferences.map((labelModel, index) => (
            <LabelView key={index} model={labelModel} />
          ))}
        </div>
        )}
        {hasButton && <ButtonView model={buttonProps} onClick={handleButtonClick} />}
      </div>
    </div>
  )
}
