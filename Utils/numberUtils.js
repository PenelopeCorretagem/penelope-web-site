/**
 * Formata um número como moeda brasileira (R$).
 * @param {number} valor - Valor numérico a ser formatado.
 * @returns {string} Valor formatado em reais.
 * @example
 * formatarMoeda(1500); // "R$ 1.500,00"
 * formatarMoeda(12345.67); // "R$ 12.345,67"
 */
export function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
