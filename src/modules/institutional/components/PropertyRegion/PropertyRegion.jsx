import { HeadingView } from '@shared/components/ui/Heading/HeadingView.jsx'
import { TextView } from '@shared/components/ui/Text/TextView.jsx'

export function PropertyRegion({ regionDescription, image }) {
  return (
    <div className="grid md:grid-cols-2 items-center gap-16">
      <div>
        <HeadingView level={2} className="mb-10 text-distac-primary">
          Sobre a Região
        </HeadingView>
        <TextView className="text-default-dark-muted leading-relaxed">
          {regionDescription}
        </TextView>
      </div>
      <div className="flex justify-center">
        <img
          src={image}
          alt="Região"
          className="rounded shadow-lg w-full max-w-lg object-cover"
        />
      </div>
    </div>
  )
}
