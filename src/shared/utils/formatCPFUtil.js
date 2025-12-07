/**
 * Formata um CPF brasileiro.
 * @param {string} cpf - CPF sem formatação.
 * @returns {string} CPF formatado no padrão XXX.XXX.XXX-XX.
 * @example
 * formatCPF("12345678909"); // "123.456.789-09"
 */
export function formatCPF(cpf) {
  if (!cpf) return ''

  // Remove tudo que não é número
  const cleanCpf = cpf.replace(/\D/g, '')

  // Se tem 11 dígitos (CPF completo)
  if (cleanCpf.length === 11) {
    return cleanCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  // Para números incompletos, formata o que conseguir
  if (cleanCpf.length >= 9) {
    return cleanCpf.replace(/(\d{3})(\d{3})(\d{3})(\d*)/, '$1.$2.$3-$4').replace(/-$/, '')
  }

  if (cleanCpf.length >= 6) {
    return cleanCpf.replace(/(\d{3})(\d{3})(\d*)/, '$1.$2.$3').replace(/\.$/, '')
  }

  if (cleanCpf.length >= 3) {
    return cleanCpf.replace(/(\d{3})(\d*)/, '$1.$2').replace(/\.$/, '')
  }

  return cleanCpf
}

/**
 * Remove a formatação do CPF, retornando apenas números.
 * @param {string} cpf - CPF formatado.
 * @returns {string} Apenas os números do CPF.
 * @example
 * cleanCPF("123.456.789-09"); // "12345678909"
 */
export function cleanCPF(cpf) {
  if (!cpf) return ''
  return cpf.replace(/\D/g, '')
}
