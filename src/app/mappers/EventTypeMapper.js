import { EventType } from '@dtos/EventType'

export class EventTypeMapper {
  static toEntity(data) {
    if (!data) return null

    return new EventType({
      id: data.id,
      title: data.title,
      slug: data.slug,
      description: data.description,
      lengthInMinutes: data.lengthInMinutes,
      minimumBookingNotice: data.minimumBookingNotice,
      hidden: data.hidden,
      estateId: data.estateId,
    })
  }

  static toEntityList(dataList) {
    if (!Array.isArray(dataList)) return []
    return dataList.map(data => EventTypeMapper.toEntity(data))
  }

  static toPaginatedEntityList(paginatedData) {
    if (!paginatedData) return { content: [], pageable: {} }
    return {
      content: EventTypeMapper.toEntityList(paginatedData.content || []),
      pageable: paginatedData.pageable || {},
    }
  }
}
