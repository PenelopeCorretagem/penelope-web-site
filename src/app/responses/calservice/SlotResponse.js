export const handleSlotError = (error, context = '') => {
  if (error.response) {
    const { status, data } = error.response
    const backendMessage = data?.message || (typeof data === 'string' ? data : '')

    switch (status) {
      case 400:
        return new Error(backendMessage || 'Dados inválidos para consulta de horários.')
      case 403:
        return new Error('Sem permissão para consultar horários.')
      case 404:
        return new Error('Nenhum horário encontrado para a data selecionada.')
      default:
        return new Error(backendMessage || `Erro ao consultar horários (${context}).`)
    }
  }

  if (error.request)
    return new Error('Sem conexão com o servidor. Verifique sua internet.')

  return new Error(error.message || 'Erro inesperado ao consultar horários.')
}
