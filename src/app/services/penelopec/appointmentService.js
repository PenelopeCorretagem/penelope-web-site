import * as appointmentApi from '@api-penelopec/appointmentApi'
import { AppointmentMapper } from '@mappers/AppointmentMapper'

/**
 * Camada de Serviço - Orquestra a chamada à API e transformação de dados
 * Responsável por lógica de negócio e conversão de DTOs para entidades de domínio
 */

/**
 * Lista agendamentos com filtros opcionais.
 * @param {object} filters - Filtros de busca
 * @returns {Promise<object>} Paginação com Appointment[]
 */
export const getAllAppointments = async (filters = {}) => {
  const response = await appointmentApi.getAllAppointments(filters)
  return AppointmentMapper.toPaginatedEntityList(response)
}

/**
 * Busca um agendamento específico por ID.
 * @param {number} id - ID do agendamento
 * @returns {Promise<Appointment>} Entidade Appointment
 */
export const getAppointmentById = async (id) => {
  const response = await appointmentApi.getAppointmentById(id)
  return AppointmentMapper.toEntity(response)
}

/**
 * Reagenda um agendamento existente.
 * @param {number} id - ID do agendamento
 * @param {object} rescheduleData - Dados do reagendamento
 * @returns {Promise<Appointment>} Entidade Appointment atualizada
 */
export const rescheduleAppointment = async (id, rescheduleData) => {
  const response = await appointmentApi.rescheduleAppointment(id, rescheduleData)
  return AppointmentMapper.toEntity(response)
}

/**
 * Cancela um agendamento.
 * @param {number} id - ID do agendamento
 * @param {string} reason - Motivo do cancelamento (opcional)
 * @returns {Promise<object>} Resposta da API
 */
export const cancelAppointment = async (id, reason = null) => {
  return await appointmentApi.cancelAppointment(id, reason)
}

/**
 * Cria um novo agendamento.
 * @param {object} appointmentData - Dados do agendamento
 * @returns {Promise<Appointment>} Entidade Appointment criada
 */
export const createAppointment = async (appointmentData) => {
  const response = await appointmentApi.createAppointment(appointmentData)
  return AppointmentMapper.toEntity(response)
}
