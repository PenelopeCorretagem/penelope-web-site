import { PageManagementView } from '@management/components/PageManegement/PageManegementView'
import { SectionView } from '@shared/components/layout/Section/SectionView'
import { EditFormView } from '@shared/components/features/EditForm/EditFormView'
import { BackButtonView } from '@shared/components/ui/BackButton/BackButtonView'
import { AlertView } from '@shared/components/feedback/Alert/AlertView'
import { SkeletonView } from '@shared/components/ui/Skeleton/SkeletonView'
import { useUserConfigViewModel } from './useUserConfigViewModel'
import { useHeaderHeight } from '@shared/hooks/useHeaderHeight'
import { useNavigate } from 'react-router-dom'
import { useMinLoadingTime } from '@shared/hooks/useMinLoadingTime';

export function UserConfigView() {
  const {
    formData,
    userConfigFields,
    alertConfig,
    loading,
    isEditMode,
    handleSubmit,
    handleDelete,
    handleCloseAlert
  } = useUserConfigViewModel()

  const headerHeight = useHeaderHeight()
  const navigate = useNavigate()

  // Clean cancel function for UserConfig - always goes back
  const handleCancelUserConfig = () => {
  const isMinLoading = useMinLoadingTime(loading);
    navigate(-1)
  }

  if (isMinLoading) {
    return (
      <div style={{ '--header-height': `${headerHeight}px` }}>
        <SectionView
          className="flex flex-col min-h-[calc(100vh-var(--header-height))] gap-subsection md:gap-subsection-md"
        >
          <SkeletonView className="h-10 w-48 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SkeletonView className="h-14 w-full" />
            <SkeletonView className="h-14 w-full" />
            <SkeletonView className="h-14 w-full" />
            <SkeletonView className="h-14 w-full" />
          </div>
          <SkeletonView className="h-12 w-full md:w-48 mt-4" />
        </SectionView>
      </div>
    )
  }

  return (
    <PageManagementView
      iconName="Users"
      title="Usuários"
      className="flex flex-col subsection h-full overflow-hidden !gap-subsection md:!gap-subsection-md"
      actions={<BackButtonView mode="text" text="Voltar" />}
    >
      <div className="flex-1 overflow-hidden">
        <EditFormView
          fields={userConfigFields}
          initialData={formData}
          onSubmit={handleSubmit}
          onCancel={handleCancelUserConfig}
          isEditing={true}
          showDeleteButton={isEditMode}
          onDelete={isEditMode ? handleDelete : undefined}
        />
      </div>

      <AlertView
        isVisible={!!alertConfig}
        type={alertConfig?.type}
        message={alertConfig?.message}
        onClose={handleCloseAlert}
      />
    </PageManagementView>
  )
}
