export const handleContactUsError = (error, context = '') => {
  if (error.response) {
    const { status, data } = error.response
    const backendMessage = data?.message || (typeof data === 'string' ? data : '')

    switch (status) {
      case 400:
        return new Error(
          backendMessage
            ? `Erro(s) ao enviar mensagem(ns): ${backendMessage}`
            : 'Por favor, preencha todos os campos corretamente para enviar sua(s) mensagem(ns).'
        )

      default:
        return new Error(
          backendMessage ||
            'Ocorreu(ram) erro(s) ao enviar sua(s) mensagem(ns). Tente novamente mais tarde.'
        )
    }
  } else if (error.request) {
    return new Error(
      'Falha(s) de conexão. Não foi possível enviar sua(s) mensagem(ns) agora. Verifique sua internet e tente novamente. Caso o(s) erro(s) persista(m), contate o suporte.'
    )
  }

  return new Error(
    error.message || 'Erro(s) inesperado(s) no contato.'
  )
}
