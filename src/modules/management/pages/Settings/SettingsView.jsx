import { SectionView } from '@shared/components/layout/Section/SectionView'
import { ManagementMenuView } from '@management/components/ui/ManagementMenu/ManagementMenuView'
import { ManagementFormView } from '@shared/components/ui/ManagementForm/ManagementFormView.jsx'
import { useState } from 'react'

export function SettingsView() {
  const [activeMenu, setActiveMenu] = useState('perfil')
  const [isEditing, setIsEditing] = useState(false)

  // Placeholders para os campos do formulário
  const placeholders = {
    primeiroNome: 'Digite seu primeiro nome',
    sobrenome: 'Digite seu sobrenome',
    cpf: 'Digite seu CPF (somente números)',
    dataNascimento: 'DD/MM/AAAA',
    rendaMedia: 'Informe sua renda mensal aproximada',
    celular: 'Digite seu número de celular com DDD',
    email: 'Digite seu endereço de e-mail',
    senhaAtual: 'Digite sua senha atual',
    novaSenha: 'Crie uma nova senha'
  }

  const handleMenuChange = (newMenu) => {
    console.log('handleMenuChange called with:', newMenu)
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
      currentPassword: '12345678',
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
          placeholder: placeholders.primeiroNome,
          required: true
        },
        {
          name: 'lastName',
          label: 'Sobrenome',
          placeholder: placeholders.sobrenome,
          required: true
        },
        {
          name: 'cpf',
          label: 'CPF',
          placeholder: placeholders.cpf,
          required: true
        },
        {
          name: 'birthDate',
          label: 'Data de Nascimento',
          type: 'date',
          placeholder: placeholders.dataNascimento,
          required: true
        },
        {
          name: 'monthlyIncome',
          label: 'Renda Média Mensal',
          type: 'number',
          placeholder: placeholders.rendaMedia,
          required: true
        },
        {
          name: 'phone',
          label: 'Celular',
          placeholder: placeholders.celular,
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
          placeholder: placeholders.email,
          required: true
        },
        {
          name: 'currentPassword',
          type: 'password',
          label: 'Senha Atual',
          placeholder: placeholders.senhaAtual,
          required: true
        },
        {
          name: 'newPassword',
          type: 'password',
          label: 'Nova Senha',
          placeholder: placeholders.novaSenha,
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
    <SectionView className='flex flex-col h-screen gap-0 subsection md:gap-subsection-md'>
      <ManagementMenuView
        variant="perfil"
        activeMenu={activeMenu}
        setActiveMenu={handleMenuChange}
      />
      <ManagementFormView
        key={activeMenu}
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
