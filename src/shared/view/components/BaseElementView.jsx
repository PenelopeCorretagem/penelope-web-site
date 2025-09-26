/**
 * BaseElementView - Componente base para elementos UI
 * Renderiza elementos dinâmicos baseados no ViewModel
 */
export function BaseElementView({ viewModel, ...extraProps }) {
  if (!viewModel) {
    throw new Error('BaseElementView requires a viewModel prop')
  }

  const Component = viewModel.as

  return (
    <Component className={viewModel.finalClassName} {...extraProps}>
      {viewModel.children}
    </Component>
  )
}
