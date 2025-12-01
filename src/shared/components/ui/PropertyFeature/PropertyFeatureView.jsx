import { featureIconConstant } from '@constant/featureIconConstant'
import { TextView } from '@shared/components/ui/Text/TextView'
import { Feature } from '@entity/Feature'


export const PropertyFeatureView = ({ feature }) => {

  if (feature && !(feature instanceof Feature)) {
    throw new Error(`O feature: ${feature} não é uma instância válida`)
  }

  const description = feature?.description ?? ''
  if (!description) {
    return null
  }

  const iconKey = description.toUpperCase().replace(/ /g, '_')
  const IconComponent = featureIconConstant[iconKey]

  return (
    <div
      className="flex items-center justify-center gap-3 bg-default-dark-light rounded-sm px-4 py-3 w-fit"
    >
      {IconComponent && (
        <IconComponent className="w-5 h-5 text-default-light flex-shrink-0" />
      )}
      <TextView className="text-default-light text-center font-medium">
        {description}
      </TextView>
    </div>
  )
}
