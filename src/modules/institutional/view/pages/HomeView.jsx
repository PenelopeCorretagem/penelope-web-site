import { CardView } from '@shared/view/components/CardView'

export function HomeView() {
  return (
    <>
      <CardView
        title='Título do Card'
        subtitle='Subtítulo do Card'
        description='Descrição do Card'
        category='Label do Botão'
        differences={['Diferença 1', 'Diferença 2', 'Diferença 3']}
      />
    </>
  )
}
