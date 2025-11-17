import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRouter } from '@app/routes/useRouterViewModel'
import { listAllActiveAdvertisements } from '@app/services/api/advertisementApi'
import { advertisementMapper } from '@app/services/mapper/advertisementMapper'
import { PropertiesConfigModel } from './PropertiesConfigModel'

export const usePropertiesConfigViewModel = () => {
  const navigate = useNavigate()
  const { generateRoute } = useRouter()
  const [model] = useState(() => new PropertiesConfigModel())
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

  useEffect(() => {
    fetchAdvertisements()
  }, [])

  const fetchAdvertisements = async () => {
    try {
      setLoading(true)
      setError(null)

      const [lancamentosData, disponiveisData, emObrasData] = await Promise.all([
        listAllActiveAdvertisements({ tipo: 'LANCAMENTO' }),
        listAllActiveAdvertisements({ tipo: 'DISPONIVEL' }),
        listAllActiveAdvertisements({ tipo: 'EM_OBRAS' })
      ])

      // Converte para cards usando o mapper
      const mappedLancamentos = advertisementMapper.toPropertyCardList(lancamentosData)
      const mappedDisponiveis = advertisementMapper.toPropertyCardList(disponiveisData)
      const mappedEmObras = advertisementMapper.toPropertyCardList(emObrasData)

      model.setLancamentos(mappedLancamentos)
      model.setDisponiveis(mappedDisponiveis)
      model.setEmObras(mappedEmObras)

      setLancamentos(mappedLancamentos)
      setDisponiveis(mappedDisponiveis)
      setEmObras(mappedEmObras)
    } catch (err) {
      console.error('Erro ao buscar anúncios:', err)
      setError('Não foi possível carregar os anúncios. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (id) => {
    console.log('Editing property:', id)
    try {
      const route = generateRoute('ADMIN_PROPERTIES_CONFIG', { id })
      navigate(route)
    } catch (error) {
      console.error('Erro ao gerar rota:', error)
      // Fallback direto
      navigate(`/admin/imoveis/${id}`)
    }
  }

  const handleDelete = async (id) => {
    console.log('Deleting property:', id)
    // Implementar lógica de exclusão
    // Após deletar, recarregar os dados
    // await fetchAdvertisements()
  }

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

  // Extract unique cities from all properties
  const availableCities = useMemo(() => {
    const allProperties = [...lancamentos, ...disponiveis, ...emObras]
    const cities = new Set()

    allProperties.forEach(property => {
      if (property.subtitle) { // subtitle contains city
        cities.add(property.subtitle)
      }
    })

    return Array.from(cities).sort()
  }, [lancamentos, disponiveis, emObras])

  // Filter properties based on search and filters
  const filterProperties = useCallback((properties) => {
    let filtered = [...properties]

    // Search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(property =>
        property.title?.toLowerCase().includes(searchLower) ||
        property.subtitle?.toLowerCase().includes(searchLower) ||
        property.description?.toLowerCase().includes(searchLower)
      )
    }

    // City filter
    if (cityFilter !== 'TODAS') {
      filtered = filtered.filter(property => property.subtitle === cityFilter)
    }

    // Sort
    if (sortOrder === 'asc') {
      filtered = filtered.sort((a, b) => (a.title || '').localeCompare(b.title || '', 'pt-BR'))
    } else if (sortOrder === 'desc') {
      filtered = filtered.sort((a, b) => (b.title || '').localeCompare(a.title || '', 'pt-BR'))
    }

    return filtered
  }, [searchTerm, cityFilter, sortOrder])

  // Apply filters to each category
  const filteredLancamentos = useMemo(() => {
    return typeFilter === 'TODOS' || typeFilter === 'LANCAMENTOS' ? filterProperties(lancamentos) : []
  }, [lancamentos, typeFilter, filterProperties])

  const filteredDisponiveis = useMemo(() => {
    return typeFilter === 'TODOS' || typeFilter === 'DISPONIVEIS' ? filterProperties(disponiveis) : []
  }, [disponiveis, typeFilter, filterProperties])

  const filteredEmObras = useMemo(() => {
    return typeFilter === 'TODOS' || typeFilter === 'EM_OBRAS' ? filterProperties(emObras) : []
  }, [emObras, typeFilter, filterProperties])

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
