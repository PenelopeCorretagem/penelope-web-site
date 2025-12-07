import { useRouter } from '@routes/useRouterViewModel'
import { SectionView } from '@shared/components/layout/Section/SectionView'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { TextView } from '@shared/components/ui/Text/TextView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { ErrorDisplayView } from '@shared/components/feedback/ErrorDisplay/ErrorDisplayView'

/**
 * UnauthorizedView - Página de erro 401
 *
 * Componente simples que não precisa de ViewModel pois:
 * - Não tem lógica de negócio
 * - Não tem estado complexo
 * - Apenas renderiza UI e chama navegação básica
 */
export function UnauthorizedView() {
  const { navigateTo, getAllRoutes } = useRouter()
  const routes = getAllRoutes()

  return (
    <SectionView className="flex-col items-center justify-center min-h-[60vh] text-center">
      <HeadingView level={1} className="text-distac-primary mb-4">
        401 - Acesso Não Autorizado
      </HeadingView>

      <ErrorDisplayView
        messages={['Você não tem permissão para acessar esta página.']}
        position="inline"
        variant="prominent"
        className="mb-6"
      />

      <TextView className="mb-8 text-gray-600 max-w-md">
        Para acessar esta área, você precisa ter as permissões adequadas.
        Entre em contato com o administrador se achar que isso é um erro.
      </TextView>

      <ButtonView onClick={() => navigateTo(routes.HOME)} variant="primary">
        Ir para Home
      </ButtonView>
    </SectionView>
  )
}
