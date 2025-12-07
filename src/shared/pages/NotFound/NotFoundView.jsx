import { useNavigate } from 'react-router-dom'
import { SectionView } from '@shared/components/layout/Section/SectionView'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { TextView } from '@shared/components/ui/Text/TextView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { ErrorDisplayView } from '@shared/components/feedback/ErrorDisplay/ErrorDisplayView'

/**
 * NotFoundView - Página de erro 404
 *
 * Componente simples que não precisa de ViewModel pois:
 * - Não tem lógica de negócio
 * - Não tem estado complexo
 * - Apenas renderiza UI e chama navegação básica
 */
export function NotFoundView() {
  const navigate = useNavigate()

  return (
    <SectionView className="flex-col items-center justify-center min-h-[60vh] text-center">
      <HeadingView level={1} className="text-distac-primary mb-4">
        404 - Página Não Encontrada
      </HeadingView>

      <ErrorDisplayView
        messages={['A página que você está procurando não existe.']}
        position="inline"
        variant="prominent"
        className="mb-6"
      />

      <TextView className="mb-8 text-gray-600 max-w-md">
        Desculpe, mas a página que você tentou acessar não está disponível.
        Você pode voltar à página anterior ou ir para a página inicial.
      </TextView>

      <ButtonView onClick={() => navigate(-1)} variant="primary">
        Voltar
      </ButtonView>
    </SectionView>
  )
}
