import { Amenity } from '@dtos/Amenity'

export class AmenityMapper {
  static toEntity(data) {
    if (!data) return null

    return new Amenity({
      id: data.id,
      description: data.description,
      icon: data.icon,
    })
  }

  static toEntityList(dataList) {
    if (!Array.isArray(dataList)) return []
    return dataList.map(data => AmenityMapper.toEntity(data))
  }

  static toPaginatedEntityList(paginatedData) {
    if (!paginatedData) return { content: [], pageable: null }

    const content = paginatedData.content || paginatedData.amenities || []
    const pageable = paginatedData.pageable ?? {
      pageNumber: paginatedData.page ?? 0,
      pageSize: paginatedData.pageSize ?? 10,
      totalElements: paginatedData.totalElements ?? 0,
      totalPages: paginatedData.totalPages ?? 0,
    }

    return {
      content: AmenityMapper.toEntityList(content),
      pageable,
    }
  }
}
