import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { listAllActiveAdvertisements } from '@app/services/api/advertisementApi'
import { advertisementMapper } from '@app/services/mapper/advertisementMapper'
import { PropertiesConfigModel } from './PropertiesConfigModel'
import { RouterModel } from '@app/routes/RouterModel'

export const usePropertiesConfigViewModel = () => {
  const navigate = useNavigate()
  const router = RouterModel.getInstance()
  const [model] = useState(() => new PropertiesConfigModel())
  const [lancamentos, setLancamentos] = useState([])
  const [disponiveis, setDisponiveis] = useState([])
  const [emObras, setEmObras] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
    const route = router.generateRoute('ADMIN_PROPERTIES_CONFIG', { id })
    navigate(route)
  }

  const handleDelete = async (id) => {
    console.log('Deleting property:', id)
    // Implementar lógica de exclusão
    // Após deletar, recarregar os dados
    // await fetchAdvertisements()
  }

  return {
    lancamentos,
    disponiveis,
    emObras,
    loading,
    error,
    handleEdit,
    handleDelete,
    refetch: fetchAdvertisements,
    totalCount: model.getTotalCount()
  }
}
