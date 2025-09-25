// import { CardView } from '../../../shared/view/components/CardView'
import { MenuView } from '../../../shared/view/components/MenuView'

export function HomeView() {
  return (
    <div className='bg-surface-primary'>
      <MenuView isAuthenticated={true} />

      <CardView
        title='Título do Card'
        subtitle='Subtítulo do Card'
        description='Descrição do Card'
        category='Label do Botão'
        differences={['Diferença 1', 'Diferença 2', 'Diferença 3']}
      />
    </div>
  )
}
