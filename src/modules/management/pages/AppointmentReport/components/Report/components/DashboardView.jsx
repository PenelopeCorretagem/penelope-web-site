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
} from 'recharts'
import { SectionView } from '@shared/components/layout/Section/SectionView'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { TextView } from '@shared/components/ui/Text/TextView'
import { SkeletonView } from '@shared/components/ui/Skeleton/SkeletonView'
import { X, Minus } from 'lucide-react'
import { PERIOD_LABELS } from '../ReportModel'
import clsx from 'clsx'
import { APPOINTMENT_STATUS_LABELS } from '@constant/appointmentStatuses'
import { useMinLoadingTime } from '@shared/hooks/useMinLoadingTime';

const COLORS_BY_STATUS = {
  PENDING: '#b33c8e',
  CONFIRMED: '#36221d',
  CONCLUDED: '#9b7a7a',
  CANCELLED: '#3d3c3c',
}

const toSafeNumber = (value) => {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : 0
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-default-light border border-default-light-muted rounded-lg shadow-lg px-3 py-2 text-xs">
      {label && <p className="font-semibold text-default-dark mb-1">{label}</p>}
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color || entry.fill }} className="font-medium">
          {entry.name ? `${entry.name}: ` : ''}{entry.value}
        </p>
      ))}
    </div>
  )
}

