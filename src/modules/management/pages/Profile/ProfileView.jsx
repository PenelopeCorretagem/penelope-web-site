import { SectionView } from '@shared/components/layout/Section/SectionView'
import { ManagementMenuView } from '@management/components/ui/ManagementMenu/ManagementMenuView'
import { ManagementFormView } from '@management/components/ui/ManagementForm/ManagementFormView'
import { useState } from 'react'

export function ProfileView() {

  const [activeMenu, setActiveMenu] = useState('perfil')

  return (
    <SectionView className='flex flex-col h-screen gap-0subsection md:gap-subsection-md'>
      <ManagementMenuView variant="perfil" activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      <ManagementFormView variant={activeMenu} />
    </SectionView>
  )
}
