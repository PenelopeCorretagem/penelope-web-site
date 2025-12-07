import { SectionView } from '@shared/components/layout/Section/SectionView'
import { TextView } from '@shared/components/ui/Text/TextView'

/**
 * LoadingView - Página de carregamento
 *
 * Componente simples que não precisa de ViewModel pois:
 * - Não tem lógica de negócio
 * - Não tem estado complexo
 * - Apenas renderiza UI de loading
 */
export function LoadingView({ message = 'Verificando acesso...' }) {
  return (
    <SectionView className="flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite] text-distac-primary" />
      <TextView className="mt-4 text-gray-600">{message}</TextView>
    </SectionView>
  )
}
