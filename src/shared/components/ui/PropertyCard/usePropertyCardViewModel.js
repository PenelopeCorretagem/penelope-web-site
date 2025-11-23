import { PropertyCardModel } from './PropertyCardModel'
import { REAL_STATE_CARD_MODES } from '@constant/realStateCardModes'

export function usePropertyCardViewModel(realEstateAdvertisement, realStateCardMode) {
  const propertyCardModel = new PropertyCardModel({ realEstateAdvertisement, realStateCardMode })

  const realStateCardCategoryLabelPosition = () => {
    return propertyCardModel.realStateCardCoverImageUrl != null
      ? 'absolute top-0 -translate-y-1/2 left-[1.5rem]'
      : ''
  }

  return {
    realStateCardCategory: propertyCardModel.realStateCardCategory,
    realStateCardCategoryLabelPosition: realStateCardCategoryLabelPosition,
    realStateCardMode : propertyCardModel.realStateCardMode,
    realStateCardButtons: propertyCardModel.realStateCardButtons,
    realStateCardDifferences: propertyCardModel.realStateCardDifferences,
    realStateCardCoverImageUrl: propertyCardModel.realStateCardCoverImageUrl,
    realStateCardTitle: propertyCardModel.realStateCardTitle,
    realStateCardSubtitle: propertyCardModel.realStateCardSubtitle,
    realStateCardDescription: propertyCardModel.realStateCardDescription,
    shouldRenderRealStateCardCategoryLabel: propertyCardModel.shouldRenderRealStateCardCategoryLabel,
    shouldRenderRealStateCardCoverImage: propertyCardModel.shouldRenderRealStateCardCoverImage,
    shouldRenderRealStateCardDifferences: propertyCardModel.shouldRenderRealStateCardDifferences,
    isConfigMode: propertyCardModel.realStateCardMode === REAL_STATE_CARD_MODES.CONFIG,
    isMoreDetailsMode: propertyCardModel.realStateCardMode === REAL_STATE_CARD_MODES.MORE_DETAILS,
    isRedirectionMode: propertyCardModel.realStateCardMode === REAL_STATE_CARD_MODES.REDIRECTION,
    isMinimalistMode: propertyCardModel.realStateCardMode === REAL_STATE_CARD_MODES.MINIMALIST,
    isDefaultMode: propertyCardModel.realStateCardMode === REAL_STATE_CARD_MODES.DEFAULT
  }
}
