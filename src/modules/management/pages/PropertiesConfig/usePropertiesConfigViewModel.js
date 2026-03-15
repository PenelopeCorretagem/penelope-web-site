import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRouter } from '@app/routes/useRouterViewModel'
import { listAllAdvertisements , getAdvertisementById, updateAdvertisement } from '@api-penelopec/realEstateAdvertisementAPI'
import { listAllFeatures } from '@api-penelopec/featureAPI'
import { PropertiesConfigModel } from './PropertiesConfigModel'
import { PropertyConfigModel } from '../PropertyConfig/PropertyConfigModel'

export const usePropertiesConfigViewModel = () => {
  const navigate = useNavigate()
  const { generateRoute } = useRouter()
  const [propertiesConfigModel] = useState(() => new PropertiesConfigModel())
  const [lancamentos, setLancamentos] = useState([])
  const [disponiveis, setDisponiveis] = useState([])
  const [emObras, setEmObras] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [regionFilter, setRegionFilter] = useState('TODAS')
  const [cityFilter, setCityFilter] = useState('TODAS')
  const [typeFilter, setTypeFilter] = useState('TODOS')
  const [sortOrder, setSortOrder] = useState('none')

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
  }, [propertiesConfigModel, arePropertyArraysEqual]) // propertiesConfigModel is stable from useState initialization

  useEffect(() => {
    fetchAdvertisements()
  }, [fetchAdvertisements])

  // Listen for global notifications of soft deletes performed via PropertyCardModel
  useEffect(() => {
    const onPropertySoftDeleted = (e) => {
      // opcional: log para depuração

      // Recarregar os anúncios
      fetchAdvertisements()
    }
    window.addEventListener('propertySoftDeleted', onPropertySoftDeleted)
    return () => window.removeEventListener('propertySoftDeleted', onPropertySoftDeleted)
  }, [fetchAdvertisements])

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

  const handleDelete = useCallback(async (id) => {


    if (!window.confirm('Tem certeza que deseja desabilitar esta propriedade? Ela não aparecerá mais no site.')) {
      return
    }

    try {
      setLoading(true)

      // First, get the current advertisement data

      const currentAdvertisement = await getAdvertisementById(id)

      // Convert to PropertyConfigModel to get proper format
      const propertyModel = PropertyConfigModel.fromAdvertisementEntity(currentAdvertisement)
      const currentFormData = propertyModel.toFormData()

      // Busca amenities do banco para mapear os diferenciais em IDs
      const amenities = await listAllFeatures()

      // Create update request with active set to false
      const disableRequest = propertyModel.toApiRequest({
        ...currentFormData,
        active: false // Set active to false for soft delete
      }, [], amenities)



      await updateAdvertisement(id, disableRequest)



      // Recarregar os dados após exclusão
      await fetchAdvertisements()

      // Simple toast notification
      alert('Propriedade desabilitada com sucesso!')
    } catch (err) {
      console.error('❌ [PROPERTIES CONFIG VM] Delete failed:', err)
      alert(`Erro ao desabilitar propriedade: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }, [fetchAdvertisements])

  const handleSearchChange = useCallback((e) => {
    // Handle both event objects and direct values
    const value = e?.target?.value ?? e ?? ''
    setSearchTerm(value)
  }, [])

  const handleRegionFilterChange = useCallback((value) => {
    setRegionFilter(value)
    setCityFilter('TODAS') // Reset city when region changes
  }, [])

  const handleCityFilterChange = useCallback((value) => {
    setCityFilter(value)
  }, [])

  const handleTypeFilterChange = useCallback((value) => {
    setTypeFilter(value)
  }, [])

  const handleSortOrderChange = useCallback(() => {
    setSortOrder(prev => {
      if (prev === 'none') return 'asc'
      if (prev === 'asc') return 'desc'
      return 'none'
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

  // Filter properties based on search and filters
  const filterRealEstateAdvertisements = useCallback((realEstateAdvertisements) => {
    let filtered = [...realEstateAdvertisements]

    // Search filter
    if (searchTerm.trim()) {
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

    // Region filter - FIXED: check for 'TODAS'
    if (regionFilter && regionFilter !== 'TODAS' && regionFilter !== 'ALL') {
      filtered = filtered.filter(realEstateAdvertisement => (realEstateAdvertisement?.estate?.address?.region ?? '').toLowerCase() === regionFilter.toLowerCase())
    }

    // City filter - FIXED: check for 'TODAS'
    if (cityFilter && cityFilter !== 'TODAS' && cityFilter !== 'ALL') {
      filtered = filtered.filter(realEstateAdvertisement => (realEstateAdvertisement?.estate?.address?.city ?? '').toLowerCase() === cityFilter.toLowerCase())
    }

    // Sort
    if (sortOrder === 'asc') {
      filtered = filtered.sort((a, b) => ((a?.estate?.title || '')).localeCompare((b?.estate?.title || ''), 'pt-BR'))
    } else if (sortOrder === 'desc') {
      filtered = filtered.sort((a, b) => ((b?.estate?.title || '')).localeCompare((a?.estate?.title || ''), 'pt-BR'))
    }

    return filtered
  }, [searchTerm, regionFilter, cityFilter, sortOrder])

  // Apply filters to each category
  const filteredLancamentos = useMemo(() => {
    return typeFilter === 'TODOS' || typeFilter === 'LANCAMENTOS' ? filterRealEstateAdvertisements(lancamentos) : []
  }, [lancamentos, typeFilter, filterRealEstateAdvertisements])

  const filteredDisponiveis = useMemo(() => {
    return typeFilter === 'TODOS' || typeFilter === 'DISPONIVEIS' ? filterRealEstateAdvertisements(disponiveis) : []
  }, [disponiveis, typeFilter, filterRealEstateAdvertisements])

  const filteredEmObras = useMemo(() => {
    return typeFilter === 'TODOS' || typeFilter === 'EM_OBRAS' ? filterRealEstateAdvertisements(emObras) : []
  }, [emObras, typeFilter, filterRealEstateAdvertisements])

  return {
    lancamentos: filteredLancamentos,
    disponiveis: filteredDisponiveis,
    emObras: filteredEmObras,
    loading,
    error,
    searchTerm,
    regionFilter,
    cityFilter,
    typeFilter,
    sortOrder,
    availableCities,
    handleEdit,
    handleDelete,
    handleSearchChange,
    handleRegionFilterChange,
    handleCityFilterChange,
    handleTypeFilterChange,
    handleSortOrderChange
  }
}
