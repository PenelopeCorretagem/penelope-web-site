import { useState, useEffect } from 'react'
import { SectionView } from '@shared/components/layout/Section/SectionView'
import { AdvertisementsCarouselView } from '@shared/components/features/AdvertisementsCarousel/AdvertisementsCarouselView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { TextView } from '@shared/components/ui/Text/TextView'
import { AlertView } from '@shared/components/feedback/Alert/AlertView'
import { SkeletonView } from '@shared/components/ui/Skeleton/SkeletonView'
import { useAdvertisementsViewModel } from './useAdvertisementsViewModel'
import { FilterView } from '@shared/components/ui/Filter/FilterView'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { useMinLoadingTime } from '@shared/hooks/useMinLoadingTime';

export const AdvertisementsView = () => {
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
    filterModel,
    handleFiltersChange,
    refresh
  } = useAdvertisementsViewModel({
    onError: (_error) => {
      // Lidar com erro de carregamento
    }
  })

  const isMinLoading = useMinLoadingTime(isLoading);

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
  if (isMinLoading) {
    return (
      <div className="min-h-screen">
        <div className="sticky top-[0px] z-10 bg-default-light-alt p-filter md:p-filter-md">
          <SkeletonView className="h-16 w-full max-w-4xl mx-auto" />
        </div>
        <SectionView className="!pb-0">
          <SkeletonView className="h-8 w-48" />
        </SectionView>
        <SectionView>
          <div className="container mx-auto space-y-6">
            <SkeletonView className="h-8 w-64" />
            <div className="flex gap-4 overflow-hidden">
              <SkeletonView className="h-[400px] min-w-[300px] flex-1" />
              <SkeletonView className="h-[400px] min-w-[300px] flex-1" />
              <SkeletonView className="h-[400px] min-w-[300px] flex-1 hidden md:block" />
            </div>
          </div>
        </SectionView>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <SectionView className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <AlertView
          isVisible={true}
          type="error"
          message={error}
          hasCloseButton={false}
          buttonsLayout="col"
          actions={[
            {
              label: 'Tentar novamente',
              onClick: refresh,
              color: 'distac-primary',
            },
          ]}
        />
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
            <AdvertisementsCarouselView
              advertisements={lancamentos}
              titleCarousel="LANÇAMENTO"
              showActionButton={false}
            />
          </div>
        </SectionView>
      )}

      {disponiveis.length > 0 && (
        <SectionView className={filterModel.getFilter('typeFilter') === 'DISPONIVEIS' ? '' : 'bg-default-light-alt'}>
          <div className="container mx-auto">
            <AdvertisementsCarouselView
              advertisements={disponiveis}
              titleCarousel="DISPONÍVEL"
              showActionButton={false}
            />
          </div>
        </SectionView>
      )}

      {emObras.length > 0 && (
        <SectionView>
          <div className="container mx-auto">
            <AdvertisementsCarouselView
              advertisements={emObras}
              titleCarousel="EM OBRAS"
              showActionButton={false}
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
