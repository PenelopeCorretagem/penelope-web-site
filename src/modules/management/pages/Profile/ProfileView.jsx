import { SectionView } from '@shared/components/layout/Section/SectionView'
import { ManagementMenuView } from '@management/components/ui/ManagementMenu/ManagementMenuView'
import { ManagementFormView } from '@shared/components/ui/ManagementForm/ManagementFormView.jsx'
import { useEffect, useState } from 'react'
import { getUserById } from '@app/services/apiService'

export function ProfileView() {
  const [activeMenu, setActiveMenu] = useState('perfil')
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState({
    perfil: {},
    acesso: {}
  })

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
    setActiveMenu(newMenu)
    setIsEditing(false)
  }

  const handleGetUser = async () => {
    try {
      const userId = localStorage.getItem('userId')
      const response = await getUserById(userId)
      const data = response.data

      setUserData({
        perfil: {
          firstName: data.name || '',
          lastName: data.lastName || '',
          cpf: data.cpf || '',
          birthDate: data.dateBirth || '',
          monthlyIncome: data.monthlyIncome || '',
          phone: data.phone || ''
        },
        acesso: {
          email: data.email || '',
          currentPassword: data.password || '',
          newPassword: ''
        }
      })

      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Ocorreu um erro ao carregar os dados do usuário.'
      return { success: false, error: errorMessage }
    }
  }

  useEffect(() => {
    handleGetUser()
  }, [])

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

  const handleSubmit = async (_data) => {
    try {
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
    // Delete action
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
        initialData={userData[activeMenu]}
        submitWidth="fit"
      />
    </SectionView>
  )
}
