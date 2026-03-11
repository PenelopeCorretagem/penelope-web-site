import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PropertyConfigModel } from './PropertyConfigModel'
import { getAdvertisementById, createAdvertisement, updateAdvertisement } from '@app/services/api/realEstateAdvertisementAPI'
import { uploadImages } from '@app/services/api/imageApi'
import { getUsersWithCreci } from '@app/services/api/userApi'
import { listAllFeatures } from '@app/services/api/featureAPI'

export function usePropertyConfigViewModel(id) {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [loadingFeatures, setLoadingFeatures] = useState(true)
  const [error, setError] = useState(null)
  const [initialData, setInitialData] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [usersWithCreci, setUsersWithCreci] = useState([])
  const [features, setFeatures] = useState([])

  const isNew = !id || id === 'novo' || id === 'new'

  // Simple toast implementation (fallback if useToast doesn't exist)
  const showToast = (type, message) => {
    // You can replace this with your actual toast implementation
    if (type === 'error') {
      alert(`Erro: ${message}`)
    } else {
      alert(`Sucesso: ${message}`)
    }
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
        showToast('error', 'Erro ao carregar usuários')
        // Set empty array on error to avoid breaking the form
        setUsersWithCreci([])
      } finally {
        setLoadingUsers(false)
      }
    }

    loadUsers()
  }, [])

  // Carregar features
  useEffect(() => {
    const loadFeatures = async () => {
      try {
        setLoadingFeatures(true)


        const featuresList = await listAllFeatures()


        setFeatures(featuresList)
      } catch (err) {
        console.error('❌ [PROPERTY CONFIG VM] Failed to load features:', err)
        showToast('error', 'Erro ao carregar diferenciais')
        setFeatures([])
      } finally {
        setLoadingFeatures(false)
      }
    }

    loadFeatures()
  }, [])

  // Carregar dados da propriedade (se editando)
  useEffect(() => {
    const loadPropertyData = async () => {
      if (isNew) {

        setInitialData(new PropertyConfigModel())
        setLoading(false)
        return
      }

      try {
        setLoading(true)


        const advertisement = await getAdvertisementById(id)

          id: advertisement?.id,
          active: advertisement?.active,
          endDate: advertisement?.endDate,
          creator: advertisement?.creator,
          responsible: advertisement?.responsible,
          hasEstate: !!advertisement?.estate,
          hasProperty: !!advertisement?.property,
          estateKeys: advertisement?.estate ? Object.keys(advertisement.estate).slice(0, 10) : [],
          propertyKeys: advertisement?.property ? Object.keys(advertisement.property).slice(0, 10) : [],
          estate: {
            title: advertisement?.estate?.title,
            type: advertisement?.estate?.type,
            description: advertisement?.estate?.description?.substring(0, 50),
            area: advertisement?.estate?.area,
            numberOfRooms: advertisement?.estate?.numberOfRooms,
            address: advertisement?.estate?.address,
            amenities: advertisement?.estate?.amenities?.map(a => ({ description: a.description, name: a.name })),
            imagesCount: advertisement?.estate?.images?.length || 0
          },
          property: {
            title: advertisement?.property?.title,
            type: advertisement?.property?.type,
            description: advertisement?.property?.description?.substring(0, 50),
            area: advertisement?.property?.area,
            numberOfRooms: advertisement?.property?.numberOfRooms,
            address: advertisement?.property?.address,
            amenities: advertisement?.property?.amenities?.map(a => ({ description: a.description, name: a.name })),
            imagesCount: advertisement?.property?.images?.length || 0
          }
        })

        const propertyModel = PropertyConfigModel.fromAdvertisementEntity(advertisement)


        const formDataOutput = propertyModel.toFormData()


        setInitialData(propertyModel)
      } catch (err) {
        console.error('❌ [PROPERTY CONFIG VM] Failed to load property:', err)
        setError(err.message || 'Erro ao carregar propriedade')
      } finally {
        setLoading(false)
      }
    }

    loadPropertyData()
  }, [id, isNew])

  const handleSubmit = async (formData) => {
    if (submitting) return




    setSubmitting(true)
    setError(null)

    try {
      const propertyModel = new PropertyConfigModel(initialData)

      // Extract new files that need uploading
      const newFiles = propertyModel.extractNewImageFiles(formData)


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
      const apiRequest = propertyModel.toApiRequest(formData, uploadedImageData, features)


      let result
      if (isNew) {

        result = await createAdvertisement(apiRequest)
      } else {

        result = await updateAdvertisement(id, apiRequest)
      }



      showToast('success', isNew ? 'Propriedade criada com sucesso!' : 'Propriedade atualizada com sucesso!')
      navigate('/admin/gerenciar-imoveis')

      return result
    } catch (err) {
      const errorMessage = err.message || (isNew ? 'Erro ao criar propriedade' : 'Erro ao atualizar propriedade')
      console.error(`❌ [PROPERTY CONFIG VM] ${isNew ? 'Create' : 'Update'} failed:`, err)
      setError(errorMessage)
      showToast('error', errorMessage)
      throw err
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!id || isNew) return



    try {
      setSubmitting(true)

      // Get current form data from initialData
      const currentFormData = initialData.toFormData()

      // Create update request to disable the advertisement
      const propertyModel = new PropertyConfigModel(initialData)
      const disableRequest = propertyModel.toApiRequest({
        ...currentFormData,
        active: false // Set active to false for soft delete
      }, [], features)



      await updateAdvertisement(id, disableRequest)


      showToast('success', 'Propriedade desabilitada com sucesso!')
      navigate('/admin/gerenciar-imoveis')
    } catch (err) {
      const errorMessage = err.message || 'Erro ao desabilitar propriedade'
      console.error('❌ [PROPERTY CONFIG VM] Deactivate failed:', err)
      setError(errorMessage)
      showToast('error', errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  const handleClear = () => {

    if (isNew) {
      setInitialData(new PropertyConfigModel())
    } else {
      // For editing, reload original data
      const loadOriginalData = async () => {
        try {
          const advertisement = await getAdvertisementById(id)
          const propertyModel = PropertyConfigModel.fromAdvertisementEntity(advertisement)
          setInitialData(propertyModel)
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
    loadingFeatures,
    error,
    initialData: initialData?.toFormData(),
    submitting,
    isNew,
    usersWithCreci,
    features,
    handleSubmit,
    handleDelete: isNew ? undefined : handleDelete, // Only provide delete for existing items
    handleClear,
    handleCancel
  }
}
