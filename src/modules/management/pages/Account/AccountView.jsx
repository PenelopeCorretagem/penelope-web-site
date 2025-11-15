import { SectionView } from '@shared/components/layout/Section/SectionView'
import { EditFormView } from '@shared/components/ui/EditForm/EditFormView'
import { useState } from 'react'

export function AccountView() {
  const [formData, setFormData] = useState({
    email: 'joao@email.com',
    currentPassword: '',
    newPassword: ''
  })

  const accountFields = [
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      placeholder: 'Digite seu endereço de e-mail',
      required: true,
      defaultValue: formData.email
    },
    {
      name: 'currentPassword',
      type: 'password',
      label: 'Senha Atual',
      placeholder: 'Digite sua senha atual',
      required: true,
      showPasswordToggle: true,
      defaultValue: formData.currentPassword
    },
    {
      name: 'newPassword',
      type: 'password',
      label: 'Nova Senha',
      placeholder: 'Crie uma nova senha (deixe em branco para manter a atual)',
      required: false,
      showPasswordToggle: true,
      defaultValue: formData.newPassword
    }
  ]

  const handleSubmit = async (data) => {
    try {
      console.log('Dados enviados:', data)
      setFormData(prev => ({ ...prev, ...data }))
      return { success: true, message: 'Dados de acesso atualizados com sucesso!' }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erro ao atualizar dados de acesso'
      }
    }
  }

  const handleDelete = () => {
    console.log('🗑️ Excluir conta')
    // Implementar lógica de exclusão da conta
  }

  return (
    <SectionView className='flex flex-col h-screen gap-subsection subsection md:gap-subsection-md'>
      <EditFormView
        title="MINHA CONTA"
        fields={accountFields}
        initialData={formData}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        showDeleteButton={true}
      />
    </SectionView>
  )
}
