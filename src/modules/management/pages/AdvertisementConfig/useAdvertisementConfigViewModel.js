import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdvertisementConfigModel } from './AdvertisementConfigModel'
import { getAdvertisementById, createAdvertisement, updateAdvertisement, deleteAdvertisement } from '@service-penelopec/advertisementService'
import { uploadImages } from '@api-penelopec/imageApi'
import { getUsersWithCreci } from '@service-penelopec/userService'
import { getAllAmenities } from '@service-penelopec/amenitiesService'

const DELETE_BLOCKED_BY_APPOINTMENTS_MESSAGE = 'Não é possível deletar esse imóvel pois existe um histórico de agendamentos atrelado a ele.'

const resolveApiErrorMessage = (error, fallbackMessage) => {
  const apiMessage = error?.response?.data?.message
  if (typeof apiMessage === 'string' && apiMessage.trim()) {
    return apiMessage
  }

  if (typeof error?.message === 'string' && error.message.trim()) {
    return error.message
  }

  return fallbackMessage
}

const isDeleteBlockedByAppointments = (error) => {
  const rawMessage = [
    error?.response?.data?.message,
    error?.response?.data?.error,
    error?.message,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  return rawMessage.includes('histórico de agendamentos')
    || rawMessage.includes('historico de agendamentos')
    || rawMessage.includes('fk_agendamento_empreendimento')
    || (rawMessage.includes('agendamento') && rawMessage.includes('empreendimento'))
}

export function useAdvertisementConfigViewModel(id) {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [loadingAmenities, setLoadingAmenities] = useState(true)
  const [error, setError] = useState(null)
  const [initialData, setInitialData] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [usersWithCreci, setUsersWithCreci] = useState([])
  const [amenities, setAmenities] = useState([])
  const [alertConfig, setAlertConfig] = useState(null)

  const isNew = !id || id === 'novo' || id === 'new'

  const showAlert = (type, message, onClose = null) => {
    setAlertConfig({ type, message, onClose })
  }

  // Carregar usuários com CRECI
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoadingUsers(true)


        const users = await getUsersWithCreci()


        setUsersWithCreci(users)
      } catch (err) {
        console.error('❌ [PROPERTY CONFIG VM] Failed to load users:', err)
        showAlert('error', 'Erro ao carregar usuários')
        // Set empty array on error to avoid breaking the form
        setUsersWithCreci([])
      } finally {
        setLoadingUsers(false)
      }
    }

    loadUsers()
  }, [])

  // Carregar amenities
  useEffect(() => {
    const loadAmenities = async () => {
      try {
        setLoadingAmenities(true)


        const amenitiesResponse = await getAllAmenities(1, 100)
        const amenitiesList = amenitiesResponse.content || amenitiesResponse || []

        setAmenities(amenitiesList)
      } catch (err) {
        console.error('❌ [PROPERTY CONFIG VM] Failed to load amenities:', err)
        showAlert('error', 'Erro ao carregar diferenciais')
        setAmenities([])
      } finally {
        setLoadingAmenities(false)
      }
    }

    loadAmenities()
  }, [])

  // Carregar dados da propriedade (se editando)
  useEffect(() => {
    const loadAdvertisementData = async () => {
      if (isNew) {

        setInitialData(new AdvertisementConfigModel())
        setLoading(false)
        return
      }

      try {
        setLoading(true)


        const advertisement = await getAdvertisementById(id)
        const advertisementModel = AdvertisementConfigModel.fromAdvertisementEntity(advertisement)


        setInitialData(advertisementModel)
      } catch (err) {
        console.error('❌ [PROPERTY CONFIG VM] Failed to load advertisement:', err)
        setError(err.message || 'Erro ao carregar propriedade')
      } finally {
        setLoading(false)
      }
    }

    loadAdvertisementData()
  }, [id, isNew])

  const handleSubmit = async (formData) => {
    if (submitting) return




    setSubmitting(true)
    setError(null)

    try {
      const advertisementModel = new AdvertisementConfigModel(initialData)

      // Extract new files that need uploading
      const newFiles = advertisementModel.extractNewImageFiles(formData)


      let uploadedImageData = []

      // Upload new images if any
      if (newFiles.length > 0) {

        const uploadResults = await Promise.all(
          newFiles.map(async ({ file, type }) => {
            const urls = await uploadImages([file], type)
            return { urls, type }
          })
        )
        uploadedImageData = uploadResults

      }

      // Convert to API request format
      const apiRequest = advertisementModel.toApiRequest(formData, uploadedImageData, amenities)


      let result
      if (isNew) {

        result = await createAdvertisement(apiRequest)
      } else {

        result = await updateAdvertisement(id, apiRequest)
      }



      showAlert('success', isNew ? 'Propriedade criada com sucesso!' : 'Propriedade atualizada com sucesso!', () => {
        navigate('/admin/gerenciar-imoveis')
      })

      return result
    } catch (err) {
      const errorMessage = err.message || (isNew ? 'Erro ao criar propriedade' : 'Erro ao atualizar propriedade')
      console.error(`❌ [PROPERTY CONFIG VM] ${isNew ? 'Create' : 'Update'} failed:`, err)
      setError(errorMessage)
      showAlert('error', errorMessage)
      throw err
    } finally {
      setSubmitting(false)
    }
  }

  const handleDisable = async () => {
    if (!id || isNew) return



    try {
      setSubmitting(true)

      // Get current form data from initialData
      const currentFormData = initialData.toFormData()

      // Create update request to disable the advertisement
      const advertisementModel = new AdvertisementConfigModel(initialData)
      const disableRequest = advertisementModel.toApiRequest({
        ...currentFormData,
        active: false // Set active to false for soft delete
      }, [], amenities)



      await updateAdvertisement(id, disableRequest)


      showAlert('success', 'Propriedade desabilitada com sucesso!', () => {
        navigate('/admin/gerenciar-imoveis')
      })
    } catch (err) {
      const errorMessage = err.message || 'Erro ao desabilitar propriedade'
      console.error('❌ [PROPERTY CONFIG VM] Deactivate failed:', err)
      setError(errorMessage)
      showAlert('error', errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!id || isNew) return

    try {
      setSubmitting(true)
      setError(null)

      await deleteAdvertisement(id)

      showAlert('success', 'Propriedade excluída definitivamente com sucesso!', () => {
        navigate('/admin/gerenciar-imoveis')
      })
    } catch (err) {
      const errorMessage = isDeleteBlockedByAppointments(err)
        ? DELETE_BLOCKED_BY_APPOINTMENTS_MESSAGE
        : resolveApiErrorMessage(err, 'Erro ao excluir propriedade definitivamente')

      console.error('❌ [PROPERTY CONFIG VM] Hard delete failed:', err)
      setError(errorMessage)
      showAlert('error', errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  const handleCloseAlert = () => {
    const onClose = alertConfig?.onClose
    setAlertConfig(null)

    if (typeof onClose === 'function') {
      onClose()
    }
  }

  const handleClear = () => {

    if (isNew) {
      setInitialData(new AdvertisementConfigModel())
    } else {
      // For editing, reload original data
      const loadOriginalData = async () => {
        try {
          const advertisement = await getAdvertisementById(id)
          const advertisementModel = AdvertisementConfigModel.fromAdvertisementEntity(advertisement)
          setInitialData(advertisementModel)
        } catch (err) {
          console.error('❌ [PROPERTY CONFIG VM] Failed to reload original data:', err)
        }
      }
      loadOriginalData()
    }
  }

  const handleCancel = () => {

    navigate('/admin/gerenciar-imoveis')
  }

  return {
    loading,
    loadingUsers,
    loadingAmenities,
    error,
    initialData: initialData?.toFormData(),
    submitting,
    isNew,
    usersWithCreci,
    amenities,
    alertConfig,
    handleCloseAlert,
    handleSubmit,
    handleDisable: isNew ? undefined : handleDisable,
    handleDelete: isNew ? undefined : handleDelete,
    handleClear,
    handleCancel
  }
}
