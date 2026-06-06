import clsx from 'clsx'

/**
 * SkeletonView.jsx
 * Componente visual genérico de skeleton loading.
 * Configurado através de `className` e atributos HTML padrão.
 */
export function SkeletonView({ className = '', ...props }) {
  return (
    <div
      className={clsx('animate-pulse rounded-xl bg-default-dark-muted', className)}
      {...props}
    />
  )
}
