import { HeadingView } from '@shared/view/components/HeadingView'
import { TextView } from '@shared/view/components/TextView'
import { LabelView } from '@shared/view/components/LabelView'
import { ButtonView } from '@shared/view/components/ButtonView'
import { ButtonModel } from '@shared/model/components/ButtonModel'
import { usePropertyCardViewModel } from '@shared/hooks/components/usePropertyCardViewModel'

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
  buttonState = 'geral', // 'geral' ou 'contato'
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
                {/* Dois botões lado a lado */}
                <div className='flex gap-2 w-full'>
                  <ButtonView
                    model={buttonProps}
                    onClick={handleButtonClick}
                    width='full'
                  />
                  <ButtonView
                    model={new ButtonModel('Contato', 'brown', 'button')}
                    onClick={() => console.log('Contato clicado')}
                    width='full'
                  />
                </div>
                {/* Terceiro botão abaixo */}
                <ButtonView
                  model={new ButtonModel('Favoritar', 'softBrown', 'button')}
                  onClick={() => console.log('Favoritar clicado')}
                  width='full'
                />
              </>
            ) : (
              <>
                {/* Um único botão quando state for 'contato' */}
                <ButtonView
                  model={new ButtonModel('Entre em Contato', 'brown', 'button')}
                  onClick={() => console.log('Entre em Contato clicado')}
                  width='full'
                />
                {/* Terceiro botão abaixo */}
                <ButtonView
                  model={new ButtonModel('Favoritar', 'softBrown', 'button')}
                  onClick={() => console.log('Favoritar clicado')}
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

// Export alternativo para clareza
export const PropertyDetailsCard = PropertyCardView
