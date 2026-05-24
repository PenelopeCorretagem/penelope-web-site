import { useRef, useCallback } from 'react'

/**
 * Hook para executar qualquer função com debounce (atraso após parar de usar)
 * @param {Function} fn - Função a executar
 * @param {number} delay - Tempo em ms para aguardar antes de executar (padrão: 600ms)
 * @returns {Function} Função que executa com debounce
 *
 * @example
 * // Para validação
 * const debouncedValidate = useDebounce(validatePassword, 600)
 * debouncedValidate(fieldValue)
 *
 * @example
 * // Para busca
 * const debouncedSearch = useDebounce((query) => fetchResults(query), 500)
 * debouncedSearch(searchTerm)
 *
 * @example
 * // Para resize
 * const debouncedResize = useDebounce(() => updateLayout(), 300)
 * window.addEventListener('resize', debouncedResize)
 */
export function useDebounce(fn, delay = 600) {
  const timeoutRef = useRef(null)

  const debouncedFn = useCallback((...args) => {
    // Limpar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Definir novo timeout
    timeoutRef.current = setTimeout(() => {
      if (fn) {
        fn(...args)
      }
    }, delay)
  }, [fn, delay])

  return debouncedFn
}
