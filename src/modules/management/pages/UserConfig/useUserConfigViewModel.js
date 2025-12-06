import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useRouter } from '@app/routes/useRouterViewModel'
import { UserConfigModel } from './UserConfigModel'
import { formatCurrencyForDisplay } from '@shared/utils/formatCurrencyUtil'
import { registerUser, updateUser, deleteUser, getUserById }  from '@app/services/api/userApi'

export function useUserConfigViewModel() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { navigateTo, getAllRoutes } = useRouter()
  const routes = getAllRoutes()

  const [model, setModel] = useState(new UserConfigModel())
  const [formData, setFormData] = useState({})
  const [alertConfig, setAlertConfig] = useState(null)
  const [loading, setLoading] = useState(false)
  const isEditMode = !!id

  // Load user data for edit mode
  useEffect(() => {
    if (isEditMode && id) {
      setLoading(true)
      // TODO: Replace with actual API call
      setTimeout(() => {
        const mockUser = {
          id: id,
          name: 'Usuário Exemplo',
          email: 'usuario@exemplo.com',
          phone: '11987654321',
          cpf: '12345678909',
          dateBirth: '1990-01-01',
          monthlyIncome: 5000,
          accessLevel: id === '1' ? 'ADMINISTRADOR' : 'CLIENTE',
          creci: id === '1' ? '123456' : ''
        }
      } else {
        // Initialize empty form for add mode
        setFormData({
          name: userModel.name,
          email: userModel.email,
          phone: userModel.phone,
          creci: userModel.creci,
          cpf: userModel.cpf,
          dateBirth: userModel.dateBirth,
          monthlyIncome: formatCurrencyForDisplay(userModel.monthlyIncome),
          accessLevel: userModel.accessLevel,
          passowrd: '' // Sempre vazio por segurança no modo edição
        })

        setLoading(false)
      }, 500)
    } else {
      // Initialize empty form for add mode
      setFormData({
        name: '',
        email: '',
        phone: '',
        creci: '',
        cpf: '',
        dateBirth: '',
        monthlyIncome: '',
        accessLevel: 'CLIENTE',
        password: ''
      })
    }

    loadUserData()
  }, [isEditMode, id])

  // Get form fields based on mode and user access level
  const userConfigFields = UserConfigModel.getFormFields(isEditMode, model.accessLevel)

  const handleSubmit = useCallback(async (data) => {
    try {
      setLoading(true)

      // Create model with form data
      const userModel = new UserConfigModel(data)

      // Validate data using the actual form data's accessLevel
      const validation = userModel.validateWithData(data, isEditMode, data.accessLevel || 'CLIENTE')
      if (!validation.isValid) {
        const errorMessages = Object.values(validation.errors).join(', ')
        throw new Error(`Dados inválidos: ${errorMessages}`)
      }

      // Convert to API format
      const apiData = userModel.toApiFormat()

      // Call API
      if (isEditMode) {
        await updateUser(id, apiData)
      } else {
        await registerUser(apiData)
      }

      setAlertConfig({
        type: 'success',
        message: isEditMode ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!'
      })

      setTimeout(() => {
        navigateTo(routes.ADMIN_USERS)
      }, 2000)

      return {
        success: true,
        message: isEditMode ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!'
      }
    } catch (error) {
      setAlertConfig({
        type: 'error',
        message: error.message || 'Erro ao salvar usuário'
      })

      return {
        success: false,
        error: error.message || 'Erro ao salvar usuário'
      }
    } finally {
      setLoading(false)
    }
  }, [isEditMode, navigateTo, routes.ADMIN_USERS])

  const handleDelete = useCallback(async () => {
    if (!isEditMode || !id) return

    try {
      setLoading(true)

      await deleteUser(id)

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
    model,
    formData,
    userConfigFields,
    alertConfig,
    loading,
    isEditMode,
    handleSubmit,
    handleDelete,
    handleCloseAlert
  }
}
