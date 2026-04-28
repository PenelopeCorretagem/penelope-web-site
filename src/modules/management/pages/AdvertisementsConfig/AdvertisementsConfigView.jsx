import { SectionView } from '@shared/components/layout/Section/SectionView'
import { AdvertisementsCarouselView } from '@shared/components/ui/AdvertisementsCarousel/AdvertisementsCarouselView'
import { useAdvertisementsConfigViewModel } from './useAdvertisementsConfigViewModel'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { InputView } from '@shared/components/ui/Input/InputView'
import { useHeaderHeight } from '@shared/hooks/useHeaderHeight'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useRouter } from '@app/routes/useRouterViewModel'
import { useCallback, useMemo } from 'react'
import { ADVERTISEMENT_CARD_MODES } from '@constant/advertisementCardModes'
import { AlertView } from '@shared/components/feedback/Alert/AlertView'
import { FilterView } from '@shared/components/layout/Filter/FilterView'
import { ESTATE_TYPE_KEYS } from '@constant/estateTypes'

export function AdvertisementsConfigView() {
  const navigate = useNavigate()
  const { generateRoute } = useRouter()

  const {
    lancamentos,
    disponiveis,
    emObras,
    loading,
    error,
    searchTerm,
    regionFilter,
    cityFilter,
    typeFilter,
    sortOrder,
    availableCities,
    isDeleting,
    alertConfig,
    handleCloseAlert,
    handleConfirmDelete,
    handleFiltersChange,
    filterModel
  } = useAdvertisementsConfigViewModel()

  const headerHeight = useHeaderHeight()

  const handleAddAdvertisement = useCallback((advertisementType = '') => {
    try {
      const route = generateRoute('ADMIN_PROPERTIES_CONFIG', { id: 'new' })
      navigate(route, {
        state: advertisementType ? { advertisementType } : undefined,
      })
    } catch {
      // Fallback direto
      navigate('/admin/gerenciar-imoveis/new', {
        state: advertisementType ? { advertisementType } : undefined,
      })
    }
  }, [navigate, generateRoute])

  const regionOptions = useMemo(() => [
    { value: 'TODAS', label: 'Todas as Regiões' },
    { value: 'Norte', label: 'Norte' },
    { value: 'Sul', label: 'Sul' },
    { value: 'Leste', label: 'Leste' },
    { value: 'Oeste', label: 'Oeste' },
    { value: 'Centro', label: 'Centro' }
  ], [])

  const cityOptions = useMemo(() => [
    { value: 'TODAS', label: 'Todas as Cidades' },
    ...availableCities.map(city => ({ value: city, label: city }))
  ], [availableCities])

  const typeOptions = useMemo(() => [
    { value: 'TODOS', label: 'Todos os Tipos' },
    { value: 'LANCAMENTOS', label: 'Lançamentos' },
    { value: 'DISPONIVEIS', label: 'Disponíveis' },
    { value: 'EM_OBRAS', label: 'Em Obras' }
  ], [])

  const statusOptions = useMemo(() => [
    { value: 'TODOS', label: 'Todos os Status' },
    { value: 'HABILITADOS', label: 'Habilitados' },
    { value: 'DESABILITADOS', label: 'Desabilitados' }
  ], [])

  const handleClearAllFilters = useCallback(() => {
    handleFiltersChange('searchTerm', '')
    handleFiltersChange('regionFilter', 'TODAS')
    handleFiltersChange('cityFilter', 'TODAS')
    handleFiltersChange('typeFilter', 'TODOS')
    handleFiltersChange('statusFilter', 'TODOS')
    handleFiltersChange('sortOrder', 'none')
  }, [handleFiltersChange])

  const handleSearchInputChange = useCallback((value) => {
    // InputView passes the string value as the first argument
    handleFiltersChange('searchTerm', value ?? '')
  }, [handleFiltersChange])

  const getAddAdvertisementHandler = useCallback((advertisementType) => {
    return () => handleAddAdvertisement(advertisementType)
  }, [handleAddAdvertisement])
  if (loading) {
    return (
      <div style={{ '--header-height': `${headerHeight}px` }}>
        <SectionView className="flex items-center justify-center min-h-[calc(100vh-var(--header-height))]">
          Carregando imóveis...
        </SectionView>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ '--header-height': `${headerHeight}px` }}>
        <SectionView className="flex items-center justify-center text-red-500 min-h-[calc(100vh-var(--header-height))]">
          {error}
        </SectionView>
      </div>
    )
  }

  return (
    <div style={{ '--header-height': `${headerHeight}px` }}>
      <SectionView className="flex flex-col !gap-section-col md:!gap-section-col-md">
        {/* Title and Search Bar - Same Row */}
        <div className="flex flex-col md:flex-row gap-card md:gap-card-md items-end flex-shrink-0">
          <HeadingView level={2} className="text-distac-primary">
            Gerenciar Imóveis
          </HeadingView>
          <div className="flex-1">
            <InputView
              type="text"
              placeholder="Buscar por título, cidade ou descrição..."
              value={searchTerm}
              onChange={handleSearchInputChange}
              hasLabel={false}
              isActive={true}
            />
          </div>
        </div>

        {/* Filters and Buttons - Full Width Row with Justify Between */}
        <div className="flex flex-col md:flex-row gap-card md:gap-card-md items-end flex-shrink-0 md:justify-between">
          {/* Left side: Filters and Sort Button */}
          <div className="flex flex-col md:flex-row gap-card md:gap-card-md items-end">
            <FilterView
              key={`filter-${filterModel.getFilter('regionFilter')}-${filterModel.getFilter('cityFilter')}-${filterModel.getFilter('typeFilter')}-${filterModel.getFilter('statusFilter')}-${sortOrder}`}
              filterConfigs={[
                {
                  key: 'regionFilter',
                  options: regionOptions,
                  width: 'fit',
                  variant: 'brown',
                  shape: 'square',
                },
                {
                  key: 'cityFilter',
                  options: cityOptions,
                  width: 'fit',
                  variant: 'brown',
                  shape: 'square',
                },
                {
                  key: 'typeFilter',
                  options: typeOptions,
                  width: 'fit',
                  variant: 'brown',
                  shape: 'square',
                },
                {
                  key: 'statusFilter',
                  options: statusOptions,
                  width: 'fit',
                  variant: 'brown',
                  shape: 'square',
                },
              ]}
              defaultFilters={{
                regionFilter,
                cityFilter,
                typeFilter,
                statusFilter: filterModel.getFilter('statusFilter') || 'TODOS'
              }}
              defaultSortOrder={sortOrder}
              onFiltersChange={handleFiltersChange}
              showResetButton={false}
              showSortButton={true}
              hideSearch={true}
            />
          </div>

          {/* Right side: Clear Button */}
          <div className="w-full md:w-fit">
            <ButtonView
              type="button"
              width="fit"
              color="soft-gray"
              onClick={handleClearAllFilters}
              shape="square"
              title="Limpar todos os filtros"
              disabled={!filterModel.hasActiveFilters({
                regionFilter: 'TODAS',
                cityFilter: 'TODAS',
                typeFilter: 'TODOS',
                statusFilter: 'TODOS'
              })}
            >
              Limpar
            </ButtonView>
          </div>
        </div>

        {/* Advertisements Content */}
        <div className="flex flex-col gap-subsection md:gap-subsection-md h-fit flex-1">
          {lancamentos.length > 0 && (
            <AdvertisementsCarouselView
              advertisements={lancamentos}
              advertisementCardMode={ADVERTISEMENT_CARD_MODES.CONFIG}
              titleCarousel="Lançamentos"
              actionButtonText="Adicionar Imóvel"
              onActionClick={getAddAdvertisementHandler(ESTATE_TYPE_KEYS.LANCAMENTO)}
            />
          )}

          {disponiveis.length > 0 && (
            <AdvertisementsCarouselView
              advertisements={disponiveis}
              advertisementCardMode={ADVERTISEMENT_CARD_MODES.CONFIG}
              titleCarousel="Disponíveis"
              actionButtonText="Adicionar Imóvel"
              onActionClick={getAddAdvertisementHandler(ESTATE_TYPE_KEYS.DISPONIVEL)}
            />
          )}

          {emObras.length > 0 && (
            <AdvertisementsCarouselView
              advertisements={emObras}
              advertisementCardMode={ADVERTISEMENT_CARD_MODES.CONFIG}
              titleCarousel="Em Obras"
              actionButtonText="Adicionar Imóvel"
              onActionClick={getAddAdvertisementHandler(ESTATE_TYPE_KEYS.EM_OBRAS)}
            />
          )}

          {lancamentos.length === 0 && disponiveis.length === 0 && emObras.length === 0 && (
            <div className="flex flex-col items-center justify-center text-default-dark-muted py-8 gap-4">
              <p>Nenhum imóvel encontrado com os filtros aplicados.</p>
              <ButtonView
                type="button"
                color="pink"
                onClick={handleAddAdvertisement}
                shape="square"
              >
                <Plus size={16} />
                Adicionar Primeiro Imóvel
              </ButtonView>
            </div>
          )}
        </div>

        <AlertView
          isVisible={!!alertConfig}
          type={alertConfig?.type}
          message={alertConfig?.message}
          hasCloseButton={!alertConfig?.isConfirm}
          onClose={handleCloseAlert}
          buttonsLayout="col"
        >
          {alertConfig?.isConfirm && (
            <div className="flex justify-center gap-card md:gap-card-md w-full">
              <ButtonView
                type="button"
                shape="square"
                color="border-distac-primary"
                onClick={handleCloseAlert}
                width="fit"
              >
                Cancelar
              </ButtonView>
              <ButtonView
                type="button"
                shape="square"
                color={alertConfig?.confirmColor || 'pink'}
                onClick={handleConfirmDelete}
                width="fit"
                disabled={isDeleting}
              >
                {alertConfig?.confirmText || 'Confirmar'}
              </ButtonView>
            </div>
          )}
        </AlertView>
      </SectionView>
    </div>
  )
}
