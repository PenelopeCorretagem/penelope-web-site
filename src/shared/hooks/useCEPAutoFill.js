import { useState, useEffect, useCallback } from 'react'
import { getAddressByCEP } from '@app/services/api/viaCepApi'
import { cleanCEP } from '@shared/utils/formatCEPUtil'

/**
 * Hook para preenchimento automático de endereço baseado no CEP
 * @param {Function} onAddressFound - Callback chamado quando endereço é encontrado
 * @param {Object} options - Opções do hook
 * @returns {Object} Estado e métodos do hook
 */
export function useCEPAutoFill(onAddressFound, options = {}) {
  const {
    debounceDelay = 500,
    enableAutoFill = true,
    onError,
    onLoading
  } = options

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastSearchedCEP, setLastSearchedCEP] = useState('')

  const searchCEP = useCallback(async (cep) => {
    if (!enableAutoFill) return

    const cleanedCEP = cleanCEP(cep)

    // Verificar se CEP é válido e diferente do último pesquisado
    if (cleanedCEP.length !== 8 || cleanedCEP === lastSearchedCEP) {
      return
    }

    setLastSearchedCEP(cleanedCEP)
    setLoading(true)
    setError(null)

    // Chamar callback de loading se fornecido
    onLoading?.(true)

    try {
      const addressData = await getAddressByCEP(cleanedCEP)

      // Chamar callback com os dados encontrados
      onAddressFound?.(addressData)

      console.log('✅ [CEP AUTO-FILL] Endereço preenchido:', addressData)

    } catch (err) {
      const errorMessage = err.message || 'Erro ao consultar CEP'
      setError(errorMessage)

      // Chamar callback de erro se fornecido
      onError?.(errorMessage)

      console.error('❌ [CEP AUTO-FILL] Erro:', errorMessage)
    } finally {
      setLoading(false)
      onLoading?.(false)
    }
  }, [enableAutoFill, lastSearchedCEP, onAddressFound, onError, onLoading])

  // Debounce da busca
  useEffect(() => {
    const timer = setTimeout(() => {
      // A busca será feita quando searchCEP for chamado
    }, debounceDelay)

    return () => clearTimeout(timer)
  }, [debounceDelay])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const reset = useCallback(() => {
    setLoading(false)
    setError(null)
    setLastSearchedCEP('')
  }, [])

  return {
    loading,
    error,
    searchCEP,
    clearError,
    reset,
    isSearching: loading
  }
}
