import { SectionView } from '@shared/components/layout/Section/SectionView'
import { ManagementMenuView } from '@management/components/ui/ManagementMenu/ManagementMenuView'
import { ManagementFormView } from '@shared/components/ui/ManagementForm/ManagementFormView.jsx'
import { useState } from 'react'
import { EPlaceholderManagementForm } from '@shared/Enum/EPlaceholderManagementForm'

export function ProfileView() {
  const [activeMenu, setActiveMenu] = useState('perfil')
  const [isEditing, setIsEditing] = useState(false)

  const handleMenuChange = (newMenu) => {
    setActiveMenu(newMenu)
    setIsEditing(false)
  }

  // Dados iniciais simulados para teste
  const initialData = {
    perfil: {
      firstName: 'João',
      lastName: 'Silva',
      cpf: '123.456.789-00',
      birthDate: '1990-01-01',
      monthlyIncome: '5000',
      phone: '(11) 99999-9999'
    },
    acesso: {
      email: 'joao@email.com',
      currentPassword: '',
      newPassword: ''
    }
  }

  // Configurações dos campos por tipo de formulário
  const formConfigs = {
    perfil: {
      title: 'EDITAR PERFIL',
      fields: [
        {
          name: 'firstName',
          label: 'Nome',
          placeholder: EPlaceholderManagementForm.PRIMEIRO_NOME,
          required: true
        },
        {
          name: 'lastName',
          label: 'Sobrenome',
          placeholder: EPlaceholderManagementForm.SOBRENOME,
          required: true
        },
        {
          name: 'cpf',
          label: 'CPF',
          placeholder: EPlaceholderManagementForm.CPF,
          required: true
        },
        {
          name: 'birthDate',
          label: 'Data de Nascimento',
          type: 'date',
          placeholder: EPlaceholderManagementForm.DATA_NASCIMENTO,
          required: true
        },
        {
          name: 'monthlyIncome',
          label: 'Renda Média Mensal',
          type: 'number',
          placeholder: EPlaceholderManagementForm.RENDA_MEDIA,
          required: true
        },
        {
          name: 'phone',
          label: 'Celular',
          placeholder: EPlaceholderManagementForm.CELULAR,
          required: true
        }
      ],
    },
    acesso: {
      title: 'EDITAR ACESSO',
      fields: [
        {
          name: 'email',
          type: 'email',
          label: 'Email',
          placeholder: EPlaceholderManagementForm.EMAIL,
          required: true
        },
        {
          name: 'currentPassword',
          type: 'password',
          label: 'Senha Atual',
          placeholder: EPlaceholderManagementForm.SENHA_ATUAL,
          required: true
        },
        {
          name: 'newPassword',
          type: 'password',
          label: 'Nova Senha',
          placeholder: EPlaceholderManagementForm.NOVA_SENHA,
          required: true
        }
      ]
    }
  }

  const currentConfig = formConfigs[activeMenu]

  const handleSubmit = async (data) => {
    try {
      console.log('Dados enviados:', data)
      const result = { success: true, message: 'Dados atualizados com sucesso!' }

      if (result.success) {
        setIsEditing(false)
      }

      return result
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erro ao atualizar dados'
      }
    }
  }

  const handleDelete = () => {
    console.log('🗑️ Delete action')
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  return (
    <SectionView className='flex flex-col h-screen gap-0subsection md:gap-subsection-md'>
      <ManagementMenuView
        variant="perfil"
        activeMenu={activeMenu}
        setActiveMenu={handleMenuChange}
      />
      <ManagementFormView
        title={currentConfig.title}
        fields={currentConfig.fields}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onCancel={handleCancel}
        isEditing={isEditing}
        initialData={initialData[activeMenu]}
        submitWidth="fit"
      />
    </SectionView>
  )
}
