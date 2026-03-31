import { useState, useCallback, useRef } from 'react'
import { getCleanedCEP, isCEPValid, isCEPAlreadySearched } from '@shared/utils/CEP/validateCEPUtil'
import { fetchAddressByCEP } from '@service-viacep/viacepService'

export function useCEPAutoFill(onAddressFound, options = {}) {
  const {
    debounceDelay = 500,
    enableAutoFill = true,
    onError,
    onLoading,
  } = options

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastSearchedCEP, setLastSearchedCEP] = useState('')
  const debounceRef = useRef(null)

  const handleSuccess = useCallback((addressData) => {
    onAddressFound?.(addressData)
  }, [onAddressFound])

  const handleError = useCallback((err) => {
    const message = err.message || 'Erro ao consultar CEP'
    setError(message)
    onError?.(message)
  }, [onError])

  const executeFetch = useCallback(async (cleanedCEP) => {
    setLastSearchedCEP(cleanedCEP)
    setLoading(true)
    setError(null)
    onLoading?.(true)

    try {
      const addressData = await fetchAddressByCEP(cleanedCEP)
      handleSuccess(addressData)
    } catch (err) {
      handleError(err)
    } finally {
      setLoading(false)
      onLoading?.(false)
    }
  }, [handleSuccess, handleError, onLoading])

  const searchCEP = useCallback((cep) => {
    if (!enableAutoFill) return

    const cleanedCEP = getCleanedCEP(cep)

    if (!isCEPValid(cleanedCEP) || isCEPAlreadySearched(cleanedCEP, lastSearchedCEP)) return

    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => executeFetch(cleanedCEP), debounceDelay)
  }, [enableAutoFill, lastSearchedCEP, debounceDelay, executeFetch])

  const clearError = useCallback(() => setError(null), [])

  const reset = useCallback(() => {
    setLoading(false)
    setError(null)
    setLastSearchedCEP('')
  }, [])

  return { loading, error, searchCEP, clearError, reset, isSearching: loading }
}
