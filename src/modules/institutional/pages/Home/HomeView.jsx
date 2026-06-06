import { SectionView } from '@shared/components/layout/Section/SectionView'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { TextView } from '@shared/components/ui/Text/TextView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { AlertView } from '@shared/components/feedback/Alert/AlertView'
import { SkeletonView } from '@shared/components/ui/Skeleton/SkeletonView'
import { AdvertisementCardView } from '@shared/components/features/AdvertisementCard/AdvertisementCardView'
import { ImageView } from '@shared/components/ui/Image/ImageView'
import LogoCury from '@institutional/assets/logo-cury.jpg'
import { AdvertisementsCarouselView } from '@shared/components/features/AdvertisementsCarousel/AdvertisementsCarouselView'
import { SearchFilterView } from '@shared/components/ui/SearchFilter/SearchFilterView'

import { useHomeViewModel } from './useHomeViewModel'
import { useMinLoadingTime } from '@shared/hooks/useMinLoadingTime';

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
  const isMinLoading = useMinLoadingTime(isLoading);

  // Loading state
  if (isMinLoading) {
    return (
      <>
        <div className='flex flex-col items-center bg-default-light-alt'>
          <SectionView className='!p-0 w-full'>
            <SkeletonView className="w-full h-[600px] rounded-none" />
          </SectionView>
        </div>
        <SectionView className="bg-default-light w-full">
          <SkeletonView className="h-8 w-64 mb-6" />
          <div className="flex gap-4 overflow-hidden w-full">
            <SkeletonView className="h-[400px] min-w-[300px] flex-1" />
            <SkeletonView className="h-[400px] min-w-[300px] flex-1 hidden md:block" />
            <SkeletonView className="h-[400px] min-w-[300px] flex-1 hidden lg:block" />
          </div>
        </SectionView>
      </>
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
