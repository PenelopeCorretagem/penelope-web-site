import { SectionView } from '@shared/components/layout/Section/SectionView'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { TextView } from '@shared/components/ui/Text/TextView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { AdvertisementCardView } from '@shared/components/ui/AdvertisementCard/AdvertisementCardView'
import { ImageView } from '@shared/components/ui/Image/ImageView'
import LogoCury from '@institutional/assets/logo-cury.jpg'
import { AdvertisementsCarouselView } from '@shared/components/ui/AdvertisementsCarousel/AdvertisementsCarouselView'
import { SearchFilterView } from '@shared/components/ui/SearchFilter/SearchFilterView'

import { useHomeViewModel } from './useHomeViewModel'

export function HomeView() {
  const {
    featuredAdvertisement,
    launchAdvertisements,
    isLoading,
    error,
    hasFeaturedAdvertisement,
    hasLaunchAdvertisements,
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
        {/*Destac Announcement Advertisement*/}
        <SectionView className='!p-0'>
          {hasFeaturedAdvertisement ? (
            <AdvertisementCardView
              advertisement={featuredAdvertisement.advertisement}
              advertisementCardMode={featuredAdvertisement.advertisementCardMode}
            />
          ) : null}
        </SectionView>
      </div>

      {/*Destac Advertisements*/}
      <SectionView className="bg-default-light">
        {hasLaunchAdvertisements ? (
          <AdvertisementsCarouselView
            advertisements={launchAdvertisements}
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
      <SectionView className="bg-default-light-alt !flex-col md:!flex-row">
        <div className='flex flex-col items-center md:items-start justify-center flex-1 gap-subsection md:gap-subsection-md'>
          <HeadingView
            level={2}
            className='text-center md:text-left max-md:!w-full'
          >
            Imóveis Com a qualidade Cury -
            <span className='text-distac-primary'> seu sonho começa com uma chave</span>
          </HeadingView>
          <TextView className="text-center md:text-left">
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
