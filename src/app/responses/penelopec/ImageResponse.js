export const handleImageError = (error, context = '') => {
  if (error.response) {
    const { status, data } = error.response
    const backendMessage = data?.message || (typeof data === 'string' ? data : '')

    switch (status) {
      case 404:
        return new Error('Imagem(ns) não encontrada(s).')

      case 400:
        return new Error(
          backendMessage
            ? `Erro(s) na(s) imagem(ns): ${backendMessage}`
            : 'O(s) formato(s) da(s) imagem(ns) é(são) inválido(s) ou ela(s) excede(m) o tamanho permitido.'
        )

      case 413:
        return new Error(
          'A(s) imagem(ns) é(são) muito grande(s). Escolha arquivo(s) menor(es).'
        )

      case 415:
        return new Error(
          'Formato(s) de arquivo(s) não suportado(s) para imagem(ns).'
        )

      default:
        return new Error(
          backendMessage ||
            `Erro(s) ao processar imagem(ns)${
              context ? ` (${context})` : ''
            }.`
        )
    }
  } else if (error.request) {
    return new Error(
      'Tempo(s) de conexão esgotado(s) ao enviar ou carregar imagem(ns). Verifique sua internet e tente novamente. Caso o(s) erro(s) persista(m), contate o suporte.'
    )
  }

  return new Error(
    error.message || 'Erro(s) inesperado(s) com a(s) imagem(ns).'
  )
}
