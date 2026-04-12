/**
 * useEventTypes.js
 * Hook customizado para gerenciar event types do cal-service
 * 
 * Exemplo de implementação para referência
 * Use como base para integrar gerenciamento de tipos de agendamento
 */

import { useState, useEffect, useCallback } from 'react'
import * as eventTypeService from '@service-calservice/eventTypeService'

/**
 * Hook para gerenciar event types
 * @returns {object} State e métodos para gerenciar event types
 */
export function useEventTypes() {
  const [eventTypes, setEventTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Carrega event types
  const loadEventTypes = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await eventTypeService.getAllEventTypes()
      setEventTypes(data)
    } catch (err) {
      setError(err.message || 'Erro ao carregar tipos de eventos')
      console.error('❌ Erro ao carregar event types:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Carrega event types ao montar
  useEffect(() => {
    loadEventTypes()
  }, [loadEventTypes])

  // Busca um event type específico
  const getById = useCallback(async (id) => {
    try {
      return await eventTypeService.getEventTypeById(id)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  // Cria novo event type
  const create = useCallback(async (eventTypeData) => {
    try {
      const created = await eventTypeService.createEventType(eventTypeData)
      setEventTypes([...eventTypes, created])
      return created
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [eventTypes])

  // Atualiza event type
  const update = useCallback(async (id, updateData) => {
    try {
      const updated = await eventTypeService.updateEventType(id, updateData)
      setEventTypes(eventTypes.map(et => et.id === id ? updated : et))
      return updated
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [eventTypes])

  // Toggle visibility de event type
  const toggleVisibility = useCallback(async (id) => {
    try {
      const toggled = await eventTypeService.toggleEventTypeVisibility(id)
      setEventTypes(eventTypes.map(et => et.id === id ? toggled : et))
      return toggled
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [eventTypes])

  // Deleta event type
  const remove = useCallback(async (id) => {
    try {
      await eventTypeService.deleteEventType(id)
      setEventTypes(eventTypes.filter(et => et.id !== id))
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [eventTypes])

  return {
    // Estado
    eventTypes,
    loading,
    error,

    // Comandos
    loadEventTypes,
    create,
    getById,
    update,
    toggleVisibility,
    remove,

    // Derivados
    visible: eventTypes.filter(et => !et.hidden),
    hidden: eventTypes.filter(et => et.hidden),
  }
}
