import { useMemo } from 'react'
import { useScheduleViewModel } from './useScheduleViewModel'

export function ScheduleView() {
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
  } = useScheduleViewModel()

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
      const key = appointment.date.toISOString().split('T')[0]
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})
  }, [allAppointments])

  const handleChangeMonth = (direction) => {
    const nextMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + direction, 1)
    setSelectedDate(nextMonth)
  }

  const renderDayButton = (day, index) => {
    const isCurrent = day === selectedDate.getDate()
    const cellDate = day ? new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day) : null
    const dateKey = cellDate ? cellDate.toISOString().split('T')[0] : null
    const count = dateKey ? appointmentsCountByDate[dateKey] || 0 : 0

    return (
      <button
        key={`${index}-${day}`}
        type="button"
        onClick={() => day && setSelectedDate(cellDate)}
        disabled={!day}
        className={
          `relative min-h-[88px] rounded-lg border text-left p-3 transition-all ${
            !day ? 'bg-slate-50 border-transparent cursor-default opacity-30' : isCurrent ? 'bg-distac-primary/10 border-distac-primary text-distac-secondary' : 'bg-white border-slate-200 hover:border-distac-primary/60'
          }`
        }
      >
        <div className="flex items-center justify-between gap-2">
          <span className="font-semibold text-sm">{day || ''}</span>
          {count > 0 && (
            <span className="inline-flex items-center justify-center rounded-full bg-distac-primary text-white text-[11px] font-semibold h-6 min-w-[24px] px-2">
              {count}
            </span>
          )}
        </div>
        {count > 0 && (
          <p className="mt-2 text-xs text-muted">{count} agendamento{count > 1 ? 's' : ''}</p>
        )}
      </button>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-page">
      <main className="flex-1 px-header-x md:px-header-x-md py-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Agenda</h1>
              <p className="text-sm text-muted mt-1">Visualização nativa do calendário com dados consumidos pelo cal-service.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <label htmlFor="date-picker" className="text-sm font-medium text-muted">
                Selecionar data:
              </label>
              <input
                id="date-picker"
                type="date"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(`${e.target.value}T00:00:00`))}
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-distac-primary"
              />
            </div>
          </div>

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

          <div className="grid gap-6 lg:grid-cols-[1.8fr_1fr]">
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.12em] text-muted mb-1">Calendário</p>
                    <h2 className="text-xl font-semibold capitalize">{currentMonthName}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleChangeMonth(-1)}
                      className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-default-dark hover:border-distac-primary hover:text-distac-primary transition"
                    >
                      Mês anterior
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChangeMonth(1)}
                      className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-default-dark hover:border-distac-primary hover:text-distac-primary transition"
                    >
                      Próximo mês
                    </button>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-7 gap-2 text-center text-xs uppercase tracking-[0.18em] text-muted">
                  {weekdayLabels.map(label => (
                    <div key={label} className="py-2">{label}</div>
                  ))}
                </div>

                <div className="mt-3 grid grid-cols-7 gap-2">
                  {calendarDays.map((day, index) => renderDayButton(day, index))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Resumo do mês</h3>
                    <p className="text-sm text-muted">Total de agendamentos no mês selecionado.</p>
                  </div>
                  <div className="rounded-full bg-distac-secondary px-4 py-2 text-sm font-semibold text-white">{monthCount}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-slate-200 bg-distac-secondary-light p-4 text-center">
                    <p className="text-xs uppercase tracking-[0.16em] text-muted mb-3">Hoje</p>
                    <p className="text-3xl font-semibold">{totalAppointmentsToday}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-distac-secondary-light p-4 text-center">
                    <p className="text-xs uppercase tracking-[0.16em] text-muted mb-3">Agendamentos gerais</p>
                    <p className="text-3xl font-semibold">{totalAppointments}</p>
                  </div>
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-lg mb-3">Agendamentos do dia</h3>
                <p className="text-sm text-muted mb-4">Data selecionada: {selectedDate.toLocaleDateString('pt-BR')}</p>
                <div className="space-y-3">
                  {appointmentsForSelectedDate.length === 0 ? (
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-muted">
                      Nenhum agendamento para este dia.
                    </div>
                  ) : (
                    appointmentsForSelectedDate.map(appt => (
                      <div key={appt.id} className="rounded-xl border border-slate-200 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold">{appt.title}</p>
                            <p className="text-sm text-muted mt-1">{appt.client}</p>
                          </div>
                          <span className="text-sm font-semibold text-distac-primary">{appt.date instanceof Date ? appt.date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : appt.time}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-lg mb-3">Próximos agendamentos</h3>
                <div className="space-y-3">
                  {upcomingAppointments.length === 0 ? (
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-muted">
                      Nenhum próximo agendamento.
                    </div>
                  ) : (
                    upcomingAppointments.map(appt => (
                      <div key={appt.id} className="rounded-xl border border-slate-200 p-4">
                        <p className="font-semibold">{appt.title}</p>
                        <p className="text-sm text-muted mt-1">{appt.client}</p>
                        <p className="text-sm text-default-dark mt-2">
                          {appt.date instanceof Date ? appt.date.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : ''}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  )
}
