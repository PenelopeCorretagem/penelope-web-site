import { HeadingView } from '@shared/components/ui/Heading/HeadingView.jsx'
import { TextView } from '@shared/components/ui/Text/TextView.jsx'
import { EFeatureIcon } from './EFeatureIcon.js'

export function PropertyFeatures({ features }) {
  return (
    <div>
      <HeadingView level={2} className="text-distac-primary mb-10">
        Diferenciais
      </HeadingView>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl">
        {features.map((feature) => {
          const IconComponent = EFeatureIcon[feature.icon]

          return (
            <div
              key={feature.label}
              className="flex items-center justify-center gap-3 bg-default-dark-light rounded-sm px-4 py-3"
            >
              {IconComponent && (
                <IconComponent className="w-5 h-5 text-default-light flex-shrink-0" />
              )}
              <TextView className="text-default-light text-center font-medium">
                {feature.label}
              </TextView>
            </div>
          )
        })}
      </div>
    </div>
  )
}
