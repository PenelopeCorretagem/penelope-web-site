export const EPropertyCardCategory = Object.freeze({
  LANCAMENTO: 'LANÇAMENTO',
  DISPONIVEL: 'CONCLUÍDOS',
  EM_OBRAS: 'EM OBRAS',
})

export const PropertyCardCategoryConfig = Object.freeze({
  [EPropertyCardCategory.LANCAMENTO]: {
    label: 'Lançamento',
    variant: 'pink',
    priority: 1
  },
  [EPropertyCardCategory.DISPONIVEL]: {
    label: 'Concluído',
    variant: 'brown',
    priority: 2
  },
  [EPropertyCardCategory.EM_OBRAS]: {
    label: 'Em Obras',
    variant: 'softBrown',
    priority: 3
  }
})
