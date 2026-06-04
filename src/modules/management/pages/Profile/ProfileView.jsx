import { PageManagementView } from '@management/components/PageManegement/PageManegementView'
import { SectionView } from '@shared/components/layout/Section/SectionView'
import { AlertView } from '@shared/components/feedback/Alert/AlertView'
import { EditFormView } from '@shared/components/features/EditForm/EditFormView'
import { SkeletonView } from '@shared/components/ui/Skeleton/SkeletonView'
import { useProfileViewModel } from './useProfileViewModel'
import { useMinLoadingTime } from '@shared/hooks/useMinLoadingTime';

export function ProfileView({ targetUserId = null }) {
  const vm = useProfileViewModel(targetUserId)
  const isMinLoading = useMinLoadingTime(vm.isLoading);

  if (isMinLoading) {
    return (
      <SectionView className='flex flex-col min-h-screen gap-subsection subsection md:gap-subsection-md'>
        <SkeletonView className="h-10 w-48 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SkeletonView className="h-14 w-full" />
          <SkeletonView className="h-14 w-full" />
          <SkeletonView className="h-14 w-full" />
          <SkeletonView className="h-14 w-full" />
        </div>
        <SkeletonView className="h-12 w-full md:w-48 mt-4" />
      </SectionView>
    )
  }

  if (vm.error) {
    return (
      <SectionView className='flex flex-col min-h-screen gap-subsection subsection md:gap-subsection-md items-center justify-center'>
        <AlertView
          isVisible={true}
          type="error"
          message={vm.error}
          hasCloseButton={false}
          buttonsLayout="col"
          actions={[
            {
              label: 'Tentar novamente',
              onClick: () => window.location.reload(),
              color: 'distac-primary',
            },
          ]}
        />
      </SectionView>
    )
  }

  return (
    <PageManagementView
      iconName="User"
      title={vm.isEditingOwnProfile ? 'MEU PERFIL' : 'EDITAR USUÁRIO'}
    >
      <EditFormView
        fields={vm.profileFields}
        initialData={vm.formData}
        onSubmit={vm.handleSubmit}
        showDeleteButton={false}
      />
    </PageManagementView>
  )
}
