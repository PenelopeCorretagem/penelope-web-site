export const handleEventTypeError = (error, context = '') => {
  if (error.response) {
    const { status, data } = error.response
    const backendMessage = data?.message || (typeof data === 'string' ? data : '')

    switch (status) {
      case 404:
        return new Error('Tipo(s) de evento(s) não encontrado(s).')

      case 400:
        return new Error(
          backendMessage
            ? `Erro(s) no(s) tipo(s) de evento(s): ${backendMessage}`
            : 'Dado(s) inválido(s) para o(s) tipo(s) de evento(s).'
        )

      default:
        return new Error(
          backendMessage ||
            `Erro(s) ao processar tipo(s) de evento(s)${
              context ? ` (${context})` : ''
            }.`
        )
    }
  } else if (error.request) {
    return new Error(
      'Sem conexão com o sistema de evento(s). Verifique sua internet e tente novamente. Caso o(s) erro(s) persista(m), contate o suporte.'
    )
  }

  return new Error(
    error.message || 'Erro(s) inesperado(s) no(s) tipo(s) de evento(s).'
  )
}
