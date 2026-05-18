import { useState, useMemo } from 'react'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Line,
} from 'recharts'
import { SectionView } from '@shared/components/layout/Section/SectionView'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { TextView } from '@shared/components/ui/Text/TextView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { Download, ChevronDown, X } from 'lucide-react'
import { PERIOD_LABELS } from '../ReportModel'
import { useScheduleReportData } from '../hooks/useScheduleReportData'
import clsx from 'clsx'

/**
 * ScheduleReportView.jsx
 * Componente que exibe relatório com gráficos e KPIs
 * Layout: KPIs esquerda, Gráficos direita, sem scroll na tela principal
 */

export function ScheduleReportView({
  appointments = [],
  estateAgentName = '',
}) {
  const reportData = useScheduleReportData(appointments)
  const [expandedItem, setExpandedItem] = useState(null)

  const COLORS_BY_STATUS = {
    PENDING: '#b33c8e',
    CONFIRMED: '#36221d',
    CONCLUDED: '#9b7a7a',
    CANCELLED: '#3d3c3c',
  }

  const STATUS_LABELS_MAP = {
    PENDING: 'Agendado',
    CONFIRMED: 'Confirmado',
    CONCLUDED: 'Concluído',
    CANCELLED: 'Cancelado',
  }

  const pieChartData = useMemo(() => {
    const { statusDistribution } = reportData
    return Object.entries(statusDistribution)
      .filter(([, count]) => count > 0)
      .map(([status, count]) => ({
        name: STATUS_LABELS_MAP[status] || status,
        value: count,
        fill: COLORS_BY_STATUS[status],
      }))
  }, [reportData])

  const handleExportReport = () => {
    console.log('Exportar relatório:', {
      period: reportData.periodType,
      agent: estateAgentName,
      appointments: appointments.length,
    })
  }

  const renderKPICard = (label, value, unit = '%', color = 'text-distac-primary', id) => (
    <button
      key={id}
      type="button"
      onClick={() => setExpandedItem({ type: 'kpi', id, label, value, unit, color })}
      className="bg-default-light rounded-lg border border-default-light-muted p-1.5 flex flex-col gap-0.5 hover:shadow-md transition cursor-pointer text-left"
    >
      <TextView className="text-[10px] uppercase text-default-dark-light font-semibold tracking-wide">
        {label}
      </TextView>
      <div className="flex items-end gap-0.5">
        <HeadingView level={5} className={clsx('font-bold text-sm', color)}>
          {value}
        </HeadingView>
        <TextView className="text-[9px] text-default-dark-light mb-0.5">
          {unit}
        </TextView>
      </div>
    </button>
  )

  const renderChartCard = (title, children, id) => (
    <button
      type="button"
      onClick={() => setExpandedItem({ type: 'chart', id, title, children })}
      className="bg-default-light rounded-lg border border-default-light-muted p-2.5 hover:shadow-md transition cursor-pointer h-full w-full text-left"
    >
      <HeadingView level={5} className="mb-2.5 text-default-dark text-sm">
        {title}
      </HeadingView>
      {children}
    </button>
  )

  // Modal ampliado
  const renderExpandedModal = () => {
    if (!expandedItem) return null

    if (expandedItem.type === 'kpi') {
      return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-default-light rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <HeadingView level={2} className="text-distac-primary">
                {expandedItem.label}
              </HeadingView>
              <button
                type="button"
                onClick={() => setExpandedItem(null)}
                className="p-2 hover:bg-default-light-muted rounded-lg transition"
                aria-label="Fechar"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex items-baseline gap-3 mb-4">
              <HeadingView level={1} className={clsx('font-bold', expandedItem.color)}>
                {expandedItem.value}
              </HeadingView>
              <TextView className="text-lg text-default-dark-light">
                {expandedItem.unit}
              </TextView>
            </div>
            <TextView className="text-default-dark-light text-sm">
              Período: {PERIOD_LABELS[reportData.periodType]}
            </TextView>
          </div>
        </div>
      )
    }

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-default-light rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <HeadingView level={2} className="text-distac-primary">
              {expandedItem.title}
            </HeadingView>
            <button
              type="button"
              onClick={() => setExpandedItem(null)}
              className="p-2 hover:bg-default-light-muted rounded-lg transition"
              aria-label="Fechar"
            >
              <X size={24} />
            </button>
          </div>
          <div className="h-96">
            {expandedItem.children}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <SectionView className="flex-col !gap-0 !p-0 bg-default-light-alt xl:h-full overflow-hidden">
        {/* Header com periodo e exportar */}
        <div className="border-b border-default-light-muted bg-default-light px-3 md:px-4 py-3 md:py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <HeadingView level={3} className="text-distac-primary mb-0.5 text-base">
              Relatório de Agendamentos
            </HeadingView>
            {estateAgentName && (
              <TextView className="text-default-dark-light text-xs">
                Corretor: <span className="font-semibold">{estateAgentName}</span>
              </TextView>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <select
                value={reportData.periodType}
                onChange={(e) => reportData.handlePeriodChange(e.target.value)}
                className="appearance-none pl-3 pr-8 py-1.5 rounded-lg border border-default-light-muted bg-default-light text-default-dark font-medium cursor-pointer hover:border-distac-secondary transition text-xs"
                aria-label="Período do relatório"
              >
                {Object.entries(PERIOD_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-default-dark-light" />
            </div>

            <ButtonView
              type="button"
              onClick={handleExportReport}
              color="brown"
              shape="rectangle"
              width="fit"
              className="!px-3 !py-1.5 !text-xs inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
              aria-label="Exportar relatório"
            >
              <Download size={14} />
              <span>Exportar</span>
            </ButtonView>
          </div>
        </div>

        {/* Main content: 2 columns layout */}
        <div className="flex flex-col xl:flex-row flex-1 min-h-0 overflow-hidden">
          {/* Left column: KPIs */}
          <div className="xl:w-56 flex-shrink-0 border-b xl:border-b-0 xl:border-r border-default-light-muted bg-default-light-alt overflow-y-auto p-2.5 md:p-3">
            <div className="space-y-2">
              <div>
                <HeadingView level={5} className="text-default-dark mb-1.5 text-xs">
                  Indicadores-Chave
                </HeadingView>
                <div className="space-y-1.5">
                  {renderKPICard('Total de Agendamentos', reportData.totalAppointments, '', 'text-distac-primary', 'kpi-total')}
                  {renderKPICard('Taxa de Confirmação', reportData.confirmationRate, '%', 'text-distac-secondary', 'kpi-confirm')}
                  {renderKPICard('Taxa de Conclusão', reportData.completionRate, '%', 'text-green-600', 'kpi-complete')}
                  {renderKPICard('Taxa de Cancelamento', reportData.cancellationRate, '%', 'text-red-600', 'kpi-cancel')}
                </div>
              </div>
            </div>
          </div>

          {/* Right column: Charts */}
          <div className="flex-1 min-h-0 overflow-y-auto p-3 md:p-4">
            <div className="space-y-3">
              {/* Row 1: Distribuição de Status e Agendamentos por Tipo */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 h-56">
                {pieChartData.length > 0 && (
                  renderChartCard(
                    'Distribuição de Status',
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={60}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [value, 'Agendamentos']} />
                      </PieChart>
                    </ResponsiveContainer>,
                    'chart-status'
                  )
                )}

                {reportData.appointmentsByEstateType.length > 0 && (
                  renderChartCard(
                    'Agendamentos por Tipo de Imóvel',
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart
                        data={reportData.appointmentsByEstateType}
                        margin={{ top: 5, right: 15, left: 0, bottom: 35 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="type"
                          angle={-45}
                          textAnchor="end"
                          height={60}
                          tick={{ fontSize: 10 }}
                        />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#b33c8e" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>,
                    'chart-estate-type'
                  )
                )}
              </div>

              {/* Row 2: Agendamentos por Dia e Tendência */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 h-56">
                {reportData.appointmentsByWeekDay.length > 0 && (
                  renderChartCard(
                    'Agendamentos por Dia da Semana',
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={reportData.appointmentsByWeekDay} margin={{ top: 5, right: 15, left: 0, bottom: 35 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#36221d" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>,
                    'chart-weekday'
                  )
                )}

                {reportData.timeSeriesDataByStatus.length > 0 && (
                  renderChartCard(
                    `Tendência (${PERIOD_LABELS[reportData.periodType]})`,
                    <ResponsiveContainer width="100%" height={200}>
                      <ComposedChart
                        data={reportData.timeSeriesDataByStatus}
                        margin={{ top: 5, right: 15, left: 0, bottom: 35 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={60} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: '10px' }} />
                        <Line
                          type="monotone"
                          dataKey="PENDING"
                          stroke="#b33c8e"
                          name="Agendado"
                          strokeWidth={2}
                          dot={false}
                        />
                        <Bar dataKey="CONFIRMED" fill="#36221d" name="Confirmado" />
                        <Bar dataKey="CONCLUDED" fill="#9b7a7a" name="Concluído" />
                        <Bar dataKey="CANCELLED" fill="#3d3c3c" name="Cancelado" />
                      </ComposedChart>
                    </ResponsiveContainer>,
                    'chart-trend'
                  )
                )}
              </div>

              {/* Row 3: Top 10 Imóveis (full width) */}
              {reportData.appointmentsByEstate.length > 0 && (
                <div className="h-56">
                  {renderChartCard(
                    'Top 10 Imóveis Mais Agendados',
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart
                        data={reportData.appointmentsByEstate}
                        layout="vertical"
                        margin={{ top: 5, right: 20, left: 120, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" tick={{ fontSize: 10 }} />
                        <YAxis type="category" dataKey="estate" width={110} tick={{ fontSize: 9 }} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#b33c8e" radius={[0, 8, 8, 0]} />
                      </BarChart>
                    </ResponsiveContainer>,
                    'chart-estates'
                  )}
                </div>
              )}

              {/* Empty state */}
              {appointments.length === 0 && (
                <div className="bg-default-light rounded-lg p-6 text-center border border-default-light-muted">
                  <HeadingView level={4} className="text-default-dark-light mb-2">
                    Sem dados para exibir
                  </HeadingView>
                  <TextView className="text-default-dark-light text-sm">
                    Nenhum agendamento encontrado para o período selecionado.
                  </TextView>
                </div>
              )}
            </div>
          </div>
        </div>
      </SectionView>

      {/* Modal expandido */}
      {renderExpandedModal()}
    </>
  )
}
