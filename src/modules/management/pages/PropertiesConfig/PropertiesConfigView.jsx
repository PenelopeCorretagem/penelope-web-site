import { SectionView } from '@shared/components/layout/Section/SectionView'
import { PropertiesCarouselView } from '@domains/property/PropertiesCarousel/PropertiesCarouselView'
import { usePropertiesConfigViewModel } from './usePropertiesConfigViewModel'

export function PropertiesConfigView() {
  const {
    lancamentos,
    disponiveis,
    emObras,
    loading,
    error,
    handleEdit,
    handleDelete
  } = usePropertiesConfigViewModel()

  if (loading) {
    return <SectionView className="flex items-center justify-center">Carregando...</SectionView>
  }

  if (error) {
    return <SectionView className="flex items-center justify-center text-red-500">{error}</SectionView>
  }

  return (
    <SectionView className="flex flex-col">
      <PropertiesCarouselView
        properties={lancamentos}
        titleCarousel="Lançamentos"
        supportMode={true}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <PropertiesCarouselView
        properties={disponiveis}
        titleCarousel="Disponíveis"
        supportMode={true}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <PropertiesCarouselView
        properties={emObras}
        titleCarousel="Em Obras"
        supportMode={true}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </SectionView>
  )
}
