import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRouter } from '@app/routes/useRouterViewModel'
import { listAllAdvertisements , getAdvertisementById, updateAdvertisement } from '@service-penelopec/realEstateAdvertisementService'
import { listAllFeatures } from '@api-penelopec/featureAPI'
import { PropertiesConfigModel } from './PropertiesConfigModel'
import { PropertyConfigModel } from '../PropertyConfig/PropertyConfigModel'
import { FilterModel } from '@shared/components/layout/Filter/FilterModel'

export const usePropertiesConfigViewModel = () => {
  const navigate = useNavigate()
  const { generateRoute } = useRouter()
  const [propertiesConfigModel] = useState(() => new PropertiesConfigModel())
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
  const arePropertyArraysEqual = useCallback((a = [], b = []) => {
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

      const [launchProperties, availableProperties, underConstructionProperties] = await Promise.all([
        listAllAdvertisements ({ type: 'LANCAMENTO' }),
        listAllAdvertisements ({ type: 'DISPONIVEL' }),
        listAllAdvertisements ({ type: 'EM_OBRAS' })
      ])

      // Update model only if data is different to prevent unnecessary re-renders
      if (!arePropertyArraysEqual(propertiesConfigModel.launchProperties, launchProperties)) {
        propertiesConfigModel.launchProperties = launchProperties
        setLancamentos(launchProperties)
      }
      if (!arePropertyArraysEqual(propertiesConfigModel.availableProperties, availableProperties)) {
        propertiesConfigModel.availableProperties = availableProperties
        setDisponiveis(availableProperties)
      }
      if (!arePropertyArraysEqual(propertiesConfigModel.underConstructionProperties, underConstructionProperties)) {
        propertiesConfigModel.underConstructionProperties = underConstructionProperties
        setEmObras(underConstructionProperties)
      }

    } catch (err) {
      console.error('Erro ao buscar anúncios:', err)
      setError('Não foi possível carregar os anúncios. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }, [propertiesConfigModel, arePropertyArraysEqual])

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true
      fetchAdvertisements()
    }
  }, []) // Empty dependency array - run only once on mount

  // Listen for global notifications of soft deletes performed via PropertyCardModel
  useEffect(() => {
    const onPropertySoftDeleted = (e) => {
      fetchAdvertisements()
    }
    window.addEventListener('propertySoftDeleted', onPropertySoftDeleted)
    return () => window.removeEventListener('propertySoftDeleted', onPropertySoftDeleted)
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

      const propertyModel = PropertyConfigModel.fromAdvertisementEntity(currentAdvertisement)
      const currentFormData = propertyModel.toFormData()

      const amenities = await listAllFeatures()

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

  // Unified filter handler - same pattern as Properties
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

  // Extract unique cities from all properties using estate.address.city
  const availableCities = useMemo(() => {
    const allProperties = [...lancamentos, ...disponiveis, ...emObras]
    const cities = new Set()

    allProperties.forEach(property => {
      const city = property?.estate?.address?.city
      if (city) {
        cities.add(city)
      }
    })

    return Array.from(cities).sort()
  }, [lancamentos, disponiveis, emObras])

  // Filter properties based on filterModel
  const filterRealEstateAdvertisements = useCallback((realEstateAdvertisements) => {
    let filtered = [...realEstateAdvertisements]

    // Search filter
    const searchTerm = filterModel.searchTerm
    if (searchTerm?.trim()) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(realEstateAdvertisement =>
        (realEstateAdvertisement?.estate?.address?.city ?? '').toLowerCase().includes(searchLower) ||
        (realEstateAdvertisement?.estate?.address?.neighborhood ?? '').toLowerCase().includes(searchLower) ||
        (realEstateAdvertisement?.estate?.address?.uf ?? '').toLowerCase().includes(searchLower) ||
        (realEstateAdvertisement?.estate?.address?.region ?? '').toLowerCase().includes(searchLower) ||
        (realEstateAdvertisement?.estate?.description ?? '').toLowerCase().includes(searchLower) ||
        (realEstateAdvertisement?.estate?.title ?? '').toLowerCase().includes(searchLower)
      )
    }

    // Region filter
    const regionFilter = filterModel.getFilter('regionFilter')
    if (regionFilter && regionFilter !== 'TODAS' && regionFilter !== 'ALL') {
      filtered = filtered.filter(realEstateAdvertisement => (realEstateAdvertisement?.estate?.address?.region ?? '').toLowerCase() === regionFilter.toLowerCase())
    }

    // City filter
    const cityFilter = filterModel.getFilter('cityFilter')
    if (cityFilter && cityFilter !== 'TODAS' && cityFilter !== 'ALL') {
      filtered = filtered.filter(realEstateAdvertisement => (realEstateAdvertisement?.estate?.address?.city ?? '').toLowerCase() === cityFilter.toLowerCase())
    }

    // Status filter
    const statusFilter = filterModel.getFilter('statusFilter')
    if (statusFilter && statusFilter !== 'TODOS') {
      filtered = filtered.filter(realEstateAdvertisement => {
        const isEnabled = realEstateAdvertisement?.active ?? true
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
    return typeFilter === 'TODOS' || typeFilter === 'LANCAMENTOS' ? filterRealEstateAdvertisements(lancamentos) : []
  }, [lancamentos, filterModel, filterRealEstateAdvertisements])

  const filteredDisponiveis = useMemo(() => {
    const typeFilter = filterModel.getFilter('typeFilter')
    return typeFilter === 'TODOS' || typeFilter === 'DISPONIVEIS' ? filterRealEstateAdvertisements(disponiveis) : []
  }, [disponiveis, filterModel, filterRealEstateAdvertisements])

  const filteredEmObras = useMemo(() => {
    const typeFilter = filterModel.getFilter('typeFilter')
    return typeFilter === 'TODOS' || typeFilter === 'EM_OBRAS' ? filterRealEstateAdvertisements(emObras) : []
  }, [emObras, filterModel, filterRealEstateAdvertisements])

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
