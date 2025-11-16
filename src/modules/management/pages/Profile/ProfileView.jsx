import { SectionView } from '@shared/components/layout/Section/SectionView'
import { EditFormView } from '@shared/components/ui/EditForm/EditFormView'
import { useProfileViewModel } from './useProfileViewModel'

export function ProfileView() {
  const vm = useProfileViewModel()

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
        title="MEU PERFIL"
        fields={vm.profileFields}
        initialData={vm.formData}
        onSubmit={vm.handleSubmit}
        showDeleteButton={false}
      />
    </SectionView>
  )
}
