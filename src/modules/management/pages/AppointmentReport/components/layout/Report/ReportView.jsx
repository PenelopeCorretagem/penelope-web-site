import { useMemo } from 'react'
import { ScheduleFiltersToolbarView } from '../../../../Schedule/components/layout/ScheduleFiltersToolbar/ScheduleFiltersToolbarView'
import { DashboardView } from './components/ui/DashboardView'
import { RecordsView } from './components/ui/RecordsView'
import { useReportViewModel } from './useReportViewModel'
import { exportAppointments } from '@service-calservice/appointmentService'
import { downloadBlobFile } from '@shared/utils/fileDownloadUtil'

/**
 * ReportView.jsx
 * Tela do relatório com gráficos e KPIs
 */

export function ReportView({
  // ViewModel
  vm,
  // Filtros
  filterConfigs,
  defaultFilters,
  showEstateAgentScopeSelect,
  estateAgentScopeFilterOptions,
  onFiltersChange,
  onDisplayModeChange,
  availableDisplayModes,
  displayMode,
  // Modais
  mobileExpandedContent,
  activeSection = 'dashboard',
}) {
  const reportData = useReportViewModel(vm.filteredAppointments)

  const filteredRecords = useMemo(() => {
    if (!reportData?.startDate && !reportData?.endDate) {
      return vm.filteredAppointments
    }

    return vm.filteredAppointments.filter((appointment) => {
      const appointmentDate = appointment.startDateTime || appointment.date || null
      if (!appointmentDate) return false
      const date = appointmentDate instanceof Date ? appointmentDate : new Date(appointmentDate)
      if (reportData.startDate && date < reportData.startDate) return false
      if (reportData.endDate && date > reportData.endDate) return false
      return true
    })
  }, [reportData.startDate, reportData.endDate, vm.filteredAppointments])

  const handleExport = async () => {
    const filters = {}

    if (vm.selectedEstateAgentFilter && vm.selectedEstateAgentFilter !== 'TODOS') {
      filters.estateAgentId = Number(vm.selectedEstateAgentFilter)
    }

    if (reportData.startDate) {
      filters.periodoInicio = reportData.startDate.toISOString().split('T')[0]
    }

    if (reportData.endDate) {
      filters.periodoFim = reportData.endDate.toISOString().split('T')[0]
    }

    try {
      const blob = await exportAppointments(filters, 'xlsx')
      downloadBlobFile(blob, `agenda-export-${new Date().toISOString().split('T')[0]}.xlsx`)
    } catch {
      // Falha ao exportar agendamentos será tratada futuramente
    }
  }

  return (
    <>
      {/* Toolbar de Filtros */}
      <div className="relative z-20">
        <ScheduleFiltersToolbarView
          filterConfigs={filterConfigs}
          defaultFilters={
            showEstateAgentScopeSelect
              ? { ...defaultFilters, estateAgentScopeFilter: vm.defaultEstateAgentFilter }
              : defaultFilters
          }
          onFiltersChange={onFiltersChange}
          showEstateAgentScopeSelect={showEstateAgentScopeSelect}
          estateAgentScopeFilterOptions={estateAgentScopeFilterOptions}
          displayMode={displayMode}
          availableDisplayModes={availableDisplayModes}
          onDisplayModeChange={onDisplayModeChange}
          mobileExpandedContent={mobileExpandedContent}
          reportData={reportData}
          onExport={handleExport}
        />
      </div>

      {/* Relatório */}
      <div className="flex-1 min-h-0 relative mt-4">
        {activeSection === 'dashboard' ? (
          <DashboardView
            reportData={reportData}
            appointments={vm.filteredAppointments}
            estateAgentName={vm.selectedEstateAgentName}
          />
        ) : (
          <RecordsView
            appointments={filteredRecords}
            reportData={reportData}
          />
        )}
      </div>
    </>
  )
}
