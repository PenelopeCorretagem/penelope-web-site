import clsx from 'clsx'

/**
 * SkeletonView.jsx
 * Componente visual de skeleton loading reutilizável.
 *
 * Variantes:
 * - calendar: placeholder para painel de calendário + sidebars
 * - dashboard: placeholder para KPIs e gráficos — espelha o grid 5×7 do DashboardView
 * - table: placeholder para tabelas de registros
 */
export function SkeletonView({
  variant = 'default',
  rows = 4,
  columns = 1,
  className = '',
}) {
  const baseClass = 'animate-pulse rounded-xl bg-default-dark-muted'

  const renderBlocks = (count) =>
    Array.from({ length: count }, (_, index) => (
      <div key={index} className={clsx(baseClass, 'h-10 w-full')} />
    ))

  const renderTableRows = () =>
    Array.from({ length: rows }, (_, rowIndex) => (
      <div key={rowIndex} className="grid gap-3" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {renderBlocks(columns)}
      </div>
    ))

  if (variant === 'calendar') {
    return (
      <div className={clsx('grid gap-4 xl:grid-cols-[1fr_2fr_0.9fr] animate-pulse h-full', className)}>
        <div className={clsx(baseClass, ' h-full')} />
        <div className={clsx(baseClass, ' h-full')} />
        <div className={clsx(baseClass, ' h-full')} />
      </div>
    )
  }

  if (variant === 'dashboard') {
    // Espelha exatamente o grid 5 colunas × 7 linhas do DashboardView:
    //
    // Col 1  (linhas 1–7): gráfico de tipo de imóvel (coluna lateral alta)
    // Col 2–5 (linha 1)  : 4 KPI cards
    // Col 2–4 (linhas 2–4): gráfico top 10 imóveis
    // Col 5   (linhas 2–4): gráfico donut status
    // Col 2–3 (linhas 5–7): gráfico por dia da semana
    // Col 4–5 (linhas 5–7): gráfico de tendência
    return (
      <div
        className={clsx('animate-pulse grid gap-2 w-full h-full', className)}
        style={{
          gridTemplateColumns: 'repeat(5, 1fr)',
          gridTemplateRows: '1fr 3fr 3fr 3fr 3fr 3fr 3fr',
        }}
      >
        {/* Col 1, linhas 1–7: coluna lateral (tipo de imóvel) */}
        <div
          className={clsx(baseClass)}
          style={{ gridColumn: '1', gridRow: '1 / 8' }}
        />

        {/* Linha 1, cols 2–5: 4 KPI cards */}
        <div className={clsx(baseClass)} style={{ gridColumn: '2', gridRow: '1' }} />
        <div className={clsx(baseClass)} style={{ gridColumn: '3', gridRow: '1' }} />
        <div className={clsx(baseClass)} style={{ gridColumn: '4', gridRow: '1' }} />
        <div className={clsx(baseClass)} style={{ gridColumn: '5', gridRow: '1' }} />

        {/* Linhas 2–4, cols 2–4: top 10 imóveis */}
        <div
          className={clsx(baseClass)}
          style={{ gridColumn: '2 / 5', gridRow: '2 / 5' }}
        />

        {/* Linhas 2–4, col 5: donut de status */}
        <div
          className={clsx(baseClass)}
          style={{ gridColumn: '5 / 6', gridRow: '2 / 5' }}
        />

        {/* Linhas 5–7, cols 2–3: por dia da semana */}
        <div
          className={clsx(baseClass)}
          style={{ gridColumn: '2 / 4', gridRow: '5 / 8' }}
        />

        {/* Linhas 5–7, cols 4–5: tendência */}
        <div
          className={clsx(baseClass)}
          style={{ gridColumn: '4 / 6', gridRow: '5 / 8' }}
        />
      </div>
    )
  }

  if (variant === 'table') {
    return (
      <div className={clsx('space-y-3 animate-pulse', className)}>
        {renderTableRows()}
      </div>
    )
  }

  return (
    <div className={clsx('space-y-3 animate-pulse', className)}>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className={clsx(baseClass, 'h-10 w-full')} />
      ))}
    </div>
  )
}
