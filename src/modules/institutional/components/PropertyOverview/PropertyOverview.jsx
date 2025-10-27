import { HeadingView } from '@shared/components/ui/Heading/HeadingView.jsx'
import { TextView } from '@shared/components/ui/Text/TextView.jsx'

export function PropertyOverview({ overview }) {
  return (
    <div className="md:w-4/5 min-h-[340px]">
      <HeadingView level={3} className="mb-8 uppercase text-distac-primary">
        Sobre o Imóvel
      </HeadingView>
      <TextView className="text-default-dark-muted leading-relaxed">{overview}</TextView>
    </div>
  )
}
