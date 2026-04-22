import { useState, useCallback, useEffect } from 'react'
import { AmenitiesModel } from './AmenitiesModel'
import { getAllLucideIcons } from '@shared/utils/lucideIcons/lucideIconsUtil'
import { FilterModel } from '@shared/components/layout/Filter/FilterModel'

const DUPLICATE_AMENITY_MESSAGE = 'Não é possível criar este diferencial pois já existe um diferencial com essa descrição.'

const isDuplicateAmenityError = (error) => {
  const rawMessage = [
    error?.response?.data?.message,
    error?.response?.data?.error,
    error?.message,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  return rawMessage.includes('já existe um diferencial com a descrição')
    || rawMessage.includes('já existe um diferencial com essa descrição')
    || rawMessage.includes('duplicate')
    || rawMessage.includes('constraint')
}

/**
 * useAmenitiesViewModel - Hook ViewModel para Amenities com paginação
 *
 * RESPONSABILIDADES:
 * - Conectar Model ao React
 * - Gerenciar estado local (modal, formulário, paginação)
 * - Fornecer métodos de interação da UI
 */
export const useAmenitiesViewModel = () => {
  const [model] = useState(() => new AmenitiesModel())
  const [amenities, setAmenities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Estado de paginação
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)

  // Estado de filtros via FilterModel
  const [filterModel, setFilterModel] = useState(() => new FilterModel({
    filters: {
      initialFilter: 'TODOS'
    },
    sortOrder: 'none'
  }))

  // Estado do modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [formData, setFormData] = useState({
    description: '',
    icon: 'Zap',
  })

  // Estado do seletor de ícone
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false)

  // Alerta específico para erros de criação/edição
  const [formAlertConfig, setFormAlertConfig] = useState(null)

  // Estado de confirmação para deletar
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState(null)

  /**
   * Carrega amenities ao montar componente, mudar página ou alterar filtros
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        model.searchTerm = filterModel.searchTerm
        model.sortOrder = filterModel.sortOrder === 'none' ? '' : filterModel.sortOrder
        const initial = filterModel.getFilter('initialFilter')
        model.initialFilter = initial === 'TODOS' ? '' : initial
        await model.loadAmenities(currentPage, pageSize)
        setAmenities(model.amenities)
        setTotalPages(model.totalPages)
        setTotalElements(model.totalElements)
        setError(null)
      } catch (err) {
        setError(err.message || 'Erro ao carregar amenities')
      } finally {
        setLoading(false)
      }
    }

    // Usamos um debounce simples para a busca
    const timeoutId = setTimeout(() => {
      loadData()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [model, currentPage, pageSize, filterModel])

  /**
   * Abre modal para adicionar nova amenity
   */
  const handleAdd = useCallback(() => {
    const firstIcon = getAllLucideIcons()[0] || 'Zap'
    setIsEditMode(false)
    setFormData({
      description: '',
      icon: firstIcon,
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

  const handleCloseError = useCallback(() => {
    setError(null)
  }, [])

  const handleCloseFormAlert = useCallback(() => {
    setFormAlertConfig(null)
  }, [])

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
      setError(null)

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
      setTotalPages(model.totalPages)
      setTotalElements(model.totalElements)
      handleCloseModal()
    } catch (err) {
      // Tenta extrair mensagem da resposta da API
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao salvar diferencial'
      if (!isEditMode && isDuplicateAmenityError(err)) {
        setFormAlertConfig({
          type: 'warning',
          message: DUPLICATE_AMENITY_MESSAGE,
        })
        setError(null)
      } else {
        setError(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }, [model, isEditMode, formData, handleCloseModal])

  /**
   * Abre diálogo de confirmação para deletar amenity
   * @param {number} id
   */
  const handleDelete = useCallback((id) => {
    setPendingDeleteId(id)
    setIsConfirmDeleteOpen(true)
  }, [])

  /**
   * Confirma a exclusão
   */
  const handleConfirmDelete = useCallback(async () => {
    if (!pendingDeleteId) return

    try {
      setLoading(true)
      await model.deleteAmenity(pendingDeleteId)
      setAmenities(model.amenities)
      setCurrentPage(model.currentPage)
      setTotalPages(model.totalPages)
      setTotalElements(model.totalElements)
      setError(null)
      setIsConfirmDeleteOpen(false)
      setPendingDeleteId(null)
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao deletar diferencial'
      setError(errorMessage)
      setIsConfirmDeleteOpen(false)
      setPendingDeleteId(null)
    } finally {
      setLoading(false)
    }
  }, [model, pendingDeleteId])

  /**
   * Cancela a exclusão
   */
  const handleCancelDelete = useCallback(() => {
    setIsConfirmDeleteOpen(false)
    setPendingDeleteId(null)
  }, [])

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

  /**
   * Vai para página anterior
   */
  const handlePreviousPage = useCallback(() => {
    setCurrentPage(prev => Math.max(1, prev - 1))
  }, [])

  /**
   * Vai para próxima página
   */
  const handleNextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1))
  }, [totalPages])

  /**
   * Vai para página específica
   */
  const handleGoToPage = useCallback((page) => {
    const pageNum = Math.max(1, Math.min(totalPages, page))
    setCurrentPage(pageNum)
  }, [totalPages])

  /**
   * Muda a quantidade de itens por página
   * @param {number} newPageSize
   */
  const handlePageSizeChange = useCallback((newPageSize) => {
    setPageSize(newPageSize)
    setCurrentPage(1) // Volta para página 1 ao mudar o tamanho
  }, [])

  /**
   * Atualiza os filtros via FilterModel
   */
  const handleFiltersChange = useCallback((filterKey, filterValue) => {
    setFilterModel(prev => {
      if (filterKey === 'searchTerm') {
        return prev.with({ searchTerm: filterValue })
      } else if (filterKey === 'sortOrder') {
        return prev.with({ sortOrder: filterValue })
      } else {
        return prev.withFilter(filterKey, filterValue)
      }
    })
    setCurrentPage(1) // Volta para a primeira página ao filtrar
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
    isConfirmDeleteOpen,
    formAlertConfig,

    // Paginação
    currentPage,
    pageSize,
    totalPages,
    totalElements,

    // Filtros
    filterModel,

    // Métodos
    handleAdd,
    handleEdit,
    handleDelete,
    handleConfirmDelete,
    handleCancelDelete,
    handleCloseModal,
    handleCloseError,
    handleFormChange,
    handleSave,
    handleSelectIcon,
    setIsIconPickerOpen,
    handleCloseFormAlert,
    handlePreviousPage,
    handleNextPage,
    handleGoToPage,
    handlePageSizeChange,
    handleFiltersChange,
  }
}

