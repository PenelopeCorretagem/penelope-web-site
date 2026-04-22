import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRouter } from '@app/routes/useRouterViewModel'
import { listAllAdvertisements , getAdvertisementById, updateAdvertisement } from '@service-penelopec/advertisementService'
import { getAllAmenities } from '@service-penelopec/amenitiesService'
import { AdvertisementsConfigModel } from './AdvertisementsConfigModel'
import { AdvertisementConfigModel } from '../AdvertisementConfig/AdvertisementConfigModel'
import { FilterModel } from '@shared/components/layout/Filter/FilterModel'

export const useAdvertisementsConfigViewModel = () => {
  const navigate = useNavigate()
  const { generateRoute } = useRouter()
  const [advertisementsConfigModel] = useState(() => new AdvertisementsConfigModel())
  const [lancamentos, setLancamentos] = useState([])
  const [disponiveis, setDisponiveis] = useState([])
  const [emObras, setEmObras] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterModel, setFilterModel] = useState(() => new FilterModel({
    filters: {
      regionFilter: 'TODAS',
      cityFilter: 'TODAS',
      typeFilter: 'TODOS',
      statusFilter: 'TODOS'
    }
  }))
  const [alertConfig, setAlertConfig] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const hasFetched = useRef(false)

  // helper to compare arrays by id to avoid unnecessary setState calls
  const areAdvertisementArraysEqual = useCallback((a = [], b = []) => {
    if (a === b) return true
    if (!Array.isArray(a) || !Array.isArray(b)) return false
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
      if ((a[i]?.id ?? a[i]) !== (b[i]?.id ?? b[i])) return false
    }
    return true
  }, [])

  // Wrap fetchAdvertisements so it keeps stable identity and can be safely used in useEffect
  const fetchAdvertisements = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [launchAdvertisements, availableAdvertisements, underConstructionAdvertisements] = await Promise.all([
        listAllAdvertisements ({ type: 'LANCAMENTO' }),
        listAllAdvertisements ({ type: 'DISPONIVEL' }),
        listAllAdvertisements ({ type: 'EM_OBRAS' })
      ])

      // Update model only if data is different to prevent unnecessary re-renders
      if (!areAdvertisementArraysEqual(advertisementsConfigModel.launchAdvertisements, launchAdvertisements)) {
        advertisementsConfigModel.launchAdvertisements = launchAdvertisements
        setLancamentos(launchAdvertisements)
      }
      if (!areAdvertisementArraysEqual(advertisementsConfigModel.availableAdvertisements, availableAdvertisements)) {
        advertisementsConfigModel.availableAdvertisements = availableAdvertisements
        setDisponiveis(availableAdvertisements)
      }
      if (!areAdvertisementArraysEqual(advertisementsConfigModel.underConstructionAdvertisements, underConstructionAdvertisements)) {
        advertisementsConfigModel.underConstructionAdvertisements = underConstructionAdvertisements
        setEmObras(underConstructionAdvertisements)
      }

    } catch (err) {
      console.error('Erro ao buscar anúncios:', err)
      setError('Não foi possível carregar os anúncios. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }, [advertisementsConfigModel, areAdvertisementArraysEqual])

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true
      fetchAdvertisements()
    }
  }, []) // Empty dependency array - run only once on mount

  // Listen for global notifications of soft deletes performed via AdvertisementCardModel
  useEffect(() => {
    const onAdvertisementSoftDeleted = (e) => {
      fetchAdvertisements()
    }
    window.addEventListener('propertySoftDeleted', onAdvertisementSoftDeleted)
    return () => window.removeEventListener('propertySoftDeleted', onAdvertisementSoftDeleted)
  }, []) // Remove fetchAdvertisements dependency to avoid excessive calls

  const handleEdit = useCallback((id) => {

    try {
      const route = generateRoute('ADMIN_PROPERTIES_CONFIG', { id })
      navigate(route)
    } catch (error) {
      console.error('Erro ao gerar rota:', error)
      // Fallback direto
      navigate(`/admin/gerenciar-imoveis/${id}`)
    }
  }, [navigate, generateRoute])

  const executeDelete = useCallback(async (id) => {
    try {
      setIsDeleting(true)

      const currentAdvertisement = await getAdvertisementById(id)

      const propertyModel = AdvertisementConfigModel.fromAdvertisementEntity(currentAdvertisement)
      const currentFormData = propertyModel.toFormData()

      const amenitiesResponse = await getAllAmenities(1, 100)
      const amenities = amenitiesResponse.content || amenitiesResponse || []

      const disableRequest = propertyModel.toApiRequest({
        ...currentFormData,
        active: false
      }, [], amenities)

      await updateAdvertisement(id, disableRequest)
      await fetchAdvertisements()

      setAlertConfig({
        type: 'success',
        message: 'Propriedade desabilitada com sucesso!'
      })
    } catch (err) {
      console.error('❌ [PROPERTIES CONFIG VM] Delete failed:', err)
      setAlertConfig({
        type: 'error',
        message: `Erro ao desabilitar propriedade: ${err.message}`
      })
    } finally {
      setIsDeleting(false)
    }
  }, [fetchAdvertisements])

  const handleDelete = useCallback((id) => {
    setAlertConfig({
      type: 'warning',
      isConfirm: true,
      message: 'Tem certeza que deseja desabilitar esta propriedade? Ela não aparecerá mais no site.',
      confirmText: 'Desabilitar',
      confirmColor: 'pink',
      propertyId: id,
    })
  }, [])

  const handleConfirmDelete = useCallback(async () => {
    if (!alertConfig?.isConfirm || !alertConfig?.propertyId || isDeleting) return

    const { propertyId } = alertConfig
    setAlertConfig(null)
    await executeDelete(propertyId)
  }, [alertConfig, executeDelete, isDeleting])

  const handleCloseAlert = useCallback(() => {
    setAlertConfig(null)
  }, [])

  // Unified filter handler - same pattern as Advertisements
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
  }, [])

  // Extract unique cities from all advertisements using estate.address.city
  const availableCities = useMemo(() => {
    const allAdvertisements = [...lancamentos, ...disponiveis, ...emObras]
    const cities = new Set()

    allAdvertisements.forEach(property => {
      const city = property?.estate?.address?.city
      if (city) {
        cities.add(city)
      }
    })

    return Array.from(cities).sort()
  }, [lancamentos, disponiveis, emObras])

  // Filter advertisements based on filterModel
  const filterAdvertisements = useCallback((advertisements) => {
    let filtered = [...advertisements]

    // Search filter
    const searchTerm = filterModel.searchTerm
    if (searchTerm?.trim()) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(advertisement =>
        (advertisement?.estate?.address?.city ?? '').toLowerCase().includes(searchLower) ||
        (advertisement?.estate?.address?.neighborhood ?? '').toLowerCase().includes(searchLower) ||
        (advertisement?.estate?.address?.uf ?? '').toLowerCase().includes(searchLower) ||
        (advertisement?.estate?.address?.region ?? '').toLowerCase().includes(searchLower) ||
        (advertisement?.estate?.description ?? '').toLowerCase().includes(searchLower) ||
        (advertisement?.estate?.title ?? '').toLowerCase().includes(searchLower)
      )
    }

    // Region filter
    const regionFilter = filterModel.getFilter('regionFilter')
    if (regionFilter && regionFilter !== 'TODAS' && regionFilter !== 'ALL') {
      filtered = filtered.filter(advertisement => (advertisement?.estate?.address?.region ?? '').toLowerCase() === regionFilter.toLowerCase())
    }

    // City filter
    const cityFilter = filterModel.getFilter('cityFilter')
    if (cityFilter && cityFilter !== 'TODAS' && cityFilter !== 'ALL') {
      filtered = filtered.filter(advertisement => (advertisement?.estate?.address?.city ?? '').toLowerCase() === cityFilter.toLowerCase())
    }

    // Status filter
    const statusFilter = filterModel.getFilter('statusFilter')
    if (statusFilter && statusFilter !== 'TODOS') {
      filtered = filtered.filter(advertisement => {
        const isEnabled = advertisement?.active ?? true
        if (statusFilter === 'HABILITADOS') {
          return isEnabled
        } else if (statusFilter === 'DESABILITADOS') {
          return !isEnabled
        }
        return true
      })
    }

    // Sort
    if (filterModel.sortOrder === 'asc') {
      filtered = filtered.sort((a, b) => ((a?.estate?.title || '')).localeCompare((b?.estate?.title || ''), 'pt-BR'))
    } else if (filterModel.sortOrder === 'desc') {
      filtered = filtered.sort((a, b) => ((b?.estate?.title || '')).localeCompare((a?.estate?.title || ''), 'pt-BR'))
    }

    return filtered
  }, [filterModel])

  // Apply filters to each category
  const filteredLancamentos = useMemo(() => {
    const typeFilter = filterModel.getFilter('typeFilter')
    return typeFilter === 'TODOS' || typeFilter === 'LANCAMENTOS' ? filterAdvertisements(lancamentos) : []
  }, [lancamentos, filterModel, filterAdvertisements])

  const filteredDisponiveis = useMemo(() => {
    const typeFilter = filterModel.getFilter('typeFilter')
    return typeFilter === 'TODOS' || typeFilter === 'DISPONIVEIS' ? filterAdvertisements(disponiveis) : []
  }, [disponiveis, filterModel, filterAdvertisements])

  const filteredEmObras = useMemo(() => {
    const typeFilter = filterModel.getFilter('typeFilter')
    return typeFilter === 'TODOS' || typeFilter === 'EM_OBRAS' ? filterAdvertisements(emObras) : []
  }, [emObras, filterModel, filterAdvertisements])

  return {
    lancamentos: filteredLancamentos,
    disponiveis: filteredDisponiveis,
    emObras: filteredEmObras,
    loading,
    error,
    searchTerm: filterModel.searchTerm,
    regionFilter: filterModel.getFilter('regionFilter'),
    cityFilter: filterModel.getFilter('cityFilter'),
    typeFilter: filterModel.getFilter('typeFilter'),
    statusFilter: filterModel.getFilter('statusFilter'),
    sortOrder: filterModel.sortOrder,
    availableCities,
    isDeleting,
    alertConfig,
    handleCloseAlert,
    handleConfirmDelete,
    handleEdit,
    handleDelete,
    handleFiltersChange,
    filterModel,
    handleSortOrderChange: (newOrder) => setFilterModel(prev => {
      if (newOrder !== undefined && typeof newOrder === 'string') {
        return prev.with({ sortOrder: newOrder })
      }
      let nextSortOrder = 'none'
      if (prev.sortOrder === 'none') nextSortOrder = 'asc'
      else if (prev.sortOrder === 'asc') nextSortOrder = 'desc'
      else nextSortOrder = 'none'
      return prev.with({ sortOrder: nextSortOrder })
    })
  }
}