export function DashboardView({
  reportData,
  isLoading = false,
}) {
  const [expandedItem, setExpandedItem] = useState(null)
  const isMinLoading = useMinLoadingTime(isLoading);

  const STATUS_LABELS_MAP = APPOINTMENT_STATUS_LABELS

  const pieChartData = Object.entries({
    PENDING: 0,
    CONFIRMED: 0,
    CONCLUDED: 0,
    CANCELLED: 0,
    ...(reportData?.statusDistribution ?? {}),
  })
    .filter(([, count]) => Number(count) > 0)
    .map(([status, count]) => ({
      name: STATUS_LABELS_MAP[status] || status,
      value: toSafeNumber(count),
      fill: COLORS_BY_STATUS[status],
    }))

  // ─── Loading ──────────────────────────────────────────────────────────────
  if (isMinLoading) {
    return (
      <div
        className="grid gap-2 w-full h-full min-h-[500px]"
        style={{
          gridTemplateColumns: 'repeat(5, 1fr)',
          gridTemplateRows: '1fr 3fr 3fr 3fr 3fr 3fr 3fr',
        }}
      >
        <SkeletonView className="h-full w-full" style={{ gridColumn: '1', gridRow: '1 / 8' }} />
        <SkeletonView className="h-full w-full" style={{ gridColumn: '2', gridRow: '1' }} />
        <SkeletonView className="h-full w-full" style={{ gridColumn: '3', gridRow: '1' }} />
        <SkeletonView className="h-full w-full" style={{ gridColumn: '4', gridRow: '1' }} />
        <SkeletonView className="h-full w-full" style={{ gridColumn: '5', gridRow: '1' }} />
        <SkeletonView className="h-full w-full" style={{ gridColumn: '2 / 5', gridRow: '2 / 5' }} />
        <SkeletonView className="h-full w-full" style={{ gridColumn: '5 / 6', gridRow: '2 / 5' }} />
        <SkeletonView className="h-full w-full" style={{ gridColumn: '2 / 4', gridRow: '5 / 8' }} />
        <SkeletonView className="h-full w-full" style={{ gridColumn: '4 / 6', gridRow: '5 / 8' }} />
      </div>
    )
  }

  // ─── Empty state ──────────────────────────────────────────────────────────
  if (toSafeNumber(reportData.totalAppointments) === 0) {
    return (
      <SectionView className="flex-col !gap-0 !p-0 bg-default-light-alt xl:h-full overflow-hidden">
        <div className="flex items-center justify-center h-full min-h-[300px]">
          <div className="bg-default-light rounded-xl p-8 text-center border border-default-light-muted flex flex-col items-center justify-center max-w-xs gap-3 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-default-light-muted flex items-center justify-center">
              <Minus size={20} className="text-default-dark-light" />
            </div>
            <div>
              <HeadingView level={5} className="text-default-dark text-sm font-semibold mb-1">
                Sem dados para exibir
              </HeadingView>
              <TextView className="text-default-dark-light text-xs leading-relaxed">
                Nenhum agendamento encontrado para o período selecionado.
              </TextView>
            </div>
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
      className="group w-full h-full bg-default-light rounded-xl border border-default-light-muted px-2 py-2 flex flex-col gap-1 hover:shadow-md hover:border-distac-primary/30 transition-all duration-200 cursor-pointer items-center justify-center"
    >
      <span className="text-[10px] uppercase text-default-dark-light font-semibold tracking-widest line-clamp-2 text-center leading-tight">
        {label}
      </span>
      <div className="flex items-baseline gap-1">
        <span className={clsx('font-bold tabular-nums leading-none', color, 'text-2xl')}>
          {value}
        </span>
        {unit && (
          <span className="text-[12px] text-default-dark-light font-semibold">{unit}</span>
        )}
      </div>
    </button>
  )

  // ─── Modal expandido ──────────────────────────────────────────────────────
  const renderExpandedModal = () => {
    if (!expandedItem) return null

    if (expandedItem.type === 'kpi') {
      return (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setExpandedItem(null) }}
        >
          <div className="bg-default-light rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-default-light-muted">
              <span className="text-xs uppercase tracking-widest font-semibold text-default-dark-light">
                Indicador
              </span>
              <button
                type="button"
                onClick={() => setExpandedItem(null)}
                className="w-7 h-7 rounded-full bg-default-light-muted hover:bg-default-light-alt flex items-center justify-center transition"
                aria-label="Fechar"
              >
                <X size={14} />
              </button>
            </div>
            <div className="px-6 py-6 flex flex-col items-center text-center gap-4">
              <p className="text-default-dark font-semibold text-sm leading-snug max-w-[220px]">
                {expandedItem.label}
              </p>
              <div className="flex items-end gap-1.5">
                <span className={clsx('font-black text-5xl tabular-nums leading-none', expandedItem.color)}>
                  {expandedItem.value}
                </span>
                {expandedItem.unit && (
                  <span className="text-default-dark-light text-xl font-medium mb-1">
                    {expandedItem.unit}
                  </span>
                )}
              </div>
              <div className="bg-default-light-alt rounded-lg px-4 py-2 w-full">
                <span className="text-default-dark-light text-xs">
                  Período: <span className="font-semibold text-default-dark">{PERIOD_LABELS[reportData.periodType]}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (expandedItem.type === 'chart') {
      let chartContent = null

      if (expandedItem.id === 'estate-type') {
        chartContent = (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={reportData.appointmentsByEstateType} margin={{ top: 10, right: 20, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" vertical={false} />
              <XAxis dataKey="type" angle={-35} textAnchor="end" height={70} tick={{ fontSize: 12, fill: '#444' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#444' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#b33c8e" radius={[6, 6, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        )
      } else if (expandedItem.id === 'estates') {
        chartContent = (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={reportData.appointmentsByEstate} layout="vertical" margin={{ top: 10, right: 20, left: 140, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#444' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="estate" width={130} tick={{ fontSize: 11, fill: '#444' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#b33c8e" radius={[0, 6, 6, 0]} maxBarSize={20} />
            </BarChart>
          </ResponsiveContainer>
        )
      } else if (expandedItem.id === 'distribution') {
        chartContent = (
          <div className="flex flex-col items-center gap-4">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={pieChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={110} paddingAngle={3} dataKey="value" isAnimationActive={false}>
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} formatter={(value) => [value, 'Agendamentos']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 justify-center">
              {pieChartData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: entry.fill }} />
                  <span className="text-xs text-default-dark-light font-medium">{entry.name}</span>
                  <span className="text-xs font-bold text-default-dark">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        )
      } else if (expandedItem.id === 'weekday') {
        chartContent = (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={reportData.appointmentsByWeekDay} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#444' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#444' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#36221d" radius={[6, 6, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        )
      } else if (expandedItem.id === 'trend') {
        chartContent = (
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={reportData.timeSeriesDataByStatus} margin={{ top: 10, right: 20, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" vertical={false} />
              <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#444' }} angle={-35} textAnchor="end" height={70} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#444' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} formatter={(value) => <span style={{ color: '#555', fontWeight: 500 }}>{value}</span>} />
              <Line type="monotone" dataKey="PENDING" stroke="#b33c8e" name="Agendado" strokeWidth={2.5} dot={false} />
              <Bar dataKey="CONFIRMED" fill="#36221d" name="Confirmado" radius={[4, 4, 0, 0]} maxBarSize={24} />
              <Bar dataKey="CONCLUDED" fill="#9b7a7a" name="Concluído" radius={[4, 4, 0, 0]} maxBarSize={24} />
              <Bar dataKey="CANCELLED" fill="#3d3c3c" name="Cancelado" radius={[4, 4, 0, 0]} maxBarSize={24} />
            </ComposedChart>
          </ResponsiveContainer>
        )
      }

      return (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setExpandedItem(null) }}
        >
          <div className="bg-default-light rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-default-light-muted sticky top-0 bg-default-light rounded-t-2xl z-10">
              <p className="text-default-dark font-semibold text-sm">{expandedItem.title}</p>
              <button
                type="button"
                onClick={() => setExpandedItem(null)}
                className="w-7 h-7 rounded-full bg-default-light-muted hover:bg-default-light-alt flex items-center justify-center transition"
                aria-label="Fechar"
              >
                <X size={14} />
              </button>
            </div>
            <div className="px-4 py-6">{chartContent}</div>
          </div>
        </div>
      )
    }

    return null
  }

  // ─── Guards ───────────────────────────────────────────────────────────────
  const hasEstateTypeData = reportData.appointmentsByEstateType.length > 0
  const hasEstateData = reportData.appointmentsByEstate.length > 0
  const hasPieData = pieChartData.length > 0
  const hasWeekDayData = reportData.appointmentsByWeekDay.length > 0
  const hasTrendData = reportData.timeSeriesDataByStatus.length > 0

  // ─── Grid ─────────────────────────────────────────────────────────────────
  // Linhas do grid (em fr):
  //   linha 1 = KPIs → pequena (1fr)
  //   linhas 2–4 = gráficos médios → 3fr cada
  //   linhas 5–7 = gráficos inferiores → 3fr cada
  // Total: 1 + 3 + 3 + 3 + 3 + 3 + 3 = 19fr, mas simplificamos com repeat
  // Na prática usamos: "1fr 3fr 3fr 3fr 3fr 3fr 3fr" p/ dar linha 1 bem menor
  return (
    <>
      <SectionView className="flex-col !gap-0 !p-0 bg-default-light-alt xl:h-full overflow-hidden">
        <div className="flex-1 min-h-0 overflow-hidden" style={{ minHeight: '350px' }}>
          <div
            className="grid gap-2 h-full"
            style={{
              gridTemplateColumns: 'repeat(5, 1fr)',
              gridTemplateRows: '1fr 3fr 3fr 3fr 3fr 3fr 3fr',
            }}
          >
            {/* Col 1, linhas 1–7: tipo de imóvel */}
            {hasEstateTypeData && (
              <button
                type="button"
                onClick={() => setExpandedItem({ type: 'chart', id: 'estate-type', title: 'Agendamentos por Tipo de Imóvel' })}
                className="group bg-default-light rounded-xl border border-default-light-muted p-2 overflow-hidden hover:shadow-md hover:border-distac-primary/30 transition-all duration-200 cursor-pointer text-left flex flex-col"
                style={{ gridColumn: '1', gridRow: '1 / 8' }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-widest text-default-dark-light mb-1 line-clamp-1 flex-shrink-0">
                  Por Tipo de Imóvel
                </p>
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={reportData.appointmentsByEstateType} margin={{ top: 4, right: 4, left: -22, bottom: 28 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#efefef" vertical={false} />
                      <XAxis dataKey="type" angle={-35} textAnchor="end" height={48} tick={{ fontSize: 13, fill: '#666' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 13, fill: '#666' }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="count" fill="#b33c8e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </button>
            )}

            {/* Linha 1, cols 2–5: KPIs pequenos */}
            <div style={{ gridColumn: '2', gridRow: '1' }}>
              {renderKPICard('Total de Agendamentos', toSafeNumber(reportData.totalAppointments), '', 'text-distac-primary', 'kpi-total')}
            </div>
            <div style={{ gridColumn: '3', gridRow: '1' }}>
              {renderKPICard('Taxa de Confirmação', toSafeNumber(reportData.confirmationRate), '%', 'text-distac-secondary', 'kpi-confirm')}
            </div>
            <div style={{ gridColumn: '4', gridRow: '1' }}>
              {renderKPICard('Taxa de Conclusão', toSafeNumber(reportData.completionRate), '%', 'text-green-600', 'kpi-complete')}
            </div>
            <div style={{ gridColumn: '5', gridRow: '1' }}>
              {renderKPICard('Taxa de Cancelamento', toSafeNumber(reportData.cancellationRate), '%', 'text-red-500', 'kpi-cancel')}
            </div>

            {/* Linhas 2–4, cols 2–4: top 10 imóveis */}
            {hasEstateData && (
              <button
                type="button"
                onClick={() => setExpandedItem({ type: 'chart', id: 'estates', title: 'Top 10 Imóveis Mais Agendados' })}
                className="group bg-default-light rounded-xl border border-default-light-muted p-2 overflow-hidden hover:shadow-md hover:border-distac-primary/30 transition-all duration-200 cursor-pointer text-left flex flex-col"
                style={{ gridColumn: '2 / 5', gridRow: '2 / 5' }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-widest text-default-dark-light mb-1 flex-shrink-0">
                  Top 10 Imóveis Mais Agendados
                </p>
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={reportData.appointmentsByEstate} layout="vertical" margin={{ top: 2, right: 12, left: 70, bottom: 2 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#efefef" horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 12, fill: '#555' }} axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="estate" width={100} tick={{ fontSize: 13, fill: '#555' }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(179,60,142,0.06)' }} />
                      <Bar dataKey="count" fill="#b33c8e" radius={[0, 4, 4, 0]} maxBarSize={14} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </button>
            )}

            {/* Linhas 2–4, col 5: donut de status */}
            {hasPieData && (
              <button
                type="button"
                onClick={() => setExpandedItem({ type: 'chart', id: 'distribution', title: 'Distribuição por Status' })}
                className="group bg-default-light rounded-xl border border-default-light-muted p-2 overflow-hidden hover:shadow-md hover:border-distac-primary/30 transition-all duration-200 cursor-pointer text-left flex flex-col"
                style={{ gridColumn: '5 / 6', gridRow: '2 / 5' }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-widest text-default-dark-light mb-1 flex-shrink-0 line-clamp-1">
                  Por Status
                </p>
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieChartData} cx="50%" cy="50%" innerRadius="24%" outerRadius="60%" paddingAngle={2} dataKey="value" isAnimationActive={false}>
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} formatter={(value) => [value, 'Agendamentos']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col gap-1 mt-1 flex-shrink-0">
                  {pieChartData.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: entry.fill }} />
                      <span className="text-[11px] text-default-dark-light truncate">{entry.name}</span>
                      <span className="text-[11px] font-bold text-default-dark ml-auto">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </button>
            )}

            {/* Linhas 5–7, cols 2–3: por dia da semana */}
            {hasWeekDayData && (
              <button
                type="button"
                onClick={() => setExpandedItem({ type: 'chart', id: 'weekday', title: 'Agendamentos por Dia da Semana' })}
                className="group bg-default-light rounded-xl border border-default-light-muted p-2 overflow-hidden hover:shadow-md hover:border-distac-primary/30 transition-all duration-200 cursor-pointer text-left flex flex-col"
                style={{ gridColumn: '2 / 4', gridRow: '5 / 8' }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-widest text-default-dark-light mb-1 flex-shrink-0">
                  Por Dia da Semana
                </p>
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={reportData.appointmentsByWeekDay} margin={{ top: 4, right: 4, left: -22, bottom: 4 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#efefef" vertical={false} />
                      <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#555' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: '#555' }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="count" fill="#36221d" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </button>
            )}

            {/* Linhas 5–7, cols 4–5: tendência */}
            {hasTrendData && (
              <button
                type="button"
                onClick={() => setExpandedItem({ type: 'chart', id: 'trend', title: `Tendência — ${PERIOD_LABELS[reportData.periodType]}` })}
                className="group bg-default-light rounded-xl border border-default-light-muted p-2 overflow-hidden hover:shadow-md hover:border-distac-primary/30 transition-all duration-200 cursor-pointer text-left flex flex-col"
                style={{ gridColumn: '4 / 6', gridRow: '5 / 8' }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-widest text-default-dark-light mb-1 flex-shrink-0">
                  Tendência — {PERIOD_LABELS[reportData.periodType]}
                </p>
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={reportData.timeSeriesDataByStatus} margin={{ top: 4, right: 4, left: -22, bottom: 28 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#efefef" vertical={false} />
                      <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#555' }} angle={-35} textAnchor="end" height={46} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: '#555' }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '4px' }} formatter={(value) => <span style={{ color: '#888' }}>{value}</span>} />
                      <Line type="monotone" dataKey="PENDING" stroke="#b33c8e" name="Agendado" strokeWidth={1.5} dot={false} />
                      <Bar dataKey="CONFIRMED" fill="#36221d" name="Confirmado" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="CONCLUDED" fill="#9b7a7a" name="Concluído" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="CANCELLED" fill="#3d3c3c" name="Cancelado" radius={[3, 3, 0, 0]} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </button>
            )}
          </div>
        </div>
      </SectionView>

      {renderExpandedModal()}
    </>
  )
}
