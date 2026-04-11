import { useState, useCallback, useEffect } from 'react'
import { AmenitiesModel } from './AmenitiesModel'

/**
 * useAmenitiesViewModel - Hook ViewModel para Amenities
 *
 * RESPONSABILIDADES:
 * - Conectar Model ao React
 * - Gerenciar estado local (modal, formulário)
 * - Fornecer métodos de interação da UI
 */
export const useAmenitiesViewModel = () => {
  const [model] = useState(() => new AmenitiesModel())
  const [amenities, setAmenities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Estado do modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [formData, setFormData] = useState({
    description: '',
    icon: 'Zap',
  })

  // Estado do seletor de ícone
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false)

  /**
   * Carrega amenities ao montar componente
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        await model.loadAmenities()
        setAmenities(model.amenities)
        setError(null)
      } catch (err) {
        setError(err.message || 'Erro ao carregar amenities')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [model])

  /**
   * Abre modal para adicionar nova amenity
   */
  const handleAdd = useCallback(() => {
    setIsEditMode(false)
    setFormData({
      description: '',
      icon: 'Zap',
    })
    setIsModalOpen(true)
  }, [])

  /**
   * Abre modal para editar amenity
   * @param {Amenity} amenity
   */
  const handleEdit = useCallback((amenity) => {
    setIsEditMode(true)
    setFormData({
      description: amenity.description,
      icon: amenity.icon,
    })
    model.selectAmenity(amenity)
    setIsModalOpen(true)
  }, [model])

  /**
   * Fecha modal
   */
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    model.clearSelection()
  }, [model])

  /**
   * Atualiza campo do formulário
   * @param {string} field - Nome do campo
   * @param {any} value - Novo valor
   */
  const handleFormChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }, [])

  /**
   * Salva amenity (criar ou atualizar)
   */
  const handleSave = useCallback(async () => {
    try {
      setLoading(true)

      const amenity = model.createNewAmenity()
      amenity.description = formData.description
      amenity.icon = formData.icon

      if (isEditMode && model.selectedAmenity) {
        amenity.id = model.selectedAmenity.id
        await model.updateAmenity(amenity.id, amenity)
      } else {
        await model.createAmenity(amenity)
      }

      setAmenities(model.amenities)
      setError(null)
      handleCloseModal()
    } catch (err) {
      setError(err.message || 'Erro ao salvar amenity')
    } finally {
      setLoading(false)
    }
  }, [model, isEditMode, formData, handleCloseModal])

  /**
   * Deleta amenity
   * @param {number} id
   */
  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar esta amenity?')) {
      return
    }

    try {
      setLoading(true)
      await model.deleteAmenity(id)
      setAmenities(model.amenities)
      setError(null)
    } catch (err) {
      setError(err.message || 'Erro ao deletar amenity')
    } finally {
      setLoading(false)
    }
  }, [model])

  /**
   * Seleciona ícone do icon picker
   * @param {string} iconName
   */
  const handleSelectIcon = useCallback((iconName) => {
    setFormData(prev => ({
      ...prev,
      icon: iconName,
    }))
    setIsIconPickerOpen(false)
  }, [])

  return {
    // Estado
    amenities,
    loading,
    error,
    isModalOpen,
    isEditMode,
    formData,
    isIconPickerOpen,

    // Métodos
    handleAdd,
    handleEdit,
    handleDelete,
    handleCloseModal,
    handleFormChange,
    handleSave,
    handleSelectIcon,
    setIsIconPickerOpen,
  }
}
