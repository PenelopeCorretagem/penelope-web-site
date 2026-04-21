/**
 * Data Transfer Object para resposta bruta da API ViaCEP
 * Representa a estrutura exata retornada pelo servidor ViaCEP
 */
export class ViaCepAddressDTO {
  constructor({
    cep,
    logradouro,
    complemento,
    bairro,
    localidade,
    uf,
    ibge,
    gia,
    ddd,
    siafi,
    erro,
  } = {}) {
    this.cep = cep ?? ''
    this.logradouro = logradouro ?? ''
    this.complemento = complemento ?? ''
    this.bairro = bairro ?? ''
    this.localidade = localidade ?? ''
    this.uf = uf ?? ''
    this.ibge = ibge ?? ''
    this.gia = gia ?? ''
    this.ddd = ddd ?? ''
    this.siafi = siafi ?? ''
    this.erro = erro ?? false
  }
}
