import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { useResultTitleViewModel } from './useResultTitleViewModel'

export function ResultTitleView({ results, filters = null }) {
  const { title } = useResultTitleViewModel(results, filters)

  return (
    <div className='flex h-fit items-center justify-between px-section-x md:px-section-x-md pt-section-y md:pt-section-y-md'>
      <HeadingView level={2}>{title}</HeadingView>
    </div>
  )
}
