import { HeaderManagementView } from '../HeaderManagement/HeaderManagementView'
import { SectionManagementView } from '../SectionManagement/SectionManagementView'

export function PageManagementView({
  iconName,
  title,
  description = '',
  actions = null,
  headerChildren = null,
  className = '',
  headerClassName = '',
  children = null,
}) {
  return (
    <SectionManagementView className={className}>
      {(iconName || title || description || actions || headerChildren) && (
        <HeaderManagementView
          iconName={iconName}
          title={title}
          description={description}
          actions={actions}
          className={headerClassName}
        >
          {headerChildren}
        </HeaderManagementView>
      )}
      {children}
    </SectionManagementView>
  )
}
