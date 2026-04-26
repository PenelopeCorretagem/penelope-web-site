import { SectionView } from '@shared/components/layout/Section/SectionView'
import { AlertView } from '@shared/components/feedback/Alert/AlertView'
import { EditFormView } from '@shared/components/ui/EditForm/EditFormView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { useAccountViewModel } from './useAccountViewModel'

export function AccountView() {
  const vm = useAccountViewModel()

  if (vm.isLoading) {
    return (
      <SectionView className='flex flex-col h-screen gap-subsection subsection md:gap-subsection-md'>
        <div className="w-full p-4 text-center">Carregando...</div>
      </SectionView>
    )
  }

  if (vm.error) {
    return (
      <SectionView className='flex flex-col h-screen gap-subsection subsection md:gap-subsection-md'>
        <div className="w-full p-4 text-center text-red-600">{vm.error}</div>
      </SectionView>
    )
  }

  return (
    <SectionView className='flex flex-col h-full gap-subsection subsection md:gap-subsection-md'>
      <EditFormView
        title="MINHA CONTA"
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
    </SectionView>
  )
}
