import { useState, useEffect, useRef } from 'react'

/**
 * useMinLoadingTime.js
 * Garante que um estado de loading seja verdadeiro por pelo menos um tempo mínimo,
 * evitando flashes rápidos de skeleton loading.
 *
 * @param {boolean} isLoading - O estado de loading real da requisição
 * @param {number} minTimeMs - O tempo mínimo em milissegundos (padrão 2000)
 * @returns {boolean} O estado de loading ajustado
 */
export function useMinLoadingTime(isLoading, minTimeMs = 500) {
  const [delayedLoading, setDelayedLoading] = useState(isLoading)
  const startTime = useRef(0)
  const timerId = useRef(null)

  useEffect(() => {
    if (isLoading) {
      setDelayedLoading(true)
      startTime.current = Date.now()
      if (timerId.current) {
        clearTimeout(timerId.current)
        timerId.current = null
      }
    } else {
      const elapsed = Date.now() - startTime.current
      const remaining = minTimeMs - elapsed

      if (remaining > 0 && startTime.current > 0) {
        timerId.current = setTimeout(() => {
          setDelayedLoading(false)
          startTime.current = 0
        }, remaining)
      } else {
        setDelayedLoading(false)
        startTime.current = 0
      }
    }

    return () => {
      if (timerId.current) {
        clearTimeout(timerId.current)
      }
    }
  }, [isLoading, minTimeMs])

  return delayedLoading
}
