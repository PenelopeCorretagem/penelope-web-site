export const handleUserError = (error, context = '') => {
  if (error.response) {
    const { status, data } = error.response
    const backendMessage = data?.message || (typeof data === 'string' ? data : '')

    switch (status) {
      case 404:
        return new Error('Usuário(s) não encontrado(s).')

      case 409:
        return new Error(
          'Este(s) e-mail(s) já está(ão) cadastrado(s) em nossa base.'
        )

      case 400:
        return new Error(
          backendMessage
            ? `Dado(s) inválido(s): ${backendMessage}`
            : 'Verifique o(s) dado(s) do(s) usuário(s) e tente novamente.'
        )

      case 403:
        return new Error(
          'Você não tem permissão para modificar este(s) usuário(s).'
        )

      default:
        return new Error(
          backendMessage ||
            `Erro(s) ao processar usuário(s)${
              context ? ` (${context})` : ''
            }. Tente novamente.`
        )
    }
  } else if (error.request) {
    return new Error(
      'Sem conexão com o servidor. Verifique sua internet e tente novamente. Caso o(s) erro(s) persista(m), contate o suporte.'
    )
  }

  return new Error(
    error.message || 'Erro(s) inesperado(s) na operação(ões) de usuário(s).'
  )
}
