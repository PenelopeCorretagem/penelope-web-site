/**
 * Mapeamento de Unidade Federativa para Região Brasileira
 * Usado pela API ViaCEP para normalizar dados de localização
 */
export const STATE_TO_REGION_MAP = {
  // Norte
  AC: 'Norte',
  AP: 'Norte',
  AM: 'Norte',
  PA: 'Norte',
  RO: 'Norte',
  RR: 'Norte',
  TO: 'Norte',

  // Nordeste
  AL: 'Nordeste',
  BA: 'Nordeste',
  CE: 'Nordeste',
  MA: 'Nordeste',
  PB: 'Nordeste',
  PE: 'Nordeste',
  PI: 'Nordeste',
  RN: 'Nordeste',
  SE: 'Nordeste',

  // Centro-Oeste
  GO: 'Centro-Oeste',
  MT: 'Centro-Oeste',
  MS: 'Centro-Oeste',
  DF: 'Centro-Oeste',

  // Sudeste
  ES: 'Sudeste',
  MG: 'Sudeste',
  RJ: 'Sudeste',
  SP: 'Sudeste',

  // Sul
  PR: 'Sul',
  RS: 'Sul',
  SC: 'Sul',
}

/**
 * Mapeia código de Unidade Federativa para região
 * @param {string} uf - Código da UF (ex: SP, RJ)
 * @returns {string} Nome da região ou string vazia
 */
export function mapStateToRegion(uf) {
  return STATE_TO_REGION_MAP[uf] || ''
}
