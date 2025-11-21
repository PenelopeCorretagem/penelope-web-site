import { useState, useEffect, useCallback } from 'react'
import { ScheduleModel } from './ScheduleModel'

export function useScheduleViewModel() {
  const [selectedDate, setSelectedDate] = useState(() => new Date())
  const [model] = useState(() => new ScheduleModel([]))
  const [appointmentsForSelectedDate, setAppointmentsForSelectedDate] = useState([])
  const [totalAppointments, setTotalAppointments] = useState(model.getTotal())

  // Atualiza a lista filtrada toda vez que a data selecionada muda
  useEffect(() => {
    const appts = model.getByDate(selectedDate)
    setAppointmentsForSelectedDate(appts)
  }, [model, selectedDate])

  // Substitui todos os agendamentos (usado pelo backend)
  const setAppointments = useCallback((appointments = []) => {
    model.setAppointments(appointments)
    setTotalAppointments(model.getTotal())

    // Atualiza a lista atualmente visível para a data selecionada
    const appts = model.getByDate(selectedDate)
    setAppointmentsForSelectedDate(appts)
  }, [model, selectedDate])

  // Adiciona um único agendamento e atualiza estados
  const addAppointment = useCallback((appointment) => {
    model.add(appointment)
    setTotalAppointments(model.getTotal())

    const appts = model.getByDate(selectedDate)
    setAppointmentsForSelectedDate(appts)
  }, [model, selectedDate])

  // Helper async para casos em que o consumo de backend seja assíncrono
  const loadAppointments = useCallback(async (loader) => {
    // loader deve ser uma função assíncrona que retorna um array de appointments
    if (typeof loader !== 'function') return
    const data = await loader()
    setAppointments(Array.isArray(data) ? data : [])
  }, [setAppointments])

  const totalAppointmentsToday = appointmentsForSelectedDate.length

  // Próximos agendamentos (globais) — usa model.getAll()
  const upcomingAppointments = (() => {
    const all = model.getAll()
    const now = new Date()
    return all
      .filter(a => a.date >= now)
      .sort((a, b) => a.date - b.date)
      .slice(0, 5)
  })()

  // Total de agendamentos no mês selecionado
  const monthCount = (() => {
    const all = model.getAll()
    return all.filter(a => {
      const d = a.date
      return d.getMonth() === selectedDate.getMonth() && d.getFullYear() === selectedDate.getFullYear()
    }).length
  })()

  return {
    // Estado
    selectedDate,
    setSelectedDate,

    // Dados
    appointmentsForSelectedDate,
    totalAppointments,
    totalAppointmentsToday,

    // Commands for integration
    setAppointments,
    addAppointment,
    loadAppointments,
    // Derivados
    upcomingAppointments,
    monthCount,
  }
}
