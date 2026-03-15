import { useState, useEffect, useCallback } from 'react'
import { cleanCEP } from '@shared/utils/CEP/formatCEPUtil'
import { fetchAddressByCEP } from '@service-viacep/viacepService'

/**
 * Hook para buscar endereço por CEP com debounce
 * Integra com o serviço ViaCEP e transforma dados automaticamente
 *
 * @param {string} cep - CEP para busca (com ou sem formatação)
 * @param {number} delay - Delay em ms para debounce (padrão: 500ms)
 * @returns {Object} Estado com {loading, error, address, lookupCEP}
 *
 * @example
 * const { loading, error, address, lookupCEP } = useCEPLookup(cepValue, 300)
 */
export function useCEPLookup(cep, delay = 500) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [address, setAddress] = useState(null)
  const [debounceTimer, setDebounceTimer] = useState(null)

  const lookupCEP = useCallback(async (cepValue) => {
    const cleanedCEP = cleanCEP(cepValue)

    setError(null)
    setAddress(null)

    if (cleanedCEP.length !== 8) {
      return
    }

    setLoading(true)

    try {
      const addressData = await fetchAddressByCEP(cleanedCEP)
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
    lookupCEP,
  }
}
