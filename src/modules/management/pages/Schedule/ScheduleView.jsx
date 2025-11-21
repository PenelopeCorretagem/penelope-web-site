import { useScheduleViewModel } from './useScheduleViewModel'
import Cal from "@calcom/embed-react";
import { useSearchParams, useLocation } from 'react-router-dom'
import { generateSlug } from '@shared/utils/generateSlugUtil'

export function ScheduleView() {
  const {
    selectedDate,
    setSelectedDate,
    appointmentsForSelectedDate,
    totalAppointments,
    totalAppointmentsToday,
    upcomingAppointments,
    monthCount,
  } = useScheduleViewModel()

  // Busca possível slug do query param ou do state (quando navegando a partir do imóvel)
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const propertyParam = searchParams.get('property')
  const propertyTitleFromState = location.state && location.state.propertyTitle
  const propertySlug = propertyParam || (propertyTitleFromState ? generateSlug(propertyTitleFromState) : null)

  const calLink = propertySlug ? `penelope-corretagem/${propertySlug}` : 'penelope-corretagem/'

  return (
    <div className="flex flex-col min-h-screen bg-page">
      <main className="flex-1 px-header-x md:px-header-x-md py-8">
        <div className="max-w-[1200px] mx-auto">
          <h1 className="text-2xl font-bold mb-6">Agenda</h1>

          <div className="flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-[65%]">
        <div className="bg-white rounded-lg shadow overflow-hidden h-full p-0">
          <Cal
            calLink={calLink}
            style={{ width: "100%", height: "100%" }}
            config={{ layout: 'month_view' }}
          />
        </div>
      </div>

            <aside className="w-full md:w-[35%] flex flex-col gap-4">
              {/* Overview Agendamentos (KPIs) */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-lg mb-3">Overview Agendamentos</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-default-light rounded p-3 text-center">
                    <div className="text-xs text-muted">Agendamentos do dia</div>
                    <div className="text-2xl font-bold">{appointmentsForSelectedDate.length}</div>
                  </div>
                  <div className="bg-default-light rounded p-3 text-center">
                    <div className="text-xs text-muted">Agendamentos do mês</div>
                    <div className="text-2xl font-bold">{monthCount}</div>
                  </div>
                </div>
              </div>

              {/* Agendamentos do dia */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-lg mb-3">Agendamentos do dia</h3>
                <div className="text-sm text-muted mb-3">Data selecionada: {selectedDate.toLocaleDateString()}</div>

                <div className="space-y-2">
                  {appointmentsForSelectedDate.length === 0 ? (
                    <div className="text-sm text-muted">Nenhum agendamento para este dia.</div>
                  ) : (
                    appointmentsForSelectedDate.map(appt => (
                      <div key={appt.id} className="p-3 border rounded flex items-center justify-between">
                        <div>
                          <div className="font-medium">{appt.title}</div>
                          <div className="text-sm text-muted">{appt.client}</div>
                        </div>
                        <div className="text-sm">{appt.date instanceof Date ? appt.date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : appt.time}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Próximos agendamentos (cartão separado) */}
              <div className="bg-white rounded-lg shadow p-4 flex-1 overflow-auto">
                <h3 className="font-medium mb-3">Próximos agendamentos</h3>

                <div className="space-y-2">
                  {upcomingAppointments.length === 0 ? (
                    <div className="text-sm text-muted">Nenhum próximo agendamento.</div>
                  ) : (
                    upcomingAppointments.map(appt => (
                      <div key={appt.id} className="p-3 border rounded flex items-center justify-between">
                        <div>
                          <div className="font-medium">{appt.title}</div>
                          <div className="text-sm text-muted">{appt.client}</div>
                        </div>
                        <div className="text-sm">{appt.date instanceof Date ? appt.date.toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }) : ''}</div>
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
