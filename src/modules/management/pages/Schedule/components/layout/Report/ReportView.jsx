import { ScheduleFiltersToolbarView } from '../ScheduleFiltersToolbar/ScheduleFiltersToolbarView'
import { DashboardView } from './components/ui/DashboardView'

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
}) {
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
        />
      </div>

      {/* Relatório */}
      <div className="flex-1 min-h-0 relative">
        <DashboardView
          appointments={vm.filteredAppointments}
          estateAgentName={vm.selectedEstateAgentName}
        />
      </div>
    </>
  )
}
