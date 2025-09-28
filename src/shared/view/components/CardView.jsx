import { HeadingView } from '@shared/view/components/HeadingView'
import { TextView } from '@shared/view/components/TextView'
import { LabelView } from '@shared/view/components/LabelView'
import { ButtonView } from '@shared/view/components/ButtonView'
import { useCardViewModel } from '@shared/hooks/components/useCardViewModel'

export function CardView({
  label = true,
  category,
  title,
  subtitle,
  description,
  diference = false,
  differences = [],
  button = false,
  shadow = false,
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

  return (
    <div
      className={`bg-brand-white-secondary p-card md:p-card-md gap-card md:gap-card-md flex w-fit flex-col items-start rounded-sm ${shadow ? 'drop-shadow-md' : ''}`}
    >
      {label && <LabelView model={categoryLabel} />}
      <div className='flex flex-col gap-2'>
        <HeadingView level={3}>{title}</HeadingView>
        <HeadingView level={4} color={categoryLabel.color}>
          {subtitle}
        </HeadingView>
      </div>
      <TextView className='uppercase'>{description}</TextView>
      {diference && (
        <div className='gap-card md:gap-card-md flex w-full flex-wrap'>
          {formattedDifferences.map((labelModel, index) => (
            <LabelView key={index} model={labelModel} />
          ))}
        </div>
      )}
      {button && <ButtonView model={buttonProps} onClick={handleButtonClick} />}
    </div>
  )
}
