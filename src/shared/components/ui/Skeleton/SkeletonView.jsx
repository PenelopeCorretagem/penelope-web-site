import clsx from 'clsx'

/**
 * SkeletonView.jsx
 * Componente visual de skeleton loading reutilizável.
 * Use este componente para indicar que a tela ainda está carregando
 * e manter a hierarquia visual da interface.
 *
 * Variantes:
 * - calendar: placeholder para painel de calendário + sidebars
 * - dashboard: placeholder para KPIs e gráficos de relatório
 * - table: placeholder para tabelas de registros
 */
export function SkeletonView({
  variant = 'default',
  rows = 4,
  columns = 1,
  className = '',
}) {
  const baseClass = 'animate-pulse rounded-2xl bg-default-dark-muted'

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
      <div className={clsx('grid gap-4 xl:grid-cols-[2fr_1fr_0.9fr] animate-pulse', className)}>
        <div className={clsx(baseClass, 'min-h-[520px]')} />
        <div className="space-y-4">
          <div className={clsx(baseClass, 'h-32')} />
          <div className={clsx(baseClass, 'h-[260px]')} />
        </div>
        <div className="space-y-4">
          <div className={clsx(baseClass, 'h-40')} />
          <div className={clsx(baseClass, 'h-40')} />
        </div>
      </div>
    )
  }

  if (variant === 'dashboard') {
    return (
      <div className={clsx('space-y-4 animate-pulse', className)}>
        <div className="grid gap-4 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className={clsx(baseClass, 'h-24')} />
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <div className={clsx(baseClass, 'h-64')} />
          <div className="grid gap-4">
            <div className={clsx(baseClass, 'h-32')} />
            <div className={clsx(baseClass, 'h-32')} />
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <div className={clsx(baseClass, 'h-48')} />
          <div className={clsx(baseClass, 'h-48')} />
          <div className={clsx(baseClass, 'h-48')} />
        </div>
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
