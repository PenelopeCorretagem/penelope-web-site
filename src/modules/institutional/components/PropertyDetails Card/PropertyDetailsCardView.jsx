import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { TextView } from '@shared/components/ui/Text/TextView'
import { LabelView } from '@shared/components/ui/Label/LabelView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { usePropertyDetailsCardViewModel } from '../PropertyDetailsCard/usePropertyDetailsCardViewModel'

export function PropertyDetailsCardView({
  hasLabel = true,
  category,
  title,
  subtitle,
  description,
  hasDifference = false,
  hasButton = false,
  hasShadow = false,
  hasImage = false,
  hasHoverEffect = false,
  imageUrl,
  buttonState = 'contato',
}) {
  const {
    categoryLabel,
    labelPosition,
    cardClasses,
    containerClasses,
    buttonColor,
    handleButtonClick,
  } = usePropertyDetailsCardViewModel({
    hasLabel,
    category,
    title,
    subtitle,
    description,
    hasDifference,
    hasButton,
    hasShadow,
    hasImage,
    hasHoverEffect,
    imageUrl,
    buttonState,
  })

  return (
    <div className={containerClasses}>
      {hasImage && imageUrl && (
        <div
          className='w-full h-48 bg-cover bg-center bg-no-repeat rounded-t-sm'
          style={{ backgroundImage: `url(${imageUrl})` }}
          role="img"
          aria-label="Imagem do imóvel"
        />
      )}
      <div className={cardClasses}>
        {hasLabel && <LabelView model={categoryLabel} className={labelPosition} />}
        <div className='flex flex-col gap-2'>
          <HeadingView level={3}>{title}</HeadingView>
          <HeadingView level={4} className={`text-brand-${categoryLabel.variant}`}>
            {subtitle}
          </HeadingView>
        </div>
        <TextView className='uppercase'>{description}</TextView>
        {hasButton && (
          <div className="flex flex-col gap-3 w-full">
            {buttonState === 'geral' ? (
              <>
                <div className="flex gap-2 w-full">
                  <ButtonView
                    variant={buttonColor}
                    type="button"
                    onClick={() => handleButtonClick('gallery')}
                  >
                    Ver Galeria
                  </ButtonView>
                  <ButtonView
                    variant={buttonColor}
                    type="button"
                    onClick={() => handleButtonClick('floorplan')}
                  >
                    Ver Planta
                  </ButtonView>
                </div>
                <ButtonView
                  variant={buttonColor}
                  type="button"
                  onClick={() => handleButtonClick('video')}
                >
                  Assistir Video
                </ButtonView>
              </>
            ) : (
              <>
                <ButtonView
                  variant={buttonColor}
                  type="button"
                  onClick={() => handleButtonClick('whatsapp')}
                >
                  Conversar pelo WhatsApp
                </ButtonView>
                <ButtonView
                  variant="brown"
                  type="button"
                  onClick={() => handleButtonClick('visit')}
                >
                  Agendar Visita
                </ButtonView>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
