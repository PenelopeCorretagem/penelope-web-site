import { ESTATE_TYPES } from '@constant/estateType'

/**
 * Configurações globais para categorias de PropertyCardModel
 */
export const REAL_STATE_CARD_CATEGORIES = {
  [ESTATE_TYPES.LANCAMENTO]: {
    label: 'Lançamento',
    variant: 'pink',
    priority: 1
  },
  [ESTATE_TYPES.DISPONIVEL]: {
    label: 'Concluído',
    variant: 'brown',
    priority: 2
  },
  [ESTATE_TYPES.EM_OBRAS]: {
    label: 'Em Obras',
    variant: 'softBrown',
    priority: 3
  }
}
