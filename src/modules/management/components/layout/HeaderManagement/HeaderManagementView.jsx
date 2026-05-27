import * as LucideIcons from 'lucide-react'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'

export function HeaderManagementView({
  iconName,
  title,
  description = '',
  actions = null,
  children = null,
  className = '',
}) {
  const Icon = iconName ? LucideIcons[iconName] : null

  return (
    <div className={`rounded-lg border border-default-light-muted bg-default-light px-4 py-3 shadow-sm flex gap-4 md:gap-40 justify-between items-center h-fit w-full ${className}`}>

      {title && (
      <div className="flex gap-3 md:flex-row md:items-end md:justify-between h-fit">
        <div className="flex items-center gap-3 w-fit h-fit">
          {Icon && <Icon size={28} className="text-distac-primary" aria-hidden="true" />}
          <div className="flex flex-col gap-1 w-fit h-fit">
            <HeadingView level={4} className="text-distac-primary whitespace-nowrap w-fit">
              {title}
            </HeadingView>
            {description ? (
              <p className="text-sm text-default-dark-light">{description}</p>
            ) : null}
          </div>
        </div>
      </div>
      )}

      {children ? <div className="flex flex-row gap-3 h-fit w-full justify-end">{children}</div> : null}

      {actions ? (
        <div className="flex flex-wrap gap-3 items-center justify-end h-fit">
          {actions}
        </div>
      ) : null}
    </div>
  )
}
