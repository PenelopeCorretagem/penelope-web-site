import * as appointmentApi from '@api-calservice/appointmentApi'
import { AppointmentMapper } from '@mappers/AppointmentMapper'
import { Appointment } from '@dtos/Appointment'
import { authSessionUtil } from '@utils/authSession/authSessionUtil'
import { ACCESS_LEVEL } from '@constant/accessLevels'
import { handleAppointmentError } from '@responses/calservice/AppointmentResponse'

/**
 * getAllAppointments — endpoint genérico de listagem
 * @deprecated Use getAppointmentsReport() para relatório com dados enriquecidos
 */
export const getAllAppointments = async (filters = {}) => {
  // Leitura dentro da função — sempre reflete a sessão atual
  const { role, userId } = authSessionUtil.get()

  const normalizedFilters = { ...filters }

  if (role === ACCESS_LEVEL.CLIENTE) {
    if (!userId)
      throw new Error('Não foi possível identificar o cliente autenticado para listar os agendamentos')
    normalizedFilters.clientId = userId
  }

  const params = new URLSearchParams()
  if (normalizedFilters.clientId)      params.append('clientId', normalizedFilters.clientId)
  if (normalizedFilters.estateAgentId) params.append('estateAgentId', normalizedFilters.estateAgentId)
  if (normalizedFilters.estateId)      params.append('estateId', normalizedFilters.estateId)
  if (normalizedFilters.status)        params.append('status', normalizedFilters.status)
  if (normalizedFilters.startDateTime) params.append('startDateTime', normalizedFilters.startDateTime)
  if (normalizedFilters.endDateTime)   params.append('endDateTime', normalizedFilters.endDateTime)
  if (normalizedFilters.page !== undefined) params.append('page', normalizedFilters.page)
  if (normalizedFilters.size !== undefined) params.append('size', normalizedFilters.size)

  try {
    const response = await appointmentApi.getAllAppointments(params)
    const rawList = response?.content || response?.appointments || response || []
    return AppointmentMapper.toEntityList(rawList)
  } catch (error) {
    throw handleAppointmentError(error, 'Listagem')
  }
}

export const getAppointmentById = async (id) => {
  if (!id)
    throw new Error('O ID é obrigatório para buscar um agendamento')

  try {
    const response = await appointmentApi.getAppointmentById(id)
    return AppointmentMapper.toEntity(response)
  } catch (error) {
    throw handleAppointmentError(error, 'Busca')
  }
}

export const createAppointment = async (appointmentData) => {
  if (!appointmentData)
    throw new Error('Os dados do agendamento são obrigatórios')
  if (!appointmentData.startDateTime)
    throw new Error('A data/hora de início é obrigatória')
  if (!appointmentData.attendeeName)
    throw new Error('O nome do participante é obrigatório')
  if (!appointmentData.attendeeEmail)
    throw new Error('O e-mail do participante é obrigatório')

  try {
    const payload = appointmentData instanceof Appointment
      ? appointmentData.toCreatePayload()
      : appointmentData

    const response = await appointmentApi.createAppointment(payload)
    return AppointmentMapper.toEntity(response)
  } catch (error) {
    throw handleAppointmentError(error, 'Criação')
  }
}

export const rescheduleAppointment = async (id, rescheduleData) => {
  if (!id)
    throw new Error('O ID é obrigatório para reagendar um agendamento')
  if (!rescheduleData?.startDateTime)
    throw new Error('A nova data/hora de início é obrigatória para reagendar')
  if (!rescheduleData?.reason)
    throw new Error('O motivo do reagendamento é obrigatório')

  try {
    const response = await appointmentApi.rescheduleAppointment(id, rescheduleData)
    return AppointmentMapper.toEntity(response)
  } catch (error) {
    throw handleAppointmentError(error, 'Reagendamento')
  }
}

export const confirmAppointment = async (id) => {
  if (!id)
    throw new Error('O ID é obrigatório para confirmar um agendamento')

  try {
    const response = await appointmentApi.confirmAppointment(id)
    return AppointmentMapper.toEntity(response)
  } catch (error) {
    throw handleAppointmentError(error, 'Confirmação')
  }
}

export const concludeAppointment = async (id) => {
  if (!id)
    throw new Error('O ID é obrigatório para concluir um agendamento')

  try {
    const response = await appointmentApi.concludeAppointment(id)
    return AppointmentMapper.toEntity(response)
  } catch (error) {
    throw handleAppointmentError(error, 'Conclusão')
  }
}

export const cancelAppointment = async (id, reason = null) => {
  if (!id)
    throw new Error('O ID é obrigatório para cancelar um agendamento')

  try {
    const response = await appointmentApi.cancelAppointment(id, reason)
    return AppointmentMapper.toEntity(response)
  } catch (error) {
    throw handleAppointmentError(error, 'Cancelamento')
  }
}

export const deleteAppointment = async (id) => {
  if (!id)
    throw new Error('O ID é obrigatório para deletar um agendamento')

  try {
    await appointmentApi.deleteAppointment(id)
  } catch (error) {
    throw handleAppointmentError(error, 'Exclusão')
  }
}

export const exportAppointments = async (filters = {}, format = 'xlsx') => {
  const params = new URLSearchParams()

  if (filters.estateAgentId) params.append('idCorretor', filters.estateAgentId)
  if (filters.periodoInicio) params.append('periodoInicio', filters.periodoInicio)
  if (filters.periodoFim) params.append('periodoFim', filters.periodoFim)
  if (format) params.append('format', format)

  try {
    return await appointmentApi.exportAppointments(params)
  } catch (error) {
    throw handleAppointmentError(error, 'Exportação')
  }
}

/**
 * getAppointmentsReport — endpoint específico para relatórios com dados enriquecidos
 * Retorna agendamentos completos com informações de cliente, corretor, imóvel e tipo de imóvel
 * O backend controla o escopo de acesso por perfil do usuário
 */
export const getAppointmentsReport = async (filters = {}) => {
  const { role, userId } = authSessionUtil.get()

  const normalizedFilters = { ...filters }

  if (role === ACCESS_LEVEL.CLIENTE) {
    if (!userId)
      throw new Error('Não foi possível identificar o cliente autenticado para gerar o relatório')
    normalizedFilters.clientId = userId
  }

  const params = new URLSearchParams()
  if (normalizedFilters.clientId)      params.append('clientId', normalizedFilters.clientId)
  if (normalizedFilters.estateAgentId) params.append('estateAgentId', normalizedFilters.estateAgentId)
  if (normalizedFilters.estateId)      params.append('estateId', normalizedFilters.estateId)
  if (normalizedFilters.status)        params.append('status', normalizedFilters.status)
  if (normalizedFilters.estateTypeKey) params.append('estateTypeKey', normalizedFilters.estateTypeKey)
  if (normalizedFilters.startDateTime) params.append('startDateTime', normalizedFilters.startDateTime)
  if (normalizedFilters.endDateTime)   params.append('endDateTime', normalizedFilters.endDateTime)
  if (normalizedFilters.page !== undefined) params.append('page', normalizedFilters.page)
  if (normalizedFilters.size !== undefined) params.append('size', normalizedFilters.size)

  try {
    const response = await appointmentApi.getAppointmentsReport(params)
    const rawList = response?.content || []

    return {
      content: AppointmentMapper.toEntityList(rawList),
      page: response?.page ?? 0,
      size: response?.size ?? 20,
      totalElements: response?.totalElements ?? 0,
      totalPages: response?.totalPages ?? 0,
    }
  } catch (error) {
    throw handleAppointmentError(error, 'Relatório')
  }
}
