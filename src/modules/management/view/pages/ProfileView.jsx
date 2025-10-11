import { SectionView } from '@shared/view/components/SectionView'
import { ManagementMenuView } from '@management/view/components/ManagementMenuView'
import { ManagementFormView } from '@management/view/components/ManagementFormView'
import { useState } from 'react'

export function ProfileView() {

  const [activeMenu, setActiveMenu] = useState('perfil')

  return (
    <SectionView>
      <ManagementMenuView variant="perfil" activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      <ManagementFormView variant={activeMenu} />
    </SectionView>
  )
}
