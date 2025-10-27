import { HeadingView } from '@shared/components/ui/Heading/HeadingView.jsx'
import { TextView } from '@shared/components/ui/Text/TextView.jsx'

export function PropertyRegion({ regionDescription, image }) {
  return (
    <div className="grid md:grid-cols-2 items-center gap-16">
      <div>
        <HeadingView level={3} className="mb-10 uppercase text-distac-primary">
          Sobre a Região
        </HeadingView>
        <TextView className="text-default-dark-muted leading-relaxed">
          {regionDescription}
        </TextView>
      </div>
      <img src={image} alt="Região" className="rounded shadow-lg" />
    </div>
  )
}
