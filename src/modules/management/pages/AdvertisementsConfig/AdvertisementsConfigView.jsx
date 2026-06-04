import { PageManagementView } from '@management/components/PageManegement/PageManegementView'
import { SectionView } from '@shared/components/layout/Section/SectionView'
import { AdvertisementsCarouselView } from '@shared/components/features/AdvertisementsCarousel/AdvertisementsCarouselView'
import { SkeletonView } from '@shared/components/ui/Skeleton/SkeletonView'
import { useAdvertisementsConfigViewModel } from './useAdvertisementsConfigViewModel'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { useHeaderHeight } from '@shared/hooks/useHeaderHeight'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useRouter } from '@app/routes/useRouterViewModel'
import { useCallback, useMemo } from 'react'
import { ADVERTISEMENT_CARD_MODES } from '@constant/advertisementCardModes'
import { AlertView } from '@shared/components/feedback/Alert/AlertView'
import { FilterView } from '@shared/components/ui/Filter/FilterView'
import { ESTATE_TYPES } from '@constant/estateTypes'
import { useMinLoadingTime } from '@shared/hooks/useMinLoadingTime';

export function AdvertisementsConfigView() {
  const navigate = useNavigate()
  const { generateRoute } = useRouter()

  const {
    lancamentos,
    disponiveis,
    emObras,
    loading,
    error,
    sortOrder,
    availableCities,
    isDeleting,
    alertConfig,
    handleCloseAlert,
    handleConfirmDelete,
    handleFiltersChange,
  } = useAdvertisementsConfigViewModel()

  const headerHeight = useHeaderHeight()
  const isMinLoading = useMinLoadingTime(loading);

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

  const getAddAdvertisementHandler = useCallback((advertisementType) => {
    return () => handleAddAdvertisement(advertisementType)
  }, [handleAddAdvertisement])

  if (isMinLoading) {
    return (
      <div style={{ '--header-height': `${headerHeight}px` }}>
        <SectionView className="flex flex-col min-h-[calc(100vh-var(--header-height))] gap-6">
          <SkeletonView className="h-10 w-64" />
          <div className="flex gap-4 mt-4">
            <SkeletonView className="h-12 w-48" />
            <SkeletonView className="h-12 w-48" />
            <SkeletonView className="h-12 w-48" />
          </div>
          <SkeletonView className="h-8 w-40 mt-8 mb-4" />
          <div className="flex gap-4 overflow-hidden">
             <SkeletonView className="h-[300px] min-w-[280px]" />
             <SkeletonView className="h-[300px] min-w-[280px]" />
             <SkeletonView className="h-[300px] min-w-[280px]" />
             <SkeletonView className="h-[300px] min-w-[280px]" />
          </div>
        </SectionView>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ '--header-height': `${headerHeight}px` }}>
        <SectionView className="flex items-center justify-center min-h-[calc(100vh-var(--header-height))]">
          <AlertView
            isVisible={true}
            type="error"
            message={error}
            hasCloseButton={false}
            buttonsLayout="col"
            actions={[
              {
                label: 'Tentar novamente',
                onClick: () => window.location.reload(),
                color: 'distac-primary',
              },
            ]}
          />
        </SectionView>
      </div>
    )
  }

  return (
    <div style={{ '--header-height': `${headerHeight}px` }}>
      <PageManagementView
        iconName="Building2"
        title="Gerenciar Imóveis"
        className="!gap-80"
        headerChildren={(
          <FilterView
            searchPlaceholder="Buscar por título, cidade ou descrição..."
            showSortButtonInPrimaryRow={true}
            filterConfigs={[
              {
                key: 'regionFilter',
                options: regionOptions,
                defaultValue: 'TODAS',
                width: 'fit',
                variant: 'brown',
                shape: 'square',
                isSecondary: true,
              },
              {
                key: 'cityFilter',
                options: cityOptions,
                defaultValue: 'TODAS',
                width: 'fit',
                variant: 'brown',
                shape: 'square',
                isSecondary: true,
              },
              {
                key: 'typeFilter',
                options: typeOptions,
                defaultValue: 'TODOS',
                width: 'fit',
                variant: 'brown',
                shape: 'square',
                isSecondary: true,
              },
              {
                key: 'statusFilter',
                options: statusOptions,
                defaultValue: 'TODOS',
                width: 'fit',
                variant: 'brown',
                shape: 'square',
              },
            ]}
            defaultFilters={{
              regionFilter: 'TODAS',
              cityFilter: 'TODAS',
              typeFilter: 'TODOS',
              statusFilter: 'TODOS'
            }}
            defaultSortOrder={sortOrder}
            onFiltersChange={handleFiltersChange}
            showResetButton={true}
            showSortButton={true}
            hideSearch={false}
          />
        )}
      >

        {/* Advertisements Content */}
        <div className="flex flex-col gap-subsection md:gap-subsection-md h-fit flex-1 overflow-auto -mx-9 md:-mx-11 pr-7 md:pr-9  pl-9 md:pl-11">
          {lancamentos.length > 0 && (
            <AdvertisementsCarouselView
              advertisements={lancamentos}
              advertisementCardMode={ADVERTISEMENT_CARD_MODES.CONFIG}
              titleCarousel="Lançamentos"
              actionButtonText="Adicionar Imóvel"
              onActionClick={getAddAdvertisementHandler(ESTATE_TYPES.LANCAMENTO.apiValue)}
            />
          )}

          {disponiveis.length > 0 && (
            <AdvertisementsCarouselView
              advertisements={disponiveis}
              advertisementCardMode={ADVERTISEMENT_CARD_MODES.CONFIG}
              titleCarousel="Disponíveis"
              actionButtonText="Adicionar Imóvel"
              onActionClick={getAddAdvertisementHandler(ESTATE_TYPES.DISPONIVEL.apiValue)}
            />
          )}

          {emObras.length > 0 && (
            <AdvertisementsCarouselView
              advertisements={emObras}
              advertisementCardMode={ADVERTISEMENT_CARD_MODES.CONFIG}
              titleCarousel="Em Obras"
              actionButtonText="Adicionar Imóvel"
              onActionClick={getAddAdvertisementHandler(ESTATE_TYPES.EM_OBRAS.apiValue)}
            />
          )}

          {lancamentos.length === 0 && disponiveis.length === 0 && emObras.length === 0 && (
            <div className="flex flex-col items-center justify-center text-default-dark-muted py-8 gap-4">
              <p>Nenhum imóvel encontrado com os filtros aplicados.</p>
              <ButtonView
                type="button"
                color="pink"
                onClick={() => handleAddAdvertisement()}
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
      </PageManagementView>
    </div>
  )
}
