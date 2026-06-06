import { useCallback } from 'react'

/**
 * useErrorHandler.js
 *
 * Hook centralizado para tratamento de erros em toda a aplicação.
 * Fornece um padrão consistente para:
 * - Extrair mensagens amigáveis de erros HTTP
 * - Mapear códigos de status para ações apropriadas
 * - Registrar erros para debug (sem console.error)
 *
 * Uso:
 * const { handleError, formatError } = useErrorHandler()
 * try {
 *   await fetchData()
 * } catch (error) {
 *   const { message, statusCode, details } = handleError(error)
 *   setError(message)
 * }
 */
export function useErrorHandler() {
  /**
   * Extrai informações estruturadas do erro
   * @param {Error|AxiosError} error - O objeto de erro
   * @returns {Object} { statusCode, message, details, isRetryable }
   */
  const handleError = useCallback((error) => {
    // Erro de resposta HTTP (do servidor)
    if (error?.response) {
      const { status, data } = error.response
      const backendMessage = data?.message || (typeof data === 'string' ? data : '')
      const violations = data?.violations || []

      return {
        statusCode: status,
        message: backendMessage || getDefaultMessage(status),
        details: violations.map(v => v.message || v),
        isRetryable: isRetryableStatus(status),
        raw: error,
      }
    }

    // Erro de requisição (sem resposta)
    if (error?.request) {
      return {
        statusCode: 0,
        message: 'Sem conexão com o servidor. Verifique sua internet.',
        details: [],
        isRetryable: true,
        raw: error,
      }
    }

    // Erro genérico/cliente
    return {
      statusCode: -1,
      message: error?.message || 'Erro inesperado',
      details: [],
      isRetryable: false,
      raw: error,
    }
  }, [])

  /**
   * Formata erro para exibição amigável
   * @param {Error|AxiosError} error
   * @param {string} [context] - Contexto da operação (ex: "Listagem")
   * @returns {string} Mensagem formatada
   */
  const formatError = useCallback((error, context = '') => {
    const info = handleError(error)
    const contextMsg = context ? `${context}: ` : ''
    return `${contextMsg}${info.message}`
  }, [handleError])

  /**
   * Log estruturado de erro (sem console.error, apenas para debug internamente)
   * @param {Error|AxiosError} error
   * @param {string} [context]
   * @returns {Object} Estrutura de erro para logging
   */
  const logError = useCallback((error, context = '') => {
    const info = handleError(error)
    return {
      timestamp: new Date().toISOString(),
      context,
      statusCode: info.statusCode,
      message: info.message,
      details: info.details,
      raw: info.raw,
    }
  }, [handleError])

  return {
    handleError,
    formatError,
    logError,
  }
}

/**
 * Retorna mensagem padrão para cada status HTTP
 */
function getDefaultMessage(status) {
  const messages = {
    // 4xx - Erros do cliente
    400: 'Dados inválidos. Verifique os campos obrigatórios.',
    401: 'Sessão expirada. Faça login novamente.',
    403: 'Você não tem permissão para acessar este recurso.',
    404: 'O recurso solicitado não foi encontrado.',
    409: 'Conflito: este recurso pode já existir.',
    422: 'Dados enviados não são válidos.',

    // 5xx - Erros do servidor
    500: 'Erro interno do servidor. Tente novamente mais tarde.',
    502: 'Comunicação com o servidor falhou. Tente novamente.',
    503: 'Servidor em manutenção. Tente novamente mais tarde.',
    504: 'Servidor demorando muito para responder. Tente novamente.',

    // 0 - Sem conexão
    0: 'Erro de conexão. Verifique sua internet.',
  }

  return messages[status] || 'Erro ao processar requisição. Tente novamente.'
}

/**
 * Define quais status codes permitem retry automático
 */
function isRetryableStatus(status) {
  return [0, 408, 429, 500, 502, 503, 504].includes(status)
}
