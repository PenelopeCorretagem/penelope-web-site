import { PageManagementView } from '@management/components/PageManegement/PageManegementView'
import { SectionView } from '@shared/components/layout/Section/SectionView'
import { AlertView } from '@shared/components/feedback/Alert/AlertView'
import { EditFormView } from '@shared/components/features/EditForm/EditFormView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { SkeletonView } from '@shared/components/ui/Skeleton/SkeletonView'
import { useAccountViewModel } from './useAccountViewModel'
import { useMinLoadingTime } from '@shared/hooks/useMinLoadingTime';

export function AccountView() {
  const vm = useAccountViewModel()
  const isMinLoading = useMinLoadingTime(vm.isLoading);

  if (isMinLoading) {
    return (
      <SectionView className='flex flex-col h-screen gap-subsection subsection md:gap-subsection-md'>
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
      <SectionView className='flex flex-col h-screen gap-subsection subsection md:gap-subsection-md items-center justify-center'>
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
      iconName="Lock"
      title="Minha Conta"
      className='flex flex-col h-full gap-subsection subsection md:gap-subsection-md'
    >
      <EditFormView
        fields={vm.accountFields}
        initialData={vm.formData}
        onSubmit={vm.handleSubmit}
        onDelete={vm.handleDelete}
        showDeleteButton={true}
        useNativeDeleteConfirm={false}
      />

      <AlertView
        isVisible={!!vm.alertConfig}
        type={vm.alertConfig?.type}
        message={vm.alertConfig?.message}
        hasCloseButton={!vm.alertConfig?.isConfirm}
        onClose={vm.handleCloseAlert}
        buttonsLayout="col"
      >
        {vm.alertConfig?.isConfirm && (
          <div className="flex justify-center gap-card md:gap-card-md w-full">
            <ButtonView
              type="button"
              shape="square"
              color="border-distac-primary"
              onClick={vm.handleCloseAlert}
              width="fit"
            >
              Cancelar
            </ButtonView>
            <ButtonView
              type="button"
              shape="square"
              color="pink"
              onClick={vm.handleConfirmDelete}
              width="fit"
              disabled={vm.isDeleting}
            >
              {vm.isDeleting ? 'Excluindo...' : (vm.alertConfig?.confirmText || 'Confirmar')}
            </ButtonView>
          </div>
        )}
      </AlertView>
    </PageManagementView>
  )
}
