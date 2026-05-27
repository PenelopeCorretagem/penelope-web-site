import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useRouter } from '@app/routes/useRouterViewModel'
import { UserConfigModel } from './UserConfigModel'
import { createUser, updateUser, deleteUser, getUserById } from '@api-penelopec/userApi'
import { ACCESS_LEVEL, normalizeAccessLevel } from '@constant/accessLevels'

export function useUserConfigViewModel() {
  const { id } = useParams()
  const { navigateTo, getAllRoutes } = useRouter()
  const routes = getAllRoutes()

  const [model, setModel] = useState(new UserConfigModel())
  const [formData, setFormData] = useState({})
  const [alertConfig, setAlertConfig] = useState(null)
  const [loading, setLoading] = useState(false)
  const isEditMode = !!id

  useEffect(() => {
    if (isEditMode && id) {
      setLoading(true)
      getUserById(id)
        .then((userData) => {
          const normalizedData = {
            name: userData.name || '',
            email: userData.email || '',
            phone: userData.phone || '',
            creci: userData.creci || '',
            cpf: userData.cpf || '',
            dateBirth: userData.dateBirth || '',
            monthlyIncome: userData.monthlyIncome || '',
            accessLevel: normalizeAccessLevel(userData.accessLevel || ACCESS_LEVEL.CLIENTE),
            senha: ''
          }

          setFormData(normalizedData)
          setModel(new UserConfigModel(normalizedData))
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      const emptyData = {
        name: '',
        email: '',
        phone: '',
        creci: '',
        cpf: '',
        dateBirth: '',
        monthlyIncome: '',
        accessLevel: ACCESS_LEVEL.CLIENTE,
        senha: ''
      }

      setFormData(emptyData)
      setModel(new UserConfigModel(emptyData))
    }
  }, [isEditMode, id])

  const userConfigFields = UserConfigModel.getFormFields(isEditMode, model.accessLevel)

  const handleSubmit = useCallback(async (data) => {
    try {
      setLoading(true)

      const userModel = new UserConfigModel(data)
      const validation = userModel.validateWithData(data, isEditMode, data.accessLevel || ACCESS_LEVEL.CLIENTE)

      if (!validation.isValid) {
        const errorMessages = Object.values(validation.errors).join(', ')
        throw new Error(`Dados inválidos: ${errorMessages}`)
      }

      const apiData = userModel.toApiFormat()

      if (isEditMode) {
        await updateUser(id, apiData)
      } else {
        await createUser(apiData)
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
  }, [id, isEditMode, navigateTo, routes.ADMIN_USERS])

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
  }, [id, isEditMode, navigateTo, routes.ADMIN_USERS])

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
