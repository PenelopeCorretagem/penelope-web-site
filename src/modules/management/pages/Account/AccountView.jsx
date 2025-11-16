import { SectionView } from '@shared/components/layout/Section/SectionView'
import { EditFormView } from '@shared/components/ui/EditForm/EditFormView'
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
    <SectionView className='flex flex-col h-screen gap-subsection subsection md:gap-subsection-md'>
      <EditFormView
        title="MINHA CONTA"
        fields={vm.accountFields}
        initialData={vm.formData}
        onSubmit={vm.handleSubmit}
        onDelete={vm.handleDelete}
        showDeleteButton={true}
      />
    </SectionView>
  )
}
