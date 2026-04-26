import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar, CalendarDays } from 'lucide-react'
import { useScheduleViewModel } from './useScheduleViewModel'
import { useHeaderHeight } from '@shared/hooks/useHeaderHeight'
import { AppointmentFormModalView } from './AppointmentFormModalView'

const STATUS_COLORS = {
  PENDING: 'bg-distac-primary text-white',
  CONFIRMED: 'bg-distac-secondary text-white',
  CONCLUDED: 'bg-green-500 text-white',
  CANCELLED: 'bg-slate-400 text-white',
}

const STATUS_LABELS = {
  PENDING: 'Agendado',
  CONFIRMED: 'Confirmado',
  CONCLUDED: 'Concluído',
  CANCELLED: 'Cancelado',
}

export function ScheduleView() {
  const headerHeight = useHeaderHeight()
  const [viewMode, setViewMode] = useState('week')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedModalDate, setSelectedModalDate] = useState(new Date())
  const [selectedModalHour, setSelectedModalHour] = useState(10)
  const [appointmentToEdit, setAppointmentToEdit] = useState(null)
  const [busyAppointmentId, setBusyAppointmentId] = useState(null)

  const {
    selectedDate,
    setSelectedDate,
    appointmentsForSelectedDate,
    totalAppointments,
    totalAppointmentsToday,
    loading,
    error,
    upcomingAppointments,
    monthCount,
    allAppointments,
    refreshAppointments,
    confirmAppointment,
    concludeAppointment,
    cancelAppointment,
  } = useScheduleViewModel()

  const handleTimeSlotClick = (date, hour) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const clickedDate = new Date(date)
    clickedDate.setHours(0, 0, 0, 0)

    if (clickedDate < today) {
      return
    }

    setSelectedModalDate(date)
    setSelectedModalHour(hour)
    setAppointmentToEdit(null)
    setIsModalOpen(true)
  }

  const handleRescheduleAppointment = (appointment) => {
    if (!appointment) return

    setAppointmentToEdit(appointment)
    setSelectedModalDate(appointment.startDateTime)
    setSelectedModalHour(appointment.startDateTime.getHours())
    setIsModalOpen(true)
  }

  const isPastDate = (date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)

    return checkDate < today
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setAppointmentToEdit(null)
  }

  const handleAppointmentSaved = async () => {
    await refreshAppointments()
  }

  const handleConfirm = async (appointmentId) => {
    if (!window.confirm('Deseja confirmar este agendamento?')) return

    try {
      setBusyAppointmentId(appointmentId)
      await confirmAppointment(appointmentId)
    } catch {
      // O erro já é exibido pelo estado do ViewModel.
    } finally {
      setBusyAppointmentId(null)
    }
  }

  const handleConclude = async (appointmentId) => {
    if (!window.confirm('Deseja concluir este agendamento?')) return

    try {
      setBusyAppointmentId(appointmentId)
      await concludeAppointment(appointmentId)
    } catch {
      // O erro já é exibido pelo estado do ViewModel.
    } finally {
      setBusyAppointmentId(null)
    }
  }

  const handleCancel = async (appointmentId) => {
    if (!window.confirm('Deseja cancelar este agendamento?')) return

    try {
      setBusyAppointmentId(appointmentId)
      await cancelAppointment(appointmentId, 'Cancelado pelo gestor no painel de agenda')
    } catch {
      // O erro já é exibido pelo estado do ViewModel.
    } finally {
      setBusyAppointmentId(null)
    }
  }

  const weekdayLabels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
  const currentMonthName = selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

  const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
  const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate()
  const monthStartOffset = (firstDayOfMonth.getDay() + 6) % 7

  const calendarDays = useMemo(() => {
    const blanks = Array.from({ length: monthStartOffset }, () => null)
    const days = Array.from({ length: daysInMonth }, (_, index) => index + 1)
    return [...blanks, ...days]
  }, [daysInMonth, monthStartOffset])

  const appointmentsCountByDate = useMemo(() => {
    return allAppointments.reduce((acc, appointment) => {
      const key = appointment.startDateTime.toISOString().split('T')[0]
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})
  }, [allAppointments])

  const getWeekDates = (date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    const monday = new Date(d.setDate(diff))

    const week = []
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(monday)
      currentDate.setDate(monday.getDate() + i)
      week.push(currentDate)
    }
    return week
  }

  const weekDates = useMemo(() => getWeekDates(selectedDate), [selectedDate])

  const appointmentsByDay = useMemo(() => {
    const result = {}
    weekDates.forEach(date => {
      const key = date.toISOString().split('T')[0]
      result[key] = allAppointments.filter(appt => {
        const apptDate = appt.startDateTime.toISOString().split('T')[0]
        return apptDate === key
      })
    })
    return result
  }, [weekDates, allAppointments])

  const hours = Array.from({ length: 13 }, (_, i) => i + 7)

  const handleChangeMonth = (direction) => {
    const nextMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + direction, 1)
    setSelectedDate(nextMonth)
  }

  const handlePreviousWeek = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() - 7)
    setSelectedDate(newDate)
  }

  const handleNextWeek = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + 7)
    setSelectedDate(newDate)
  }

  const renderMiniCalendarDay = (day, index) => {
    if (!day) return <div key={`empty-${index}`} className="bg-slate-50" />

    const cellDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day)
    const isCurrent = day === selectedDate.getDate()
    const isPassedDay = isPastDate(cellDate)
    const dateKey = cellDate.toISOString().split('T')[0]
    const count = appointmentsCountByDate[dateKey] || 0

    return (
      <button
        key={`day-${day}`}
        type="button"
        onClick={() => setSelectedDate(cellDate)}
        className={`aspect-square rounded-md text-sm font-medium transition relative ${
          isCurrent
            ? 'bg-distac-primary text-white'
            : isPassedDay
              ? 'bg-slate-100 text-slate-400 opacity-60'
              : 'bg-white text-default-dark hover:bg-slate-100'
        }`}
      >
        <div className="relative h-full flex items-center justify-center">
          {day}
          {count > 0 && !isPassedDay && (
            <div className="absolute top-1 right-1 w-2 h-2 bg-distac-primary rounded-full" />
          )}
        </div>
      </button>
    )
  }

  return (
    <div style={{ '--header-height': `${headerHeight}px` }} className="bg-page">
      <main className="flex flex-col h-[calc(100vh-var(--header-height))] overflow-hidden px-header-x md:px-header-x-md py-4">
        {loading && (
          <div className="text-center py-8">
            <p className="text-muted">Carregando agendamentos...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Erro ao carregar agendamentos</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="flex-1 overflow-hidden flex gap-6">
          <aside className="w-72 bg-white rounded-lg shadow p-4 overflow-y-auto flex flex-col">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted mb-2">Data selecionada</p>
              <p className="text-sm font-semibold text-default-dark mb-4">
                {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>

              {appointmentsForSelectedDate.length === 0 ? (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-muted text-center">
                  Nenhum agendamento para este dia.
                </div>
              ) : (
                <div className="space-y-2">
                  {appointmentsForSelectedDate.map(appt => (
                    <div key={appt.id} className={`rounded-lg p-3 border-l-4 ${STATUS_COLORS[appt.status] || 'bg-slate-50 border-slate-200'} bg-opacity-10`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-default-dark">{appt.title || 'Agendamento'}</p>
                          <p className="text-xs text-muted mt-1">{STATUS_LABELS[appt.status]}</p>
                          {appt.attendeeName && (
                            <p className="text-xs text-muted mt-1">Visitante: {appt.attendeeName}</p>
                          )}
                        </div>
                        <span className="text-xs font-semibold text-default-dark whitespace-nowrap">
                          {String(appt.startDateTime.getHours()).padStart(2, '0')}:{String(appt.startDateTime.getMinutes()).padStart(2, '0')}
                        </span>
                      </div>
                      <p className="text-xs text-muted mt-2">
                        Duração: {appt.durationMinutes} min
                      </p>
                      <div className="mt-3 flex gap-2 flex-wrap">
                        {(appt.status === 'PENDING' || appt.status === 'CONFIRMED') && (
                          <button
                            type="button"
                            onClick={() => handleRescheduleAppointment(appt)}
                            disabled={busyAppointmentId === appt.id}
                            className="text-[10px] px-2 py-1 rounded bg-distac-primary text-white disabled:opacity-60"
                          >
                            Reagendar
                          </button>
                        )}

                        {appt.status === 'PENDING' && (
                          <button
                            type="button"
                            onClick={() => handleConfirm(appt.id)}
                            disabled={busyAppointmentId === appt.id}
                            className="text-[10px] px-2 py-1 rounded bg-distac-secondary text-white disabled:opacity-60"
                          >
                            Confirmar
                          </button>
                        )}

                        {appt.status === 'CONFIRMED' && (
                          <button
                            type="button"
                            onClick={() => handleConclude(appt.id)}
                            disabled={busyAppointmentId === appt.id}
                            className="text-[10px] px-2 py-1 rounded bg-green-600 text-white disabled:opacity-60"
                          >
                            Concluir
                          </button>
                        )}

                        {(appt.status === 'PENDING' || appt.status === 'CONFIRMED') && (
                          <button
                            type="button"
                            onClick={() => handleCancel(appt.id)}
                            disabled={busyAppointmentId === appt.id}
                            className="text-[10px] px-2 py-1 rounded bg-slate-500 text-white disabled:opacity-60"
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>

          <div className="flex-1 bg-white rounded-lg shadow p-6 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm uppercase tracking-widest text-muted mb-1">
                  {viewMode === 'week' ? 'Semana de' : 'Dia selecionado'}
                </p>
                <h2 className="text-xl font-semibold">
                  {viewMode === 'week'
                    ? `${weekDates[0].toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })} - ${weekDates[6].toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}`
                    : selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </h2>
              </div>
              <div className="flex gap-2 flex-wrap">
                <div className="flex gap-1 border border-slate-200 rounded-md p-1 bg-slate-50">
                  <button
                    type="button"
                    onClick={() => setViewMode('week')}
                    className={`p-2 rounded transition ${
                      viewMode === 'week'
                        ? 'bg-distac-primary text-white'
                        : 'bg-transparent text-default-dark hover:bg-slate-100'
                    }`}
                    title="Visualização semanal"
                  >
                    <CalendarDays size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('day')}
                    className={`p-2 rounded transition ${
                      viewMode === 'day'
                        ? 'bg-distac-primary text-white'
                        : 'bg-transparent text-default-dark hover:bg-slate-100'
                    }`}
                    title="Visualização diária"
                  >
                    <Calendar size={18} />
                  </button>
                </div>

                {viewMode === 'week' ? (
                  <>
                    <button
                      type="button"
                      onClick={handlePreviousWeek}
                      className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-default-dark hover:border-distac-primary hover:text-distac-primary transition"
                    >
                      Semana anterior
                    </button>
                    <button
                      type="button"
                      onClick={handleNextWeek}
                      className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-default-dark hover:border-distac-primary hover:text-distac-primary transition"
                    >
                      Próxima semana
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setSelectedDate(new Date(selectedDate.getTime() - 24 * 60 * 60 * 1000))}
                      className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-default-dark hover:border-distac-primary hover:text-distac-primary transition"
                    >
                      Dia anterior
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedDate(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000))}
                      className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-default-dark hover:border-distac-primary hover:text-distac-primary transition"
                    >
                      Próximo dia
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {viewMode === 'week' ? (
                <div className="grid grid-cols-8 gap-2 min-w-full">
                  <div className="w-16 flex-shrink-0">
                    <div className="h-8" />
                    {hours.map(hour => (
                      <div key={hour} className="h-12 text-xs text-muted flex items-start justify-end pr-2">
                        {String(hour).padStart(2, '0')}:00
                      </div>
                    ))}
                  </div>

                  {weekDates.map((date, dayIndex) => {
                    const isSelectedDay = date.toDateString() === selectedDate.toDateString()
                    const dateKey = date.toISOString().split('T')[0]
                    const dayAppointments = appointmentsByDay[dateKey] || []

                    return (
                      <div
                        key={dateKey}
                        className={`flex-1 border-l ${isSelectedDay ? 'bg-distac-primary/5 border-distac-primary' : 'border-slate-200'}`}
                      >
                        <div className="h-8 flex flex-col items-center justify-center border-b border-slate-200 pb-2">
                          <p className="text-xs font-semibold text-default-dark">{weekdayLabels[dayIndex]}</p>
                          <p className="text-sm font-bold text-distac-primary">{date.getDate()}</p>
                        </div>

                        <div className="relative">
                          {hours.map((hour) => {
                            const slotAppointments = dayAppointments.filter(appt => appt.startDateTime.getHours() === hour)

                            return (
                              <button
                                key={`${dateKey}-${hour}`}
                                type="button"
                                onClick={() => handleTimeSlotClick(date, hour)}
                                disabled={isPastDate(date)}
                                className={`h-12 border-b border-slate-100 w-full transition relative block ${
                                  isPastDate(date)
                                    ? 'opacity-40 cursor-not-allowed bg-slate-50 pointer-events-none'
                                    : 'hover:bg-distac-primary/5'
                                }`}
                              >
                                <div className="absolute inset-0 pointer-events-none">
                                  {slotAppointments.map(appt => {
                                    const startMinutes = appt.startDateTime.getMinutes()
                                    const topOffset = (startMinutes / 60) * 48
                                    const height = (appt.durationMinutes / 60) * 48

                                    return (
                                      <div
                                        key={appt.id}
                                        role="button"
                                        tabIndex={0}
                                        onClick={(event) => {
                                          event.stopPropagation()
                                          handleRescheduleAppointment(appt)
                                        }}
                                        onKeyDown={(event) => {
                                          if (event.key === 'Enter' || event.key === ' ') {
                                            event.preventDefault()
                                            event.stopPropagation()
                                            handleRescheduleAppointment(appt)
                                          }
                                        }}
                                        className={`absolute left-1 right-1 rounded-md p-1 text-white text-[10px] overflow-hidden cursor-pointer pointer-events-auto ${STATUS_COLORS[appt.status] || 'bg-slate-400'}`}
                                        style={{
                                          top: `${topOffset}px`,
                                          minHeight: `${Math.max(height, 20)}px`,
                                        }}
                                        title={`${appt.title || 'Agendamento'} - Clique para reagendar`}
                                      >
                                        <p className="font-semibold truncate text-xs">{appt.title || 'Agendamento'}</p>
                                        <p className="text-[9px] opacity-90">
                                          {String(appt.startDateTime.getHours()).padStart(2, '0')}:{String(startMinutes).padStart(2, '0')}
                                        </p>
                                      </div>
                                    )
                                  })}
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="min-w-full h-full flex flex-col">
                  <div className="flex flex-col">
                    <div className="flex items-center justify-center pb-4 border-b border-slate-200">
                      <div className="text-center">
                        <p className="text-xs text-muted uppercase tracking-widest">{selectedDate.toLocaleDateString('pt-BR', { weekday: 'long' })}</p>
                        <p className="text-2xl font-bold text-distac-primary">{selectedDate.getDate()}</p>
                      </div>
                    </div>

                    <div className="flex-1 relative mt-4">
                      <div className="flex gap-4">
                        <div className="w-16 flex-shrink-0">
                          {hours.map(hour => (
                            <div key={hour} className="h-20 text-xs text-muted flex items-start justify-end pr-2 font-medium">
                              {String(hour).padStart(2, '0')}:00
                            </div>
                          ))}
                        </div>

                        <div className="flex-1 relative">
                          {hours.map((hour) => {
                            const slotAppointments = appointmentsForSelectedDate.filter(appt => appt.startDateTime.getHours() === hour)

                            return (
                              <button
                                key={`hour-${hour}`}
                                type="button"
                                onClick={() => handleTimeSlotClick(selectedDate, hour)}
                                disabled={isPastDate(selectedDate)}
                                className={`h-20 border-b border-slate-100 w-full transition relative block ${
                                  isPastDate(selectedDate)
                                    ? 'opacity-40 cursor-not-allowed bg-slate-50 pointer-events-none'
                                    : 'hover:bg-distac-primary/5'
                                }`}
                              >
                                <div className="absolute inset-0 pointer-events-none">
                                  {slotAppointments.map(appt => {
                                    const startMinutes = appt.startDateTime.getMinutes()
                                    const topOffset = (startMinutes / 60) * 80
                                    const height = (appt.durationMinutes / 60) * 80

                                    return (
                                      <div
                                        key={appt.id}
                                        role="button"
                                        tabIndex={0}
                                        onClick={(event) => {
                                          event.stopPropagation()
                                          handleRescheduleAppointment(appt)
                                        }}
                                        onKeyDown={(event) => {
                                          if (event.key === 'Enter' || event.key === ' ') {
                                            event.preventDefault()
                                            event.stopPropagation()
                                            handleRescheduleAppointment(appt)
                                          }
                                        }}
                                        className={`absolute left-2 right-2 rounded-lg p-2 text-white text-xs overflow-hidden shadow-md cursor-pointer pointer-events-auto ${STATUS_COLORS[appt.status] || 'bg-slate-400'}`}
                                        style={{
                                          top: `${topOffset}px`,
                                          minHeight: `${Math.max(height, 35)}px`,
                                        }}
                                        title={`${appt.title || 'Agendamento'} - Clique para reagendar`}
                                      >
                                        <p className="font-semibold text-xs">{appt.title || 'Agendamento'}</p>
                                        <p className="text-[10px] opacity-90 mt-1">
                                          {String(appt.startDateTime.getHours()).padStart(2, '0')}:{String(startMinutes).padStart(2, '0')} ({appt.durationMinutes}min)
                                        </p>
                                        <p className="text-[10px] opacity-75 mt-1">{STATUS_LABELS[appt.status]}</p>
                                      </div>
                                    )
                                  })}
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {appointmentsForSelectedDate.length === 0 && (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-center text-muted">Nenhum agendamento para este dia</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t flex gap-4 justify-center flex-wrap text-xs">
              {Object.entries(STATUS_LABELS).map(([status, label]) => (
                <div key={status} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded ${STATUS_COLORS[status]}`} />
                  <span className="text-muted">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <aside className="w-64 bg-white rounded-lg shadow p-4 overflow-y-auto flex flex-col">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-default-dark">{currentMonthName}</h3>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => handleChangeMonth(-1)}
                    className="p-1 hover:bg-slate-100 rounded"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChangeMonth(1)}
                    className="p-1 hover:bg-slate-100 rounded"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-muted mb-2">
                {weekdayLabels.map(label => (
                  <div key={label}>{label}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => renderMiniCalendarDay(day, index))}
              </div>
            </div>

            <div className="border-t pt-4 space-y-3">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted mb-2">Resumo</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted">Mês atual:</span>
                    <span className="font-semibold">{monthCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Hoje:</span>
                    <span className="font-semibold">{totalAppointmentsToday}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Total:</span>
                    <span className="font-semibold">{totalAppointments}</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-3">
                <p className="text-xs uppercase tracking-widest text-muted mb-2">Próximos</p>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {upcomingAppointments.length === 0 ? (
                    <p className="text-xs text-muted">Nenhum agendamento</p>
                  ) : (
                    upcomingAppointments.slice(0, 3).map(appt => (
                      <div key={appt.id} className="text-xs">
                        <p className="font-semibold text-default-dark truncate">{appt.title || 'Agendamento'}</p>
                        <p className="text-muted">{appt.startDateTime.toLocaleDateString('pt-BR')}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <AppointmentFormModalView
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmitSuccess={handleAppointmentSaved}
        selectedDate={selectedModalDate}
        selectedHour={selectedModalHour}
        allAppointments={allAppointments}
        appointment={appointmentToEdit}
        mode={appointmentToEdit ? 'reschedule' : 'create'}
      />
    </div>
  )
}
