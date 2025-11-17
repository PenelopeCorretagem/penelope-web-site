import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useRouter } from '@app/routes/useRouterViewModel'

export function useUserConfigViewModel() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { navigateTo, getAllRoutes } = useRouter()
  const routes = getAllRoutes()

  const [selectedUser, setSelectedUser] = useState(null)
  const [alertConfig, setAlertConfig] = useState(null)
  const [loading, setLoading] = useState(false)
  const isEditMode = !!id

  // Mock user data - replace with actual API calls
  useEffect(() => {
    if (isEditMode && id) {
      setLoading(true)
      // TODO: Replace with actual API call
      setTimeout(() => {
        const mockUser = {
          id: id,
          nomeCompleto: 'Usuário Exemplo',
          email: 'usuario@exemplo.com',
          accessLevel: 'CLIENTE',
          creci: ''
        }
        setSelectedUser(mockUser)
        setLoading(false)
      }, 500)
    }
  }, [isEditMode, id])

  const userConfigFields = [
    {
      name: 'nomeCompleto',
      label: 'Nome Completo',
      type: 'text',
      required: true,
      placeholder: 'Digite o nome completo'
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      placeholder: 'Digite o email'
    },
    {
      name: 'accessLevel',
      label: 'Nível de Acesso',
      type: 'select',
      required: true,
      options: [
        { value: 'CLIENTE', label: 'Cliente' },
        { value: 'ADMINISTRADOR', label: 'Administrador' }
      ]
    },
    {
      name: 'creci',
      label: 'CRECI (opcional)',
      type: 'text',
      required: false,
      placeholder: 'Digite o número do CRECI'
    },
    ...(isEditMode ? [] : [{
      name: 'senha',
      label: 'Senha',
      type: 'password',
      required: true,
      placeholder: 'Digite a senha'
    }])
  ]

  const handleSubmit = useCallback(async (formData) => {
    try {
      setLoading(true)

      // TODO: Replace with actual API calls
      await new Promise(resolve => setTimeout(resolve, 1000))

      setAlertConfig({
        type: 'success',
        message: isEditMode ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!'
      })

      setTimeout(() => {
        navigateTo(routes.ADMIN_USERS)
      }, 2000)
    } catch (error) {
      setAlertConfig({
        type: 'error',
        message: error.message || 'Erro ao salvar usuário'
      })
    } finally {
      setLoading(false)
    }
  }, [isEditMode, navigateTo, routes.ADMIN_USERS])

  const handleDelete = useCallback(async () => {
    if (!isEditMode || !id) return

    try {
      setLoading(true)

      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setAlertConfig({
        type: 'success',
        message: 'Usuário excluído com sucesso!'
      })

      setTimeout(() => {
        navigateTo(routes.ADMIN_USERS)
      }, 2000)
    } catch (error) {
      setAlertConfig({
        type: 'error',
        message: error.message || 'Erro ao excluir usuário'
      })
    } finally {
      setLoading(false)
    }
  }, [isEditMode, id, navigateTo, routes.ADMIN_USERS])

  const handleCloseAlert = useCallback(() => {
    setAlertConfig(null)
  }, [])

  return {
    selectedUser,
    userConfigFields,
    alertConfig,
    loading,
    isEditMode,
    handleSubmit,
    handleDelete,
    handleCloseAlert
  }
}
