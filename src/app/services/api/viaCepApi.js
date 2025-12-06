import { useState, useEffect, useCallback } from 'react'
import axiosInstance from './axiosInstance'
import { cleanCEP } from '@shared/utils/formatCEPUtil'

/**
 * Busca dados de endereço por CEP na API do ViaCEP
 * @param {string} cep - CEP para busca (com ou sem formatação)
 * @returns {Promise<Object>} Dados do endereço
 * @throws {Error} Se CEP for inválido ou não encontrado
 */
export async function getAddressByCEP(cep) {
  try {
    // Limpar e validar CEP
    const cleanedCEP = cleanCEP(cep)

    if (!cleanedCEP || cleanedCEP.length !== 8) {
      throw new Error('CEP deve ter 8 dígitos')
    }

    // Construir URL completa para ViaCEP
    const viaCepBaseUrl = import.meta.env.VITE_VIACEP_BASE_URL
    const fullUrl = `${viaCepBaseUrl}/${cleanedCEP}/json/`

    // Fazer requisição usando axiosInstance com URL completa
    const response = await axiosInstance.get(fullUrl, {
      timeout: 10000,
    })
    const data = response.data

    // Verificar se CEP foi encontrado
    if (data.erro) {
      throw new Error('CEP não encontrado')
    }

    // Normalizar dados para o formato esperado pela aplicação
    return {
      cep: data.cep?.replace(/\D/g, '') || cleanedCEP,
      street: data.logradouro || '',
      neighborhood: data.bairro || '',
      city: data.localidade || '',
      state: data.uf || '',
      region: mapStateToRegion(data.uf || ''),
      complement: data.complemento || '',
      ibge: data.ibge || '',
      gia: data.gia || '',
      ddd: data.ddd || '',
      siafi: data.siafi || ''
    }

  } catch (error) {
    // Tratar diferentes tipos de erro
    if (error.response?.status === 404) {
      throw new Error('CEP não encontrado')
    }

    if (error.code === 'ECONNABORTED') {
      throw new Error('Tempo limite esgotado. Verifique sua conexão.')
    }

    if (error.message) {
      throw new Error(error.message)
    }

    throw new Error('Erro ao consultar CEP. Tente novamente.')
  }
}

/**
 * Mapeia UF para região brasileira
 * @param {string} uf - Unidade Federativa
 * @returns {string} Região correspondente
 */
function mapStateToRegion(uf) {
  const regionMap = {
    // Norte
    'AC': 'Norte', 'AP': 'Norte', 'AM': 'Norte', 'PA': 'Norte',
    'RO': 'Norte', 'RR': 'Norte', 'TO': 'Norte',

    // Nordeste
    'AL': 'Nordeste', 'BA': 'Nordeste', 'CE': 'Nordeste', 'MA': 'Nordeste',
    'PB': 'Nordeste', 'PE': 'Nordeste', 'PI': 'Nordeste', 'RN': 'Nordeste', 'SE': 'Nordeste',

    // Centro-Oeste
    'GO': 'Centro-Oeste', 'MT': 'Centro-Oeste', 'MS': 'Centro-Oeste', 'DF': 'Centro-Oeste',

    // Sudeste
    'ES': 'Sudeste', 'MG': 'Sudeste', 'RJ': 'Sudeste', 'SP': 'Sudeste',

    // Sul
    'PR': 'Sul', 'RS': 'Sul', 'SC': 'Sul'
  }

  return regionMap[uf] || ''
}

/**
 * Hook para buscar endereço por CEP com debounce
 * @param {string} cep - CEP para busca
 * @param {number} delay - Delay em ms para debounce (padrão: 500ms)
 * @returns {Object} Estado da busca e dados do endereço
 */
export function useCEPLookup(cep, delay = 500) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [address, setAddress] = useState(null)
  const [debounceTimer, setDebounceTimer] = useState(null)

  const lookupCEP = useCallback(async (cepValue) => {
    const cleanedCEP = cleanCEP(cepValue)

    // Reset estado
    setError(null)
    setAddress(null)

    // Verificar se CEP tem 8 dígitos
    if (cleanedCEP.length !== 8) {
      return
    }

    setLoading(true)

    try {
      const addressData = await getAddressByCEP(cleanedCEP)
      setAddress(addressData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Debounce da busca
  useEffect(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    const timer = setTimeout(() => {
      if (cep) {
        lookupCEP(cep)
      }
    }, delay)

    setDebounceTimer(timer)

    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [cep, delay, lookupCEP])

  return {
    loading,
    error,
    address,
    lookupCEP
  }
}
