import { ESTATE_TYPES } from '@constant/estateTypes'

/**
 * Configurações globais para categorias de AdvertisementCardModel
 */
export const ADVERTISEMENT_CARD_CATEGORIES = {
  [ESTATE_TYPES.LANCAMENTO.key]: {
    label: 'LANÇAMENTO',
    variant: 'pink',
    priority: 1
  },
  [ESTATE_TYPES.DISPONIVEL.key]: {
    label: 'DISPONÍVEL',
    variant: 'brown',
    priority: 2
  },
  [ESTATE_TYPES.EM_OBRAS.key]: {
    label: 'EM OBRAS',
    variant: 'softBrown',
    priority: 3
  }
}
