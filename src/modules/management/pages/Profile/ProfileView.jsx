import { SectionView } from '@shared/components/layout/Section/SectionView'
import { ManagementMenuView } from '@management/components/ui/ManagementMenu/ManagementMenuView'
import { ManagementFormView } from '@shared/components/ui/ManagementForm/ManagementFormView.jsx'
import { useState } from 'react'
import { EPlaceholderManagementForm } from '@shared/Enum/EPlaceholderManagementForm'

export function ProfileView() {
  const [activeMenu, setActiveMenu] = useState('perfil')
  const [isEditing, setIsEditing] = useState(false)

  // Configurações dos campos por tipo de formulário
  const formConfigs = {
    perfil: {
      title: isEditing ? 'EDITAR PERFIL' : '',
      fields: [
        {
          name: 'firstName',
          label: 'Nome',
          placeholder: EPlaceholderManagementForm.PRIMEIRO_NOME,
          required: true,
          readOnly: !isEditing
        },
        {
          name: 'lastName',
          label: 'Sobrenome',
          placeholder: EPlaceholderManagementForm.SOBRENOME,
          required: true,
          readOnly: !isEditing
        },
        {
          name: 'cpf',
          label: 'CPF',
          placeholder: EPlaceholderManagementForm.CPF,
          required: true,
          readOnly: !isEditing
        },
        {
          name: 'birthDate',
          label: 'Data de Nascimento',
          type: 'date',
          placeholder: EPlaceholderManagementForm.DATA_NASCIMENTO,
          required: true,
          readOnly: !isEditing
        },
        {
          name: 'monthlyIncome',
          label: 'Renda Média Mensal',
          type: 'number',
          placeholder: EPlaceholderManagementForm.RENDA_MEDIA,
          required: true,
          readOnly: !isEditing
        },
        {
          name: 'phone',
          label: 'Celular',
          placeholder: EPlaceholderManagementForm.CELULAR,
          required: true,
          readOnly: !isEditing
        }
      ],
    },
    acesso: {
      title: isEditing ? 'EDITAR ACESSO' : '',
      fields: [
        {
          name: 'email',
          type: 'email',
          label: 'Email',
          placeholder: EPlaceholderManagementForm.EMAIL,
          required: true,
          readOnly: !isEditing
        },
        {
          name: 'currentPassword',
          type: 'password',
          label: 'Senha Atual',
          placeholder: EPlaceholderManagementForm.SENHA_ATUAL,
          required: isEditing,
          readOnly: !isEditing
        },
        {
          name: 'newPassword',
          type: 'password',
          label: 'Nova Senha',
          placeholder: EPlaceholderManagementForm.NOVA_SENHA,
          required: isEditing,
          readOnly: !isEditing
        }
      ],
      footerContent: !isEditing ? (
        <div className="flex gap-4 justify-end">
          <button
            onClick={() => setIsEditing(true)}
            className="text-brand-pink hover:text-brand-dark-pink"
          >
            EDITAR
          </button>
        </div>
      ) : null
    }
  }

  const handleSubmit = async (_data) => {
    try {
      // TODO: Implementar chamada à API
      setIsEditing(false)
      return { success: true, message: 'Dados atualizados com sucesso!' }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erro ao atualizar dados'
      }
    }
  }

  const currentConfig = formConfigs[activeMenu]

  return (
    <SectionView className='flex flex-col h-screen gap-0subsection md:gap-subsection-md'>
      <ManagementMenuView variant="perfil" activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      <ManagementFormView
        title={currentConfig.title}
        fields={currentConfig.fields}
        footerContent={currentConfig.footerContent}
        onSubmit={isEditing ? handleSubmit : undefined}
        submitText={isEditing ? 'SALVAR' : undefined}
        submitWidth="fit"
      />
    </SectionView>
  )
}
