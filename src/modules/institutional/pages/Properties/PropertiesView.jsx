import { useState, useEffect } from 'react'
import { SectionView } from '@shared/components/layout/Section/SectionView'
import { PropertiesCarouselView } from '@domains/property/PropertiesCarousel/PropertiesCarouselView'
import { SearchFilterView } from '@shared/components/ui/SearchFilter/SearchFilterView'
import { ResultTitleView } from '@institutional/components/ResultTitle/ResultTitleView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { TextView } from '@shared/components/ui/Text/TextView'
import { usePropertiesViewModel } from './usePropertiesViewModel'

export function PropertiesView() {
  const [headerHeight, setHeaderHeight] = useState(0)

  // Usa dados reais da API
  const {
    lancamentos,
    disponiveis,
    emObras,
    isLoading,
    error,
    appliedFilters,
    pendingFilters,
    totalResults,
    filterOptions,
    updatePendingFilter,
    applyFilters,
    clearFilters,
    refresh
  } = usePropertiesViewModel()

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

  // Prepara opções para o SearchFilterView
  const optionsWithPlaceholders = {
    cities: [
      { label: 'Cidade', value: '' },
      ...filterOptions.cities.map(city => ({ label: city, value: city }))
    ],
    regions: [
      { label: 'Região', value: '' },
      ...filterOptions.regions.map(region => ({ label: region, value: region }))
    ],
    types: [
      { label: 'Estágio da Obra', value: '' },
      ...filterOptions.types
    ],
    bedrooms: [
      { label: 'Dormitórios', value: '' },
      ...filterOptions.bedrooms.map(bedroom => ({ label: bedroom, value: bedroom }))
    ]
  }

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
        <TextView className="text-red-500">Erro ao carregar propriedades: {error}</TextView>
        <ButtonView color="brown" onClick={refresh}>
          Tentar Novamente
        </ButtonView>
      </SectionView>
    )
  }

  return (
    <>
      {/* Filtros fixos */}
      <div
        className="sticky z-40 bg-default-light shadow-md"
        style={{ top: `${headerHeight}px` }}
      >
        <SearchFilterView
          filters={pendingFilters}
          updateFilter={updatePendingFilter}
          handleSearch={() => { /* opcional: acionar busca global */ }}
          onApply={applyFilters}
          options={optionsWithPlaceholders}
        />
      </div>

      {/* Título com resultados */}
      <ResultTitleView
        results={totalResults}
        filters={appliedFilters}
      />

      {/* Seções de propriedades */}
      {lancamentos.length > 0 && (
        <SectionView>
          <PropertiesCarouselView
            properties={lancamentos}
            titleCarousel="Lançamentos"
            showActionButton={false}
          />
        </SectionView>
      )}

      {disponiveis.length > 0 && (
        <SectionView className="bg-default-light-alt">
          <PropertiesCarouselView
            properties={disponiveis}
            titleCarousel="Disponível"
            showActionButton={false}
          />
        </SectionView>
      )}

      {emObras.length > 0 && (
        <SectionView>
          <PropertiesCarouselView
            properties={emObras}
            titleCarousel="Em Obras"
            showActionButton={false}
          />
        </SectionView>
      )}

      {/* Estado sem resultados */}
      {totalResults === 0 && (
        <SectionView className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
          <TextView className="text-center text-default-dark-muted">
            {Object.keys(appliedFilters).length > 0
              ? 'Nenhuma propriedade encontrada com os filtros aplicados.'
              : 'Nenhuma propriedade disponível no momento.'
            }
          </TextView>
          {Object.keys(appliedFilters).length > 0 && (
            <ButtonView color="brown" onClick={clearFilters}>
              Limpar Filtros
            </ButtonView>
          )}
        </SectionView>
      )}
    </>
  )
}
