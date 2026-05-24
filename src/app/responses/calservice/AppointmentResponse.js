export const handleAppointmentError = (error, context = '') => {
  if (error.response) {
    const { status, data } = error.response
    const backendMessage = data?.message || (typeof data === 'string' ? data : '')

    switch (status) {
      case 404:
        return new Error(
          'Agendamento(s) não encontrado(s). Pode(m) ter sido cancelado(s) ou removido(s).'
        )

      case 400:
        return new Error(
          backendMessage
            ? `Erro no(s) agendamento(s): ${backendMessage}`
            : 'Verifique o(s) dado(s) do(s) agendamento(s) informado(s).'
        )

      case 409:
        return new Error(
          backendMessage ||
            'Conflito(s) de horário(s). Este(s) período(s) já está(ão) reservado(s).'
        )

      case 403:
        return new Error(
          'Você não tem permissão para alterar este(s) agendamento(s).'
        )

      default:
        return new Error(
          backendMessage ||
            `Erro no(s) agendamento(s)${
              context ? ` (${context})` : ''
            }. Tente novamente.`
        )
    }
  } else if (error.request) {
    return new Error(
      'Falha(s) na comunicação com o sistema de agendamento(s). Verifique sua internet e tente novamente. Caso o(s) erro(s) persista(m), contate o suporte.'
    )
  }

  return new Error(
    error.message || 'Erro(s) inesperado(s) no(s) agendamento(s).'
  )
}
