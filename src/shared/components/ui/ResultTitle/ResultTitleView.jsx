import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { useResultTitleViewModel } from './useResultTitleViewModel'

export function ResultTitleView({ results, filters = null }) {
  const { title } = useResultTitleViewModel(results, filters)

  return (
    <div className='bg-surface-primary flex h-fit items-center justify-between py-6 px-24'>
      <HeadingView>{title}</HeadingView>
    </div>
  )
}
