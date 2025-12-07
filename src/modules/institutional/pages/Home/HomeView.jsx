import { SectionView } from '@shared/components/layout/Section/SectionView'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { TextView } from '@shared/components/ui/Text/TextView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { PropertyCardView } from '@shared/components/ui/PropertyCard/PropertyCardView'
import { ImageView } from '@shared/components/ui/Image/ImageView'
import LogoCury from '@institutional/assets/logo-cury.jpg'
import { PropertiesCarouselView } from '@shared/components/ui/PropertiesCarousel/PropertiesCarouselView'
import { SearchFilterView } from '@shared/components/ui/SearchFilter/SearchFilterView'

import { useHomeViewModel } from './useHomeViewModel'

export function HomeView() {
  const {
    featuredProperty,
    launchProperties,
    isLoading,
    error,
    hasFeaturedProperty,
    hasLaunchProperties,
    refresh
  } = useHomeViewModel()

  // Loading state
  if (isLoading) {
    return (
      <SectionView className="flex items-center justify-center min-h-[50vh]">
        <TextView>Carregando...</TextView>
      </SectionView>
    )
  }

  // Error state
  if (error) {
    return (
      <SectionView className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <TextView className="text-red-500">Erro ao carregar dados: {error}</TextView>
        <ButtonView color="brown" onClick={refresh}>
          Tentar Novamente
        </ButtonView>
      </SectionView>
    )
  }

  return (
    <>
      <div className='flex flex-col items-center  bg-default-light-alt'>
        {/*Destac Announcement Property*/}
        <SectionView className='!p-0'>
          {hasFeaturedProperty ? (
            <PropertyCardView
              realEstateAdvertisement={featuredProperty.realEstateAdvertisement}
              realStateCardMode={featuredProperty.realStateCardMode}
            />
          ) : null}
        </SectionView>

        {/* <div className='flex flex-col items-center gap-subsection md:gap-subsection-md p-card md:p-card-md rounded-sm w-fit shadow bg-default-light relative bottom-6 -mb-6'>
          <HeadingView
            level={4}
            className='text-center mt-section-y md:mt-section-y-md text-distac-secondary'
          >
            Encontre seu imóvel ideal
          </HeadingView>
          <SearchFilterView className="w-fit !bg-default-light !p-0" selectClassName="!bg-default-light-muted" />
        </div> */}
      </div>

      {/*Destac Properties*/}
      <SectionView className="bg-default-light">
        {hasLaunchProperties ? (
          <PropertiesCarouselView
            realEstateAdvertisements={launchProperties}
            titleCarousel="Nossos Lançamentos"
            showActionButton={true}
            actionButtonText="Ver Todos"
            actionRoute="PROPERTIES"
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <HeadingView level={2} className="text-distac-primary mb-4">
              Nossos Lançamentos
            </HeadingView>
            <TextView>Nenhum lançamento disponível no momento</TextView>
          </div>
        )}
      </SectionView>

      {/*Penélope + Cury*/}
      <SectionView className="bg-default-light-alt">
        <div className='flex flex-col items-start justify-center flex-1 gap-subsection md:gap-subsection-md'>
          <HeadingView
            level={2}
            className='text-left'
          >
            Imóveis Com a qualidade Cury -
            <span className='text-distac-primary'> seu sonho começa com uma chave</span>
          </HeadingView>
          <TextView>
            Penélope une o melhor dos dois mundos: a experiência e credibilidade da Cury no mercado imobiliário com um atendimento humanizado, próximo e pensado especialmente para quem está dando os primeiros passos rumo à casa própria.
          </TextView>
          <ButtonView
            variant="brown"
            size="medium"
            width='fit'
            type="link"
            to='/sobre'
          >
            saber mais
          </ButtonView>
        </div>

        <ImageView
          src={LogoCury}
          alt="Imagem da Logo da Cury"
          className="h-auto max-h-72"
        />
      </SectionView>
    </>
  )
}
