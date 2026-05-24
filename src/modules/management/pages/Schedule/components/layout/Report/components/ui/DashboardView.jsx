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
  LabelList,
} from 'recharts'
import { SectionView } from '@shared/components/layout/Section/SectionView'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { TextView } from '@shared/components/ui/Text/TextView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { Download, ChevronDown, X } from 'lucide-react'
import { PERIOD_LABELS } from '../../ReportModel'
import { useReportViewModel } from '../../useReportViewModel'
import clsx from 'clsx'

/**
 * DashboardView.jsx
 * Componente que exibe relatório com gráficos e KPIs
 * Layout: KPIs esquerda, Gráficos direita, sem scroll na tela principal
 */

const RADIAN = Math.PI / 180

export function DashboardView({
  appointments = [],
  estateAgentName = '',
}) {
  const reportData = useReportViewModel(appointments)
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
      className="w-full bg-default-light rounded-lg border border-default-light-muted p-1 flex flex-col gap-0.5 hover:shadow-md transition cursor-pointer text-left items-center justify-center"
    >
      <TextView className="text-[9px] uppercase text-default-dark-light font-semibold tracking-tight line-clamp-2 text-center">
        {label}
      </TextView>
      <div className="flex items-baseline gap-0.5">
        <HeadingView level={6} className={clsx('font-bold text-sm', color)}>
          {value}
        </HeadingView>
        <TextView className="text-[8px] text-default-dark-light">
          {unit}
        </TextView>
      </div>
    </button>
  )

  // Modal ampliado (KPIs e Gráficos)
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

    if (expandedItem.type === 'chart') {
      let chartContent = null

      if (expandedItem.id === 'estate-type') {
        chartContent = (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={reportData.appointmentsByEstateType} margin={{ top: 5, right: 15, left: 0, bottom: 35 }} animationDuration={400} isAnimationActive={true}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" angle={-45} textAnchor="end" height={60} tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#b33c8e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )
      } else if (expandedItem.id === 'estates') {
        chartContent = (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={reportData.appointmentsByEstate} layout="vertical" margin={{ top: 5, right: 20, left: 120, bottom: 5 }} animationDuration={400} isAnimationActive={true}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="estate" width={110} tick={{ fontSize: 9 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#b33c8e" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )
      } else if (expandedItem.id === 'distribution') {
        chartContent = (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart isAnimationActive={true}>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                animationDuration={400}
                isAnimationActive={false}
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
                <LabelList
                  dataKey="name"
                  position="outside"
                  fill="#333"
                  fontSize={12}
                />
              </Pie>
              <Tooltip formatter={(value) => [value, 'Agendamentos']} />
            </PieChart>
          </ResponsiveContainer>
        )
      } else if (expandedItem.id === 'weekday') {
        chartContent = (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={reportData.appointmentsByWeekDay} margin={{ top: 5, right: 15, left: 0, bottom: 35 }} animationDuration={400} isAnimationActive={true}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#36221d" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )
      } else if (expandedItem.id === 'trend') {
        chartContent = (
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={reportData.timeSeriesDataByStatus} margin={{ top: 5, right: 15, left: 0, bottom: 35 }} animationDuration={400} isAnimationActive={true}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              <Line type="monotone" dataKey="PENDING" stroke="#b33c8e" name="Agendado" strokeWidth={2} dot={false} />
              <Bar dataKey="CONFIRMED" fill="#36221d" name="Confirmado" />
              <Bar dataKey="CONCLUDED" fill="#9b7a7a" name="Concluído" />
              <Bar dataKey="CANCELLED" fill="#3d3c3c" name="Cancelado" />
            </ComposedChart>
          </ResponsiveContainer>
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
              {chartContent}
            </div>
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <>
      <SectionView className="flex-col !gap-0 !p-0 bg-default-light-alt xl:h-full overflow-hidden">
        {/* Header com periodo e exportar */}
        <div className="border-b border-default-light-muted bg-default-light px-3 md:px-4 py-2 md:py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div className="flex-1">
            <HeadingView level={3} className="text-distac-primary mb-0.5 text-sm">
              Relatório de Agendamentos
            </HeadingView>
            {estateAgentName && (
              <TextView className="text-default-dark-light text-[10px]">
                Corretor: <span className="font-semibold">{estateAgentName}</span>
              </TextView>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-1.5 flex-wrap">
            {/* Período */}
            <div className="relative">
              <select
                value={reportData.periodType}
                onChange={(e) => reportData.handlePeriodChange(e.target.value)}
                className="appearance-none pl-2 pr-6 py-1 rounded-lg border border-default-light-muted bg-default-light text-default-dark font-medium cursor-pointer hover:border-distac-secondary transition text-[11px]"
                aria-label="Período do relatório"
              >
                {Object.entries(PERIOD_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-default-dark-light" />
            </div>

            {/* Data Início */}
            <input
              type="date"
              value={reportData.startDate ? reportData.startDate.toISOString().split('T')[0] : ''}
              onChange={(e) => {
                const start = e.target.value ? new Date(e.target.value) : null
                reportData.handleDateChange(start, reportData.endDate)
              }}
              className="px-2 py-1 rounded-lg border border-default-light-muted bg-default-light text-default-dark font-medium cursor-pointer hover:border-distac-secondary transition text-[11px]"
              aria-label="Data de início"
            />

            {/* Data Fim */}
            <input
              type="date"
              value={reportData.endDate ? reportData.endDate.toISOString().split('T')[0] : ''}
              onChange={(e) => {
                const end = e.target.value ? new Date(e.target.value) : null
                reportData.handleDateChange(reportData.startDate, end)
              }}
              className="px-2 py-1 rounded-lg border border-default-light-muted bg-default-light text-default-dark font-medium cursor-pointer hover:border-distac-secondary transition text-[11px]"
              aria-label="Data de fim"
            />

            {/* Botão Resetar Datas */}
            {(reportData.startDate || reportData.endDate) && (
              <ButtonView
                type="button"
                onClick={reportData.handleResetDates}
                color="brown"
                shape="rectangle"
                width="fit"
                className="!px-2 !py-1 !text-[11px]"
                aria-label="Limpar filtro de datas"
              >
                Limpar
              </ButtonView>
            )}

            {/* Botão Exportar */}
            <ButtonView
              type="button"
              onClick={handleExportReport}
              color="brown"
              shape="rectangle"
              width="fit"
              className="!px-2 !py-1 !text-[11px] inline-flex items-center justify-center gap-1 whitespace-nowrap"
              aria-label="Exportar relatório"
            >
              <Download size={12} />
              <span>Exportar</span>
            </ButtonView>
          </div>
        </div>

        {/* Grid 5 colunas x 7 linhas com posicionamento fixo */}
        <div className="flex-1 min-h-0 overflow-hidden p-2 md:p-3">
          <div className="grid gap-2 h-full" style={{ gridTemplateColumns: 'repeat(5, 1fr)', gridTemplateRows: 'repeat(7, 1fr)' }}>
            {/* Coluna 1: Tipo de Imóvel (ocupa 7 linhas) */}
            {reportData.appointmentsByEstateType.length > 0 && (
              <button
                type="button"
                onClick={() => setExpandedItem({ type: 'chart', id: 'estate-type', title: 'Total de Agendamentos por Tipo de Imóvel' })}
                className="bg-default-light rounded-lg border border-default-light-muted p-1.5 overflow-hidden hover:shadow-md transition cursor-pointer text-left"
                style={{ gridColumn: '1', gridRow: '1 / 8' }}
              >
                <HeadingView level={6} className="text-[10px] text-default-dark mb-0.5 font-semibold line-clamp-1">
                  Total de Agendamentos por Tipo de Imóvel
                </HeadingView>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={reportData.appointmentsByEstateType}
                    margin={{ top: 2, right: 10, left: 0, bottom: 20 }}
                    animationDuration={400}
                    isAnimationActive={true}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                    <XAxis
                      dataKey="type"
                      angle={-45}
                      textAnchor="end"
                      height={40}
                      tick={{ fontSize: 7 }}
                    />
                    <YAxis tick={{ fontSize: 8 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#b33c8e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </button>
            )}

            {/* Linha 1: KPIs (4 colunas) */}
            <div style={{ gridColumn: '2', gridRow: '1' }}>
              {renderKPICard('Total de Agendamentos', reportData.totalAppointments, '', 'text-distac-primary', 'kpi-total')}
            </div>
            <div style={{ gridColumn: '3', gridRow: '1' }}>
              {renderKPICard('Taxa de Confirmação', reportData.confirmationRate, '%', 'text-distac-secondary', 'kpi-confirm')}
            </div>
            <div style={{ gridColumn: '4', gridRow: '1' }}>
              {renderKPICard('Taxa de Conclusão', reportData.completionRate, '%', 'text-green-600', 'kpi-complete')}
            </div>
            <div style={{ gridColumn: '5', gridRow: '1' }}>
              {renderKPICard('Taxa de Cancelamento', reportData.cancellationRate, '%', 'text-red-600', 'kpi-cancel')}
            </div>

            {/* Linhas 2-4: Top 10 Imóveis (3 cols) + Distribuição (1 col) */}
            {reportData.appointmentsByEstate.length > 0 && (
              <button
                type="button"
                onClick={() => setExpandedItem({ type: 'chart', id: 'estates', title: 'Top 10 Imóveis Mais Agendados' })}
                className="bg-default-light rounded-lg border border-default-light-muted p-1.5 overflow-hidden hover:shadow-md transition cursor-pointer text-left"
                style={{ gridColumn: '2 / 5', gridRow: '2 / 5' }}
              >
                <HeadingView level={6} className="text-[10px] text-default-dark mb-0.5 font-semibold line-clamp-1">
                  Top 10 Imóveis Mais Agendados
                </HeadingView>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={reportData.appointmentsByEstate}
                    layout="vertical"
                    margin={{ top: 2, right: 10, left: 70, bottom: 2 }}
                    animationDuration={400}
                    isAnimationActive={true}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                    <XAxis type="number" tick={{ fontSize: 8 }} />
                    <YAxis type="category" dataKey="estate" width={65} tick={{ fontSize: 7 }} />
                    <Tooltip cursor={{ fill: 'rgba(179, 60, 142, 0.1)' }} />
                    <Bar dataKey="count" fill="#b33c8e" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </button>
            )}

            {pieChartData.length > 0 && (
              <button
                type="button"
                onClick={() => setExpandedItem({ type: 'chart', id: 'distribution', title: 'Distribuição de Agendamentos por Status' })}
                className="bg-default-light rounded-lg border border-default-light-muted p-1.5 overflow-hidden hover:shadow-md transition cursor-pointer text-left"
                style={{ gridColumn: '5 / 6', gridRow: '2 / 5' }}
              >
                <HeadingView level={6} className="text-[10px] text-default-dark mb-0.5 font-semibold line-clamp-1">
                  Distribuição de Agendamentos por Status
                </HeadingView>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart isAnimationActive={true}>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={35}
                      fill="#8884d8"
                      dataKey="value"
                      isAnimationActive={false}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                      <LabelList
                        dataKey="name"
                        position="outside"
                        fill="#666"
                        fontSize={7}
                      />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </button>
            )}

            {/* Linhas 5-7: Agendamentos por Dia (2 cols) + Tendência (2 cols) */}
            {reportData.appointmentsByWeekDay.length > 0 && (
              <button
                type="button"
                onClick={() => setExpandedItem({ type: 'chart', id: 'weekday', title: 'Total de Agendamentos por Dia da Semana' })}
                className="bg-default-light rounded-lg border border-default-light-muted p-1.5 overflow-hidden hover:shadow-md transition cursor-pointer text-left"
                style={{ gridColumn: '2 / 4', gridRow: '5 / 8' }}
              >
                <HeadingView level={6} className="text-[10px] text-default-dark mb-0.5 font-semibold line-clamp-1">
                  Total de Agendamentos Por Dia da Semana
                </HeadingView>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData.appointmentsByWeekDay} margin={{ top: 2, right: 10, left: 0, bottom: 20 }} animationDuration={400} isAnimationActive={true}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                    <XAxis dataKey="day" tick={{ fontSize: 7 }} angle={-45} textAnchor="end" height={40} />
                    <YAxis tick={{ fontSize: 8 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#36221d" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </button>
            )}

            {reportData.timeSeriesDataByStatus.length > 0 && (
              <button
                type="button"
                onClick={() => setExpandedItem({ type: 'chart', id: 'trend', title: `Tendência (${PERIOD_LABELS[reportData.periodType]})` })}
                className="bg-default-light rounded-lg border border-default-light-muted p-1.5 overflow-hidden hover:shadow-md transition cursor-pointer text-left"
                style={{ gridColumn: '4 / 6', gridRow: '5 / 8' }}
              >
                <HeadingView level={6} className="text-[10px] text-default-dark mb-0.5 font-semibold line-clamp-1">
                  Tendência ({PERIOD_LABELS[reportData.periodType]})
                </HeadingView>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={reportData.timeSeriesDataByStatus}
                    margin={{ top: 2, right: 10, left: 0, bottom: 20 }}
                    animationDuration={400}
                    isAnimationActive={true}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                    <XAxis dataKey="period" tick={{ fontSize: 7 }} angle={-45} textAnchor="end" height={40} />
                    <YAxis tick={{ fontSize: 8 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '7px' }} />
                    <Line
                      type="monotone"
                      dataKey="PENDING"
                      stroke="#b33c8e"
                      name="Agendado"
                      strokeWidth={1.5}
                      dot={false}
                    />
                    <Bar dataKey="CONFIRMED" fill="#36221d" name="Confirmado" />
                    <Bar dataKey="CONCLUDED" fill="#9b7a7a" name="Concluído" />
                    <Bar dataKey="CANCELLED" fill="#3d3c3c" name="Cancelado" />
                  </ComposedChart>
                </ResponsiveContainer>
              </button>
            )}

            {/* Empty state */}
            {appointments.length === 0 && (
              <div className="bg-default-light rounded-lg p-4 text-center border border-default-light-muted flex flex-col items-center justify-center" style={{ gridColumn: '1 / 6', gridRow: '1 / 8' }}>
                <HeadingView level={5} className="text-default-dark-light mb-1 text-xs">
                  Sem dados para exibir
                </HeadingView>
                <TextView className="text-default-dark-light text-[11px]">
                  Nenhum agendamento encontrado para o período selecionado.
                </TextView>
              </div>
            )}
          </div>
        </div>
      </SectionView>

      {/* Modal expandido */}
      {renderExpandedModal()}
    </>
  )
}
