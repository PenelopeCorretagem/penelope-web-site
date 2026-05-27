export const handleScheduleError = (error, context = '') => {
  if (error.response) {
    const { status, data } = error.response
    const backendMessage = data?.message || (typeof data === 'string' ? data : '')

    switch (status) {
      case 404:
        return new Error('Horários de trabalho não encontrados.')
      case 400:
        return new Error(
          backendMessage || 'Dados inválidos ao buscar horários de trabalho.'
        )
      default:
        return new Error(
          backendMessage || `Erro ao processar horários de trabalho${context ? ` (${context})` : ''}.`
        )
    }
  }

  if (error.request) {
    return new Error('Sem conexão com o servidor de horários. Verifique sua internet.')
  }

  return new Error(error.message || 'Erro inesperado ao buscar horários de trabalho.')
}
