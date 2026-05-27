import { SectionView } from '@shared/components/layout/Section/SectionView'

export function SectionManagementView({
  children,
  className = '',
}) {
  return (
    <SectionView className={`flex-col !gap-4 md:!gap-8 !p-9 md:!p-11 bg-default-light-alt xl:h-full relative (--header-height))] min-h-[calc(100vh-var(--header-height))]  max-h-[calc(100vh-var(--header-height))] overflow-hidden ${className}`}>
      {children}
    </SectionView>
  )
}
