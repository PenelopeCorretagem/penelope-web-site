import { useMemo, useState } from 'react'
import { HeaderManagementView } from '@management/components/HeaderManagement/HeaderManagementView'
import { FilterView } from '@shared/components/ui/Filter/FilterView'
import { DashboardView } from './components/DashboardView'
import { RecordsView } from './components/RecordsView'
import { ExportFormatModalView } from '@shared/components/features/ExportFormatModal/ExportFormatModalView'
import { useReportViewModel } from './useReportViewModel'
import { exportAppointments } from '@service-calservice/appointmentService'
import { downloadBlobFile } from '@shared/utils/fileDownloadUtil'
import { DatePickerView } from '@shared/components/ui/DatePicker/DatePickerView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { Download } from 'lucide-react'

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
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)

  const formatDateInputValue = (date) =>
    date instanceof Date && !Number.isNaN(date.getTime())
      ? date.toISOString().split('T')[0]
      : ''
  const [isExporting, setIsExporting] = useState(false)

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

  const handleExportClick = () => {
    setIsExportModalOpen(true)
  }

  const handleExport = async (format) => {
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

    setIsExporting(true)

    try {
      const blob = await exportAppointments(filters, format)
      const extension = format === 'csv' ? 'csv' : 'xlsx'
      downloadBlobFile(blob, `agenda-export-${new Date().toISOString().split('T')[0]}.${extension}`)
    } catch {
      // Falha ao exportar agendamentos será tratada futuramente
    } finally {
      setIsExporting(false)
      setIsExportModalOpen(false)
    }
  }

  const handleExportModalClose = () => setIsExportModalOpen(false)

  const DISPLAY_MODE_OPTIONS = [
    { value: 'calendar', label: 'Calendário' },
    { value: 'report', label: 'Relatório' },
  ]

  const customizedFilterConfigs = filterConfigs.map(config => {
    if (displayMode === 'calendar') {
      if (config.key === 'statusFilter') return { ...config, isSecondary: false }
      if (config.key === 'estateTypeFilter' || config.key === 'estateFilter') return { ...config, isSecondary: true }
    } else {
      if (config.key === 'statusFilter' || config.key === 'estateTypeFilter' || config.key === 'estateFilter') return { ...config, isSecondary: true }
    }
    return config
  })

  const mergedFilterConfigs = []

  if (showEstateAgentScopeSelect) {
    mergedFilterConfigs.push({
      key: 'estateAgentScopeFilter',
      options: estateAgentScopeFilterOptions,
      defaultValue: defaultFilters.estateAgentScopeFilter,
      width: 'fit',
      mobileFull: true,
      variant: 'brown',
      shape: 'square',
      isSecondary: false,
    })
  }

  mergedFilterConfigs.push(...customizedFilterConfigs)

  if (availableDisplayModes.length > 1) {
    mergedFilterConfigs.push({
      key: 'displayMode',
      options: DISPLAY_MODE_OPTIONS,
      defaultValue: 'calendar',
      width: 'fit',
      mobileFull: false,
      variant: 'pink',
      shape: 'square',
      customValue: displayMode,
      customOnChange: onDisplayModeChange,
      isSecondary: false,
    })
  }

  return (
    <>
      {/* Toolbar de Filtros */}
      <div className="relative z-20">
        <HeaderManagementView
          iconName={`${activeSection === 'dashboard' ? 'BarChart2' : 'FileText'}`}
          title={`Relatório de Agendamentos - ${activeSection === 'dashboard' ? 'Dashboard' : 'Registros'}`}
          className=""
        >
        </HeaderManagementView>
      </div>

      <div className="relative z-20">
        <HeaderManagementView
          iconName=""
          title=""
          className=""
        >
          {reportData && (
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between w-full">
              <div className="flex gap-3 w-full md:w-auto items-center">
                <DatePickerView
                  value={formatDateInputValue(reportData.startDate)}
                  onChange={(value) => {
                    const start = value ? new Date(value) : null
                    reportData.handleDateChange(start, reportData.endDate)
                  }}
                  minDate={null}
                  maxDate={reportData.endDate}
                  hasLabel={false}
                  placeholder="Início"
                  className="!w-fit"
                  calendarClassName="w-[min(100vw,16rem)]"
                  inputClassName=""
                />
                <span className="text-default-dark-light text-sm flex items-center">até</span>
                <DatePickerView
                  value={formatDateInputValue(reportData.endDate)}
                  onChange={(value) => {
                    const end = value ? new Date(value) : null
                    reportData.handleDateChange(reportData.startDate, end)
                  }}
                  minDate={reportData.startDate}
                  maxDate={null}
                  hasLabel={false}
                  placeholder="Fim"
                  className="!w-fit"
                  calendarClassName="w-[min(100vw,16rem)]"
                  inputClassName=""
                />
              </div>

              <div className="flex items-center gap-3">
                <FilterView
                  filterConfigs={mergedFilterConfigs}
                  defaultFilters={
                    showEstateAgentScopeSelect
                      ? { ...defaultFilters, estateAgentScopeFilter: vm.defaultEstateAgentFilter }
                      : defaultFilters
                  }
                  onFiltersChange={onFiltersChange}
                  onReset={reportData.handleResetDates}
                  hasExternalActiveFilters={!!reportData.startDate || !!reportData.endDate}
                  showResetButton={true}
                  showSortButton={false}
                  hideSearch={true}
                  mobileExpandedContent={mobileExpandedContent}
                  className="w-fit h-fit"
                />

                {activeSection != 'dashboard' && (
                  <ButtonView
                    type="button"
                    onClick={handleExportClick}
                    color="pink"
                    shape="rectangle"
                    width="fit"
                    className="flex items-center gap-2 whitespace-nowrap"
                  >
                    <Download size={16} />
                    <span>Exportar</span>
                  </ButtonView>
                )}
              </div>
            </div>
          )}

        </HeaderManagementView>
      </div>

      {/* Relatório */}
      <div className="flex-1 min-h-0 relative mt-4">
        {activeSection === 'dashboard' ? (
          <DashboardView
            reportData={reportData}
            appointments={vm.filteredAppointments}
            estateAgentName={vm.selectedEstateAgentName}
            isLoading={vm.loading}
          />
        ) : (
          <RecordsView
            appointments={filteredRecords}
            reportData={reportData}
            isLoading={vm.loading}
          />
        )}
      </div>

      <ExportFormatModalView
        isOpen={isExportModalOpen}
        isLoading={isExporting}
        onClose={handleExportModalClose}
        onConfirm={handleExport}
      />
    </>
  )
}
