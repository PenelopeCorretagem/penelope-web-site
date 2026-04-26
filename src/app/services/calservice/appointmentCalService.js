/**
 * appointmentCalService.js
 * Serviço de negócio para gerenciar appointments no cal-service
 */

import * as appointmentApi from '@api-calservice/appointmentApi'
import { AppointmentCalMapper } from '@mappers/AppointmentCalMapper'

/**
 * Lista appointments com filtros opcionais
 * @param {object} filters - Filtros: clientId, estateAgentId, estateId, status, dateRange, pagination
 * @returns {Promise<AppointmentCal[]>} Array de appointments
 */
export const getAllAppointments = async (filters = {}) => {
  const response = await appointmentApi.listAppointments(filters)
  return AppointmentCalMapper.toEntityList(response.content || response.appointments || response)
}

/**
 * Busca um appointment por ID
 * @param {number} id - ID do appointment
 * @returns {Promise<AppointmentCal>} Entidade AppointmentCal
 */
export const getAppointmentById = async (id) => {
  const response = await appointmentApi.getAppointmentById(id)
  return AppointmentCalMapper.toEntity(response)
}

/**
 * Cria um novo appointment
 * @param {object} appointmentData - Dados do appointment
 * @returns {Promise<AppointmentCal>} Appointment criado
 */
export const createAppointment = async (appointmentData) => {
  const response = await appointmentApi.createAppointment(appointmentData)
  return AppointmentCalMapper.toEntity(response)
}

/**
 * Reagenda um appointment
 * @param {number} id - ID do appointment
 * @param {object} rescheduleData - { startDateTime, endDateTime }
 * @returns {Promise<AppointmentCal>} Appointment atualizado
 */
export const rescheduleAppointment = async (id, rescheduleData) => {
  const response = await appointmentApi.rescheduleAppointment(id, rescheduleData)
  return AppointmentCalMapper.toEntity(response)
}

/**
 * Confirma um appointment
 * @param {number} id - ID do appointment
 * @returns {Promise<AppointmentCal>} Appointment com status CONFIRMED
 */
export const confirmAppointment = async (id) => {
  const response = await appointmentApi.confirmAppointment(id)
  return AppointmentCalMapper.toEntity(response)
}

/**
 * Marca um appointment como concluído
 * @param {number} id - ID do appointment
 * @returns {Promise<AppointmentCal>} Appointment com status CONCLUDED
 */
export const concludeAppointment = async (id) => {
  const response = await appointmentApi.concludeAppointment(id)
  return AppointmentCalMapper.toEntity(response)
}

/**
 * Cancela um appointment
 * @param {number} id - ID do appointment
 * @param {string} reason - Motivo da cancelamento (opcional)
 * @returns {Promise<AppointmentCal>} Appointment cancelado
 */
export const cancelAppointment = async (id, reason = null) => {
  const response = await appointmentApi.cancelAppointment(id, reason)
  return AppointmentCalMapper.toEntity(response)
}

/**
 * Deleta um appointment
 * @param {number} id - ID do appointment
 * @returns {Promise<void>}
 */
export const deleteAppointment = async (id) => {
  return await appointmentApi.deleteAppointment(id)
}
