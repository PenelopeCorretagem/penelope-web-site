import { ESTATE_TYPES } from '@constant/estateTypes'

/**
 * Configurações globais para categorias de PropertyCardModel
 */
export const REAL_STATE_CARD_CATEGORIES = {
  [ESTATE_TYPES.LANCAMENTO.key]: {
    label: 'Lançamento',
    variant: 'pink',
    priority: 1
  },
  [ESTATE_TYPES.DISPONIVEL.key]: {
    label: 'Disponível',
    variant: 'brown',
    priority: 2
  },
  [ESTATE_TYPES.EM_OBRAS.key]: {
    label: 'Em Obras',
    variant: 'softBrown',
    priority: 3
  }
}
