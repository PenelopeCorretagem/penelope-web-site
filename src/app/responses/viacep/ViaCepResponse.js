export const handleViaCepError = (error, context = '') => {
  if (error.response) {
    const { status, data } = error.response
    const backendMessage = data?.message || (typeof data === 'string' ? data : '')

    switch (status) {
      case 400:
        return new Error('Formato de CEP inválido.')

      case 404:
        return new Error('CEP não encontrado.')

      default:
        return new Error(
          backendMessage ||
            `Erro ao consultar CEP${
              context ? ` (${context})` : ''
            }. Tente novamente.`
        )
    }
  } else if (error.request) {
    if (error.code === 'ECONNABORTED') {
      return new Error('Tempo limite esgotado. Verifique sua conexão.')
    }
    return new Error(
      'Sem conexão com o servidor. Verifique sua internet e tente novamente. Caso o erro persista, contate o suporte.'
    )
  }

  return new Error(
    error.message || 'Erro inesperado na consulta de CEP.'
  )
}
