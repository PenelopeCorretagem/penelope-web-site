import { useScheduleViewModel } from './useScheduleViewModel'
import Cal from "@calcom/embed-react";

export function ScheduleView() {
  const {
    selectedDate,
    setSelectedDate,
    appointmentsForSelectedDate,
    totalAppointments,
    totalAppointmentsToday,
  } = useScheduleViewModel()

  return (
    <div className="flex flex-col min-h-screen bg-page">
      <main className="flex-1 px-header-x md:px-header-x-md py-8">
        <div className="max-w-[1200px] mx-auto">
          <h1 className="text-2xl font-bold mb-6">Agenda</h1>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Left: calendário maior (visualmente aumentado) */}
            <div className="w-full md:w-[65%]">
              <div className="bg-white rounded-lg shadow p-4">
                <Cal calLink="rennan-moura-a8gvpo" style={{ width: "100%", height: "700px" }} />
              </div>
            </div>

            <aside className="w-full md:w-[35%] flex flex-col gap-4">
              {/* Cartão de Resumo / KPIs */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-lg mb-3">Resumo</h3>
                <div className="text-sm text-muted mb-3">Data selecionada: {selectedDate.toLocaleDateString()}</div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-default-light rounded p-3 text-center">
                    <div className="text-xs text-muted">Agendamentos do dia</div>
                    <div className="text-2xl font-bold">{totalAppointmentsToday}</div>
                  </div>
                  <div className="bg-default-light rounded p-3 text-center">
                    <div className="text-xs text-muted">Agendamentos totais</div>
                    <div className="text-2xl font-bold">{totalAppointments}</div>
                  </div>
                </div>
              </div>

              {/* Cartão de Agendamentos (rolável) */}
              <div className="bg-white rounded-lg shadow p-4 flex-1 overflow-auto">
                <h3 className="font-medium mb-3">Agendamentos</h3>
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
                        <div className="text-sm">{appt.time}</div>
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
