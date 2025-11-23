import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PropertyConfigModel } from './PropertyConfigModel'
import { getAdvertisementById, createAdvertisement, updateAdvertisement } from '@app/services/api/realEstateAdvertisementAPI'
import { uploadImages } from '@app/services/api/imageApi'
import { getUsersWithCreci } from '@app/services/api/userApi'

export function usePropertyConfigViewModel(id) {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [error, setError] = useState(null)
  const [initialData, setInitialData] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [usersWithCreci, setUsersWithCreci] = useState([])

  const isNew = !id || id === 'novo' || id === 'new'

  // Simple toast implementation (fallback if useToast doesn't exist)
  const showToast = (type, message) => {
    console.log(`${type.toUpperCase()}: ${message}`)
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
        console.log('🔄 [PROPERTY CONFIG VM] Loading users with CRECI...')

        const users = await getUsersWithCreci()

        console.log('✅ [PROPERTY CONFIG VM] Users loaded:', users.length)
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

  // Carregar dados da propriedade (se editando)
  useEffect(() => {
    const loadPropertyData = async () => {
      if (isNew) {
        console.log('📝 [PROPERTY CONFIG VM] Creating new property')
        setInitialData(new PropertyConfigModel())
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        console.log('🔄 [PROPERTY CONFIG VM] Loading property data for ID:', id)

        const advertisement = await getAdvertisementById(id)
        console.log('📥 [PROPERTY CONFIG VM] Raw advertisement data:', advertisement)

        // Log images before processing
        if (advertisement?.property?.images) {
          console.log('🖼️ [PROPERTY CONFIG VM] Raw images:', advertisement.property.images)
        }

        const propertyModel = PropertyConfigModel.fromAdvertisementEntity(advertisement)
        console.log('✅ [PROPERTY CONFIG VM] Property model created:', propertyModel)

        // Log processed images
        console.log('🖼️ [PROPERTY CONFIG VM] Processed images in model:', {
          video: propertyModel.images.video,
          cover: propertyModel.images.cover,
          gallery: propertyModel.images.gallery,
          floorPlans: propertyModel.images.floorPlans
        })

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

    console.log('🎯 [PROPERTY CONFIG VM] Starting submit process', { isNew, id })
    console.log('📝 [PROPERTY CONFIG VM] Form data received:', formData)

    setSubmitting(true)
    setError(null)

    try {
      const propertyModel = new PropertyConfigModel(initialData)

      // Extract new files that need uploading
      const newFiles = propertyModel.extractNewImageFiles(formData)
      console.log('📁 [PROPERTY CONFIG VM] New files to upload:', newFiles.length)

      let uploadedImageData = []

      // Upload new images if any
      if (newFiles.length > 0) {
        console.log('📤 [PROPERTY CONFIG VM] Starting image upload...')
        const uploadResults = await Promise.all(
          newFiles.map(async ({ file, type }) => {
            const urls = await uploadImages([file], type)
            return { urls, type }
          })
        )
        uploadedImageData = uploadResults
        console.log('✅ [PROPERTY CONFIG VM] Images uploaded successfully:', uploadedImageData)
      }

      // Convert to API request format
      const apiRequest = propertyModel.toApiRequest(formData, uploadedImageData)
      console.log('🔄 [PROPERTY CONFIG VM] API request prepared:', apiRequest)

      let result
      if (isNew) {
        console.log('➕ [PROPERTY CONFIG VM] Creating new advertisement...')
        result = await createAdvertisement(apiRequest)
      } else {
        console.log('✏️ [PROPERTY CONFIG VM] Updating existing advertisement...')
        result = await updateAdvertisement(id, apiRequest)
      }

      console.log('✅ [PROPERTY CONFIG VM] Operation completed successfully:', result)

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

    console.log('🗑️ [PROPERTY CONFIG VM] Starting soft delete (deactivate)...')

    try {
      setSubmitting(true)

      // Get current form data from initialData
      const currentFormData = initialData.toFormData()

      // Create update request to disable the advertisement
      const propertyModel = new PropertyConfigModel(initialData)
      const disableRequest = propertyModel.toApiRequest({
        ...currentFormData,
        active: false // Set active to false for soft delete
      })

      console.log('🔄 [PROPERTY CONFIG VM] Disabling advertisement with full data:', disableRequest)

      await updateAdvertisement(id, disableRequest)

      console.log('✅ [PROPERTY CONFIG VM] Advertisement deactivated successfully')
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
    console.log('🧹 [PROPERTY CONFIG VM] Clearing form')
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
    console.log('❌ [PROPERTY CONFIG VM] Cancelling operation')
    navigate('/admin/gerenciar-imoveis')
  }

  return {
    loading,
    loadingUsers,
    error,
    initialData: initialData?.toFormData(),
    submitting,
    isNew,
    usersWithCreci,
    handleSubmit,
    handleDelete: isNew ? undefined : handleDelete, // Only provide delete for existing items
    handleClear,
    handleCancel
  }
}
