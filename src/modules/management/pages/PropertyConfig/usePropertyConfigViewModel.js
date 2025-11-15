import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAdvertisementById } from '@app/services/api/advertisementApi'
import { PropertyConfigModel } from './PropertyConfigModel'
import { RouterModel } from '@app/routes/RouterModel'

export const usePropertyConfigViewModel = (propertyId) => {
  const navigate = useNavigate()
  const router = RouterModel.getInstance()
  const [model, setModel] = useState(() => new PropertyConfigModel())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [initialData, setInitialData] = useState(null)

  useEffect(() => {
    console.log('PropertyConfigViewModel - propertyId:', propertyId)

    // Verifica se é uma rota de edição válida
    if (propertyId && propertyId !== 'novo') {
      loadPropertyData(propertyId)
    } else {
      // Para novo imóvel, usa dados vazios
      const emptyModel = new PropertyConfigModel()
      setInitialData(emptyModel.toFormData())
    }
  }, [propertyId])

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
    console.log('Submitting property data:', formData)
    // TODO: Implementar lógica de salvamento
    return {
      success: true,
      message: model.isNew() ? 'Propriedade criada com sucesso!' : 'Propriedade atualizada com sucesso!'
    }
  }

  const handleDelete = async (formData) => {
    console.log('Deleting property:', formData)
    // TODO: Implementar lógica de exclusão
    navigate(router.get('ADMIN_PROPERTIES'))
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
    isNew: model.isNew(),
    handleSubmit,
    handleDelete,
    handleClear,
    handleCancel
  }
}
