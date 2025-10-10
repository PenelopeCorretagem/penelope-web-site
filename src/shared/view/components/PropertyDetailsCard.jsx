import { HeadingView } from '@shared/view/components/HeadingView'
import { TextView } from '@shared/view/components/TextView'
import { LabelView } from '@shared/view/components/LabelView'
import { ButtonView } from '@shared/view/components/ButtonView'
import { ButtonModel } from '@shared/model/components/ButtonModel'
import { usePropertyCardViewModel } from '@shared/hooks/components/usePropertyCardViewModel'
import { ECategoryCard } from '@shared/Enum/components/ECategoryCard'

export function PropertyCardView({
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
  hasHoverEffect = false,
  imageUrl,
  buttonState = 'geral',
  propertyType = ECategoryCard.EM_OBRAS,
}) {
  const {
    categoryLabel,
    button: buttonProps,
    formattedDifferences,
    handleButtonClick,
  } = usePropertyCardViewModel({
    category,
    title,
    subtitle,
    description,
    differences,
  })

  const getButtonColor = (category) => {
    switch (category) {
      case ECategoryCard.LANCAMENTO:
        return 'pink';
      case ECategoryCard.EM_OBRAS:
        return 'soft-brown';
      case ECategoryCard.DISPONIVEL:
        return 'brown';
      default:
        return 'pink';
    }
  };

  const buttonColor = getButtonColor(propertyType);
  const labelPosition = hasImage ? 'absolute top-0 -translate-y-1/2 left-[1.5rem]' : ''

  return (
    <div className={`flex flex-col max-w-sm ${hasHoverEffect ? 'transition-transform hover:scale-105' : ''}`}>
      {hasImage && imageUrl && (
        <div
          className='w-full h-48 bg-cover bg-center bg-no-repeat rounded-t-sm'
          style={{
            backgroundImage: `url(${imageUrl})`
          }}
          role="img"
          aria-label="Imagem do imóvel"
        />
      )}
      <div
        className={`bg-brand-white-secondary p-card md:p-card-md gap-card md:gap-card-md flex w-full flex-col items-start ${hasImage ? 'rounded-b-sm' : 'rounded-sm'} ${hasShadow ? 'drop-shadow-md' : ''}`}
      >
        {hasLabel && <LabelView model={categoryLabel} className={labelPosition} />}
        <div className='flex flex-col gap-2'>
          <HeadingView level={3}>{title}</HeadingView>
          <HeadingView level={4} color={categoryLabel.variant}>
            {subtitle}
          </HeadingView>
        </div>
        <TextView className='uppercase'>{description}</TextView>
        {hasButton && (
          <div className='flex flex-col gap-3 w-full'>
            {buttonState === 'geral' ? (
              <>
                <div className='flex gap-2 w-full'>
                  <ButtonView
                    model={new ButtonModel('Ver Galeria', buttonColor, 'button')}
                    onClick={handleButtonClick}
                    width='full'
                  />
                  <ButtonView
                    model={new ButtonModel('Ver Planta', buttonColor, 'button')}
                    onClick={() => console.log('Contato clicado')}
                    width='full'
                  />
                </div>
                <ButtonView
                  model={new ButtonModel('Assistir Video', buttonColor, 'button')}
                  onClick={handleButtonClick}
                  width='full'
                />
              </>
            ) : (
              <>
                <ButtonView
                  model={new ButtonModel('Conversar Pelo WhatsApp', buttonColor, 'button')}
                  onClick={handleButtonClick}
                  width='full'
                />
                <ButtonView
                  model={new ButtonModel('Agendar Visita', 'brown', 'button')}
                  onClick={handleButtonClick}
                  width='full'
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export const PropertyDetailsCard = PropertyCardView
