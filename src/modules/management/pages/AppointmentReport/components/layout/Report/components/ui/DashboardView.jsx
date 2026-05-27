import { useState } from 'react'
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
import { SkeletonView } from '@shared/components/ui/Skeleton/SkeletonView'
import { X } from 'lucide-react'
import { PERIOD_LABELS } from '../../ReportModel'
import clsx from 'clsx'
import { APPOINTMENT_STATUS_LABELS } from '@constant/appointmentStatuses'
/**
 * DashboardView.jsx
 *
 * Exibe relatório com gráficos e KPIs.
 *
 * Correções aplicadas:
 * 1. Empty state: verifica `appointments.length === 0` ANTES de renderizar o grid,
 *    evitando que o Recharts tente medir containers com dimensão zero.
 * 2. getAppointmentsByWeekDay: agora retorna [] quando não há dados (corrigido no Model).
 * 3. minHeight no container do grid para garantir que o Recharts sempre receba > 0.
 */

export function DashboardView({
  reportData,
  isLoading = false,
}) {
  const [expandedItem, setExpandedItem] = useState(null)

  const COLORS_BY_STATUS = {
    PENDING: '#b33c8e',
    CONFIRMED: '#36221d',
    CONCLUDED: '#9b7a7a',
    CANCELLED: '#3d3c3c',
  }

  const STATUS_LABELS_MAP = APPOINTMENT_STATUS_LABELS

  const pieChartData = Object.entries({
    PENDING: 0,
    CONFIRMED: 0,
    CONCLUDED: 0,
    CANCELLED: 0,
    ...reportData.statusDistribution,
  }).map(([status, count]) => ({
    name: STATUS_LABELS_MAP[status] || status,
    value: count,
    fill: COLORS_BY_STATUS[status],
  }))

  // ─── Loading ─────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <SectionView className="bg-default-light rounded-lg border border-default-light-muted shadow-sm h-full !p-10">
        <SkeletonView variant="dashboard" />
      </SectionView>
    )
  }

  // ─── Empty state ─────────────────────────────────────────────────────────
  // Renderizado ANTES do grid para que o Recharts jamais tente
  // medir containers inexistentes com width/height -1.
  if (reportData.totalAppointments === 0) {
    return (
      <SectionView className="flex-col !gap-0 !p-0 bg-default-light-alt xl:h-full overflow-hidden">
        <div className="flex items-center justify-center h-full min-h-[300px]">
          <div className="bg-default-light rounded-lg p-6 text-center border border-default-light-muted flex flex-col items-center justify-center max-w-sm">
            <HeadingView level={5} className="text-default-dark-light mb-1 text-xs">
              Sem dados para exibir
            </HeadingView>
            <TextView className="text-default-dark-light text-[11px]">
              Nenhum agendamento encontrado para o período selecionado.
            </TextView>
          </div>
        </div>
      </SectionView>
    )
  }

  // ─── KPI Card ─────────────────────────────────────────────────────────────
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

  // ─── Modal expandido ──────────────────────────────────────────────────────
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
            <BarChart data={reportData.appointmentsByEstateType} margin={{ top: 5, right: 15, left: 0, bottom: 35 }}>
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
            <BarChart data={reportData.appointmentsByEstate} layout="vertical" margin={{ top: 5, right: 20, left: 120, bottom: 5 }}>
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
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                dataKey="value"
                isAnimationActive={false}
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
                <LabelList dataKey="name" position="outside" fill="#333" fontSize={12} />
              </Pie>
              <Tooltip formatter={(value) => [value, 'Agendamentos']} />
            </PieChart>
          </ResponsiveContainer>
        )
      } else if (expandedItem.id === 'weekday') {
        chartContent = (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={reportData.appointmentsByWeekDay} margin={{ top: 5, right: 15, left: 0, bottom: 35 }}>
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
            <ComposedChart data={reportData.timeSeriesDataByStatus} margin={{ top: 5, right: 15, left: 0, bottom: 35 }}>
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

  // ─── Dashboard com dados ──────────────────────────────────────────────────
  // O `min-h-0` + `minHeight` no estilo garante que o Recharts sempre
  // receba dimensões positivas ao medir os containers via ResizeObserver.
  const hasEstateTypeData = reportData.appointmentsByEstateType.length > 0
  const hasEstateData = reportData.appointmentsByEstate.length > 0
  const hasPieData = pieChartData.some((d) => d.value > 0)
  const hasWeekDayData = reportData.appointmentsByWeekDay.length > 0
  const hasTrendData = reportData.timeSeriesDataByStatus.length > 0

  return (
    <>
      <SectionView className="flex-col !gap-0 !p-0 bg-default-light-alt xl:h-full overflow-hidden">
        <div className="flex-1 min-h-0 overflow-hidden" style={{ minHeight: '400px' }}>
          <div
            className="grid gap-2 h-full"
            style={{
              gridTemplateColumns: 'repeat(5, 1fr)',
              gridTemplateRows: 'repeat(7, 1fr)',
            }}
          >
            {/* Coluna 1: Tipo de Imóvel (ocupa 7 linhas) */}
            {hasEstateTypeData && (
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
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                    <XAxis dataKey="type" angle={-45} textAnchor="end" height={40} tick={{ fontSize: 7 }} />
                    <YAxis tick={{ fontSize: 8 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#b33c8e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </button>
            )}

            {/* Linha 1: KPIs (cols 2-5) */}
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

            {/* Linhas 2-4: Top 10 Imóveis (cols 2-4) */}
            {hasEstateData && (
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

            {/* Linhas 2-4: Distribuição por Status (col 5) */}
            {hasPieData && (
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
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={35}
                      dataKey="value"
                      isAnimationActive={false}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                      <LabelList dataKey="name" position="outside" fill="#666" fontSize={7} />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </button>
            )}

            {/* Linhas 5-7: Agendamentos por Dia da Semana (cols 2-3) */}
            {hasWeekDayData && (
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
                  <BarChart data={reportData.appointmentsByWeekDay} margin={{ top: 2, right: 10, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                    <XAxis dataKey="day" tick={{ fontSize: 7 }} angle={-45} textAnchor="end" height={40} />
                    <YAxis tick={{ fontSize: 8 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#36221d" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </button>
            )}

            {/* Linhas 5-7: Tendência (cols 4-5) */}
            {hasTrendData && (
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
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                    <XAxis dataKey="period" tick={{ fontSize: 7 }} angle={-45} textAnchor="end" height={40} />
                    <YAxis tick={{ fontSize: 8 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '7px' }} />
                    <Line type="monotone" dataKey="PENDING" stroke="#b33c8e" name="Agendado" strokeWidth={1.5} dot={false} />
                    <Bar dataKey="CONFIRMED" fill="#36221d" name="Confirmado" />
                    <Bar dataKey="CONCLUDED" fill="#9b7a7a" name="Concluído" />
                    <Bar dataKey="CANCELLED" fill="#3d3c3c" name="Cancelado" />
                  </ComposedChart>
                </ResponsiveContainer>
              </button>
            )}
          </div>
        </div>
      </SectionView>

      {/* Modal expandido */}
      {renderExpandedModal()}
    </>
  )
}
