import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getAdvertisementById,
  createAdvertisement,
  updateAdvertisement,
  deleteAdvertisement
} from '@app/services/api/advertisementApi'
import { getUsersWithCreci } from '@app/services/api/userApi'
import { PropertyConfigModel } from './PropertyConfigModel'
import { RouterModel } from '@app/routes/RouterModel'

export const usePropertyConfigViewModel = (propertyId) => {
  const navigate = useNavigate()
  const router = RouterModel.getInstance()
  const [model, setModel] = useState(() => new PropertyConfigModel())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [initialData, setInitialData] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [usersWithCreci, setUsersWithCreci] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(true)

  useEffect(() => {
    console.log('PropertyConfigViewModel - propertyId:', propertyId)

    // Carrega usuários com CRECI
    loadUsersWithCreci()

    // Verifica se é uma rota de edição válida
    if (propertyId && propertyId !== 'novo') {
      loadPropertyData(propertyId)
    } else {
      // Para novo imóvel, usa dados vazios
      const emptyModel = new PropertyConfigModel()
      setInitialData(emptyModel.toFormData())
    }
  }, [propertyId])

  const loadUsersWithCreci = async () => {
    try {
      setLoadingUsers(true)
      console.log('🔄 [PROPERTY CONFIG] Iniciando carregamento de usuários...')

      const users = await getUsersWithCreci()
      console.log('✅ [PROPERTY CONFIG] Usuários carregados:', users.length, users)

      setUsersWithCreci(users)
    } catch (err) {
      console.error('❌ [PROPERTY CONFIG] Erro ao carregar usuários:', err)
      setUsersWithCreci([])
    } finally {
      console.log('🏁 [PROPERTY CONFIG] Finalizando carregamento de usuários')
      setLoadingUsers(false)
    }
  }

  const loadPropertyData = async (id) => {
    try {
      setLoading(true)
      setError(null)

      console.log('Loading property with id:', id)
      // Usando a API estruturada que retorna entidade Advertisement
      const advertisementEntity = await getAdvertisementById(id)
      console.log('Advertisement entity received:', advertisementEntity)

      // Converte a entidade para o modelo de configuração
      const propertyModel = PropertyConfigModel.fromAdvertisementEntity(advertisementEntity)
      console.log('PropertyModel created:', propertyModel)

      const formData = propertyModel.toFormData()
      console.log('Form data:', formData)

      setModel(propertyModel)
      setInitialData(formData)
    } catch (err) {
      console.error('Erro ao carregar propriedade:', err)
      setError('Não foi possível carregar os dados da propriedade.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true)
      setError(null)

      console.log('Submitting property data:', formData)

      const apiRequest = model.toApiRequest(formData)
      console.log('API request:', apiRequest)

      let result
      if (model.isNew()) {
        result = await createAdvertisement(apiRequest)
        console.log('Property created:', result)
      } else {
        result = await updateAdvertisement(propertyId, apiRequest)
        console.log('Property updated:', result)
      }

      // Navegar de volta para a listagem
      navigate(router.get('ADMIN_PROPERTIES'))

      return {
        success: true,
        message: model.isNew() ? 'Propriedade criada com sucesso!' : 'Propriedade atualizada com sucesso!'
      }
    } catch (err) {
      console.error('Erro ao salvar propriedade:', err)
      const errorMessage = err.response?.data?.message || 'Erro ao salvar propriedade. Tente novamente.'
      setError(errorMessage)

      return {
        success: false,
        message: errorMessage
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!propertyId || model.isNew()) {
      console.warn('Cannot delete: no property ID or is new property')
      return
    }

    try {
      setSubmitting(true)
      setError(null)

      console.log('Deleting property:', propertyId)
      await deleteAdvertisement(propertyId)
      console.log('Property deleted successfully')

      // Navegar de volta para a listagem
      navigate(router.get('ADMIN_PROPERTIES'))
    } catch (err) {
      console.error('Erro ao excluir propriedade:', err)
      const errorMessage = err.response?.data?.message || 'Erro ao excluir propriedade. Tente novamente.'
      setError(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  const handleClear = (currentStepIndex) => {
    console.log(`Clearing fields from step ${currentStepIndex + 1}`)
  }

  const handleCancel = () => {
    navigate(router.get('ADMIN_PROPERTIES'))
  }

  return {
    model,
    loading,
    error,
    initialData,
    submitting,
    usersWithCreci,
    loadingUsers,
    isNew: model.isNew(),
    handleSubmit,
    handleDelete,
    handleClear,
    handleCancel
  }
}
