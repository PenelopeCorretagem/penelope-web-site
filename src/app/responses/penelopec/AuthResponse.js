export const handleAuthError = (error, context = '') => {
  if (error.response) {
    const { status, data } = error.response
    const backendMessage = data?.message || (typeof data === 'string' ? data : '')

    switch (status) {
      case 401:
        return new Error(
          'Não autorizado(s). Verifique sua(s) credencial(is).'
        )

      case 403:
        return new Error(
          'Acesso(s) negado(s). E-mail(s) ou senha(s) incorreto(s).'
        )

      case 404:
        return new Error('Usuário(s) não encontrado(s).')

      case 400:
        return new Error(
          backendMessage
            ? `Dado(s) inválido(s): ${backendMessage}`
            : 'Dado(s) fornecido(s) são inválido(s).'
        )

      default:
        return new Error(
          backendMessage ||
            `Erro(s) de autenticação${
              context ? ` em ${context}` : ''
            }. Tente novamente.`
        )
    }
  } else if (error.request) {
    return new Error(
      'Sem conexão com o servidor. Verifique sua internet e tente novamente. Caso o(s) erro(s) persista(m), contate o suporte.'
    )
  }

  return new Error(
    error.message || 'Erro(s) inesperado(s) na autenticação.'
  )
}
