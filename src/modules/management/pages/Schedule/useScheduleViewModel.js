import { useState, useEffect } from 'react'
import { ScheduleModel } from './ScheduleModel'

// Mock data — substituir por chamadas reais à API no futuro
const makeMockAppointments = () => {
  const today = new Date()
  const toISODate = (d, dayOffset = 0) => {
    const dt = new Date(d.getFullYear(), d.getMonth(), d.getDate() + dayOffset)
    return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()).toISOString()
  }

  return [
    { id: 1, date: toISODate(today, 0), time: '09:00', title: 'Visita - Apartamento 201', client: 'Maria Silva' },
    { id: 2, date: toISODate(today, 0), time: '11:00', title: 'Contato - Terreno', client: 'João Pereira' },
    { id: 3, date: toISODate(today, 1), time: '14:00', title: 'Avaliação - Casa', client: 'Carlos Souza' },
    { id: 4, date: toISODate(today, 2), time: '16:00', title: 'Visita - Cobertura', client: 'Ana Lima' },
    { id: 5, date: toISODate(today, -1), time: '10:00', title: 'Reunião - Contrato', client: 'Roberto Dias' },
  ]
}

export function useScheduleViewModel() {
  const [selectedDate, setSelectedDate] = useState(() => new Date())
  const [model] = useState(() => new ScheduleModel(makeMockAppointments()))
  const [appointmentsForSelectedDate, setAppointmentsForSelectedDate] = useState([])
  const [totalAppointments, setTotalAppointments] = useState(0)

  useEffect(() => {
    setTotalAppointments(model.getTotal())
  }, [model])

  useEffect(() => {
    const appts = model.getByDate(selectedDate)
    setAppointmentsForSelectedDate(appts)
  }, [model, selectedDate])

  // Calcula quantidade de agendamentos do dia (mesma data)
  const totalAppointmentsToday = appointmentsForSelectedDate.length

  return {
    selectedDate,
    setSelectedDate,
    appointmentsForSelectedDate,
    totalAppointments,
    totalAppointmentsToday,
  }
}
