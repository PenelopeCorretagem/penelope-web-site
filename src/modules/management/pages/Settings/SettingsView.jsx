import { SectionView } from '@shared/components/layout/Section/SectionView'
import { ManagementMenuView } from '@management/components/ui/ManagementMenu/ManagementMenuView'
import { ManagementFormView } from '@shared/components/ui/ManagementForm/ManagementFormView.jsx'
import { useState } from 'react'

export function SettingsView() {
  const [activeMenu, setActiveMenu] = useState('usuários')
  const [isEditing, setIsEditing] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState(null)

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
    setSelectedUserId(null)
  }

  // Dados simulados de usuários
  const mockUsers = [
    { id: 1, name: 'João Silva', email: 'joao@email.com' },
    { id: 2, name: 'Maria Santos', email: 'maria@email.com' },
    { id: 3, name: 'Pedro Oliveira', email: 'pedro@email.com' }
  ]

  // Dados iniciais simulados para teste
  const initialData = {
    usuários: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'user'
    },
    imóveis: {
      address: '',
      city: '',
      state: '',
      zipCode: '',
      price: ''
    }
  }

  // Configurações dos campos por tipo de formulário
  const formConfigs = {
    usuários: {
      title: isEditing && selectedUserId ? 'EDITAR USUÁRIO' : 'ADICIONAR USUÁRIO',
      fields: [
        {
          name: 'firstName',
          label: 'Nome',
          placeholder: 'Digite o nome',
          required: true
        },
        {
          name: 'lastName',
          label: 'Sobrenome',
          placeholder: 'Digite o sobrenome',
          required: true
        },
        {
          name: 'email',
          type: 'email',
          label: 'Email',
          placeholder: 'Digite o email',
          required: true
        },
        {
          name: 'phone',
          label: 'Telefone',
          placeholder: 'Digite o telefone',
          required: true
        },
        {
          name: 'role',
          label: 'Função',
          placeholder: 'Selecione a função',
          required: true
        }
      ],
    },
    imóveis: {
      title: 'GERENCIAR IMÓVEIS',
      fields: [
        {
          name: 'address',
          label: 'Endereço',
          placeholder: 'Digite o endereço',
          required: true
        },
        {
          name: 'city',
          label: 'Cidade',
          placeholder: 'Digite a cidade',
          required: true
        },
        {
          name: 'state',
          label: 'Estado',
          placeholder: 'Digite o estado',
          required: true
        },
        {
          name: 'zipCode',
          label: 'CEP',
          placeholder: 'Digite o CEP',
          required: true
        },
        {
          name: 'price',
          type: 'number',
          label: 'Preço',
          placeholder: 'Digite o preço',
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

  const handleEdit = (userId = null) => {
    setSelectedUserId(userId)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setSelectedUserId(null)
  }

  const handleDeleteUser = (userId) => {
    console.log('🗑️ Delete user:', userId)
    // Implementar lógica de exclusão
  }

  const handleAdd = () => {
    setSelectedUserId(null)
    setIsEditing(true)
  }

  return (
    <SectionView className='flex flex-col h-screen gap-0 subsection md:gap-subsection-md'>
      <ManagementMenuView
        variant="config"
        activeMenu={activeMenu}
        setActiveMenu={handleMenuChange}
      />

      {activeMenu === 'usuários' && !isEditing ? (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">{currentConfig.title}</h2>
          <div className="flex flex-col gap-2">
            {mockUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <span className="font-medium">{user.name}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(user.id)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex">
            <button
              onClick={handleAdd}
              className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Adicionar
            </button>
          </div>
        </div>
      ) : (
        <ManagementFormView
          key={`${activeMenu}-${selectedUserId}`}
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
      )}
    </SectionView>
  )
}
