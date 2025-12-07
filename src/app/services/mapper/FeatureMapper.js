import { Feature } from '@entity/Feature'

/**
 * FeatureMapper
 * ---
 * Classe responsável por mapear dados da API de amenities para entidades Feature
 * e entidades Feature para dados da API.
 */
export class FeatureMapper {
  /**
   * Converte dados da API para uma instância de Feature
   * @param {Object} data Dados brutos da API
   * @returns {Feature|null}
   */
  static toEntity(data) {
    if (!data) return null

    return new Feature({
      id: data.id,
      description: data.description,
    })
  }

  /**
   * Converte uma lista de dados da API para entidades Feature
   * @param {Array} dataList Lista de dados da API
   * @returns {Array<Feature>}
   */
  static toEntityList(dataList) {
    if (!Array.isArray(dataList)) return []
    return dataList.map(data => FeatureMapper.toEntity(data))
  }

  /**
   * Converte uma instância de Feature para o formato da API
   * @param {Feature} feature
   * @returns {Object|null}
   */
  static toApiData(feature) {
    if (!feature) return null

    return {
      id: feature.id,
      description: feature.description,
    }
  }
}
