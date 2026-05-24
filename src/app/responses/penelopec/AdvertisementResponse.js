export const handleAdvertisementError = (error, context = '') => {
  if (error.response) {
    const { status, data } = error.response
    const backendMessage = data?.message || (typeof data === 'string' ? data : '')

    switch (status) {
      case 404:
        return new Error('Anúncio(s) não encontrado(s). Pode(m) ter sido removido(s) ou o(s) ID(s) está(ão) incorreto(s).')
      case 400:
        return new Error(
          backendMessage
            ? `Dado(s) do(s) anúncio(s) inválido(s): ${backendMessage}`
            : 'Por favor, preencha todos os campos obrigatórios do(s) anúncio(s) corretamente.'
        )
      case 403:
        return new Error('Acesso negado para alterar este(s) anúncio(s).')
      default:
        return new Error(
          backendMessage ||
            `Ocorreu um erro com o(s) anúncio(s)${
              context ? ` (${context})` : ''
            }. Tente novamente.`
        )
    }
  } else if (error.request) {
    return new Error('Falha(s) de conexão. Não foi possível carregar o(s) dado(s) do(s) anúncio(s).')
  }

  return new Error('Erro(s) inesperado(s) na(s) operação(ões) do(s) anúncio(s).')
}
