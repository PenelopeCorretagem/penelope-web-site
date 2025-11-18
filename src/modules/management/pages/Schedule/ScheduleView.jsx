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

  // Dados mockados temporários para demonstração
  const mockAppointments = [
    { id: 'a1', date: '2025-11-16T09:00:00', title: 'Ag 1', client: 'Cliente A', time: '09:00' },
    { id: 'a2', date: '2025-11-16T11:30:00', title: 'Ag 2', client: 'Cliente B', time: '11:30' },
    { id: 'a3', date: '2025-11-17T10:00:00', title: 'Ag 3', client: 'Cliente C', time: '10:00' },
    { id: 'a4', date: '2025-11-20T14:00:00', title: 'Ag 4', client: 'Cliente D', time: '14:00' },
    { id: 'a5', date: '2025-12-01T09:00:00', title: 'Ag 5', client: 'Cliente E', time: '09:00' },
  ];

  const now = new Date();
  const appointmentsForSelectedDateMock = mockAppointments.filter(a => {
    const d = new Date(a.date);
    return d.getDate() === selectedDate.getDate() && d.getMonth() === selectedDate.getMonth() && d.getFullYear() === selectedDate.getFullYear();
  });

  // Total de agendamentos no mês selecionado (mock)
  const monthCount = mockAppointments.filter(a => {
    const d = new Date(a.date);
    return d.getMonth() === selectedDate.getMonth() && d.getFullYear() === selectedDate.getFullYear();
  }).length;

  const nextAppointments = mockAppointments
    .filter(a => new Date(a.date) >= now)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  return (
    <div className="flex flex-col min-h-screen bg-page">
      <main className="flex-1 px-header-x md:px-header-x-md py-8">
        <div className="max-w-[1200px] mx-auto">
          <h1 className="text-2xl font-bold mb-6">Agenda</h1>

    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-[65%]">
        <div className="bg-white rounded-lg shadow overflow-hidden h-full p-0">
          <Cal
            calLink="rennan-moura-a8gvpo"
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
                    <div className="text-2xl font-bold">{appointmentsForSelectedDateMock.length}</div>
                  </div>
                  <div className="bg-default-light rounded p-3 text-center">
                    <div className="text-xs text-muted">Agendamentos do mês</div>
                    <div className="text-2xl font-bold">{monthCount}</div>
                  </div>
                </div>
              </div>

              {/* Agendamentos do dia (usando dados mockados temporariamente) */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-lg mb-3">Agendamentos do dia</h3>
                <div className="text-sm text-muted mb-3">Data selecionada: {selectedDate.toLocaleDateString()}</div>

                <div className="space-y-2">
                  {appointmentsForSelectedDateMock.length === 0 ? (
                    <div className="text-sm text-muted">Nenhum agendamento para este dia.</div>
                  ) : (
                    appointmentsForSelectedDateMock.map(appt => (
                      <div key={appt.id} className="p-3 border rounded flex items-center justify-between">
                        <div>
                          <div className="font-medium">{appt.title}</div>
                          <div className="text-sm text-muted">{appt.client}</div>
                        </div>
                        <div className="text-sm">{new Date(appt.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Próximos agendamentos (cartão separado) */}
              <div className="bg-white rounded-lg shadow p-4 flex-1 overflow-auto">
                <h3 className="font-medium mb-3">Próximos agendamentos</h3>

                <div className="space-y-2">
                  {nextAppointments.length === 0 ? (
                    <div className="text-sm text-muted">Nenhum próximo agendamento.</div>
                  ) : (
                    nextAppointments.map(appt => (
                      <div key={appt.id} className="p-3 border rounded flex items-center justify-between">
                        <div>
                          <div className="font-medium">{appt.title}</div>
                          <div className="text-sm text-muted">{appt.client}</div>
                        </div>
                        <div className="text-sm">{new Date(appt.date).toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}</div>
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
