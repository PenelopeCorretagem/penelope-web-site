import { useState, useEffect } from 'react'
import { SectionView } from '@shared/components/layout/Section/SectionView'
import { PropertiesCarouselView } from '@shared/components/ui/PropertiesCarousel/PropertiesCarouselView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { TextView } from '@shared/components/ui/Text/TextView'
import { usePropertiesViewModel } from './usePropertiesViewModel'
import { FilterView } from '@shared/components/layout/Filter/FilterView'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'

export const PropertiesView = () => {
  const [headerHeight, setHeaderHeight] = useState(0)

  const {
    isLoading,
    error,
    lancamentos,
    disponiveis,
    emObras,
    totalResults,
    filterConfigs,
    defaultFilters,
    handleFiltersChange,
    refresh
  } = usePropertiesViewModel({
    onError: (error) => console.error('Error loading properties:', error)
  })

  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.querySelector('header')
      if (header) {
        setHeaderHeight(header.offsetHeight - 1)
      }
    }

    updateHeaderHeight()
    window.addEventListener('resize', updateHeaderHeight)
    return () => window.removeEventListener('resize', updateHeaderHeight)
  }, [])

  // Loading state
  if (isLoading) {
    return (
      <SectionView className="flex items-center justify-center min-h-[50vh]">
        <TextView>Carregando propriedades...</TextView>
      </SectionView>
    )
  }

  // Error state
  if (error) {
    return (
      <SectionView className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <TextView className="text-red-500">Erro: {error}</TextView>
        <ButtonView color="brown" onClick={refresh}>
          Tentar Novamente
        </ButtonView>
      </SectionView>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Filtros fixos */}

      <FilterView
        className={`sticky top-[${headerHeight}px] z-10 bg-default-light-alt p-filter md:p-filter-md`}
        searchPlaceholder="Buscar por título, cidade ou descrição..."
        filterConfigs={filterConfigs}
        defaultFilters={defaultFilters}
        onFiltersChange={handleFiltersChange}
      />


      {/* Título com resultados */}
      <SectionView className="!pb-0">
        <HeadingView level={3}>
          {totalResults} {totalResults === 1 ? 'propriedade encontrada' : 'propriedades encontradas'}
        </HeadingView>
      </SectionView>

      {/* Seções de propriedades */}
      {lancamentos.length > 0 && (
        <SectionView>
          <div className="container mx-auto">
            <PropertiesCarouselView
              realEstateAdvertisements={lancamentos}
              titleCarousel="Lançamentos"
            />
          </div>
        </SectionView>
      )}

      {disponiveis.length > 0 && (
        <SectionView className="bg-gray-100">
          <div className="container mx-auto">
            <PropertiesCarouselView
              realEstateAdvertisements={disponiveis}
              titleCarousel="Disponíveis"
            />
          </div>
        </SectionView>
      )}

      {emObras.length > 0 && (
        <SectionView>
          <div className="container mx-auto">
            <PropertiesCarouselView
              realEstateAdvertisements={emObras}
              titleCarousel="Em Obras"
            />
          </div>
        </SectionView>
      )}

      {/* Estado sem resultados */}
      {totalResults === 0 && (
        <SectionView className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
          <TextView className="text-center text-gray-600">
            Nenhuma propriedade encontrada com os filtros aplicados.
          </TextView>
          <ButtonView color="brown" onClick={refresh}>
            Limpar Filtros
          </ButtonView>
        </SectionView>
      )}
    </div>
  )
}
