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
        getUserById(id).then((userData) => {
          setFormData({
            name: userData.name || '',
            email: userData.email || '',
            phone: userData.phone || '',
            creci: userData.creci || '',
            cpf: userData.cpf || '',
            dateBirth: userData.dateBirth || '',
            monthlyIncome: userData.monthlyIncome || '',
            accessLevel: userData.accessLevel || 'CLIENTE',
            password: ''
          })
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
