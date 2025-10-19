import { SectionView } from '@shared/components/layout/Section/SectionView'
import { ManagementMenuView } from '@management/components/ui/ManagementMenu/ManagementMenuView'
import { ManagementFormView } from '@shared/components/ui/ManagementForm/ManagementFormView.jsx'
import { useState } from 'react'
import { EPlaceholderManagementForm } from '@shared/Enum/EPlaceholderManagementForm'

export function ProfileView() {
  const [activeMenu, setActiveMenu] = useState('perfil')

  // Handler para mudar menu e resetar edição
  const handleMenuChange = (newMenu) => {
    setActiveMenu(newMenu)
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

  const handleSubmit = async (data) => {
    try {
      // TODO: Implementar chamada à API
      console.log('Dados enviados:', data)

      // Simular sucesso
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
      <ManagementMenuView
        variant="perfil"
        activeMenu={activeMenu}
        setActiveMenu={handleMenuChange}
      />
      <ManagementFormView
        key={activeMenu}
        title={currentConfig.title}
        fields={currentConfig.fields}
        footerContent={currentConfig.footerContent}
        onSubmit={handleSubmit}
        submitWidth="fit"
      />
    </SectionView>
  )
}
