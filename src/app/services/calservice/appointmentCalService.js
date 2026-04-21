/**
 * appointmentCalService.js
 * Serviço de negócio para gerenciar appointments no cal-service
 */

import * as appointmentCalApi from '@api-calservice/appointmentCalApi'
import { AppointmentCalMapper } from '@mappers/AppointmentCalMapper'

/**
 * Lista appointments com filtros opcionais
 * @param {object} filters - Filtros: clientId, estateAgentId, estateId, status, dateRange, pagination
 * @returns {Promise<AppointmentCal[]>} Array de appointments
 */
export const getAllAppointments = async (filters = {}) => {
  const response = await appointmentCalApi.listAppointments(filters)
  return AppointmentCalMapper.toEntityList(response)
}

/**
 * Busca um appointment por ID
 * @param {number} id - ID do appointment
 * @returns {Promise<AppointmentCal>} Entidade AppointmentCal
 */
export const getAppointmentById = async (id) => {
  const response = await appointmentCalApi.getAppointmentById(id)
  return AppointmentCalMapper.toEntity(response)
}

/**
 * Cria um novo appointment
 * @param {object} appointmentData - Dados do appointment
 * @returns {Promise<AppointmentCal>} Appointment criado
 */
export const createAppointment = async (appointmentData) => {
  const response = await appointmentCalApi.createAppointment(appointmentData)
  return AppointmentCalMapper.toEntity(response)
}

/**
 * Reagenda um appointment
 * @param {number} id - ID do appointment
 * @param {object} rescheduleData - { startDateTime, endDateTime }
 * @returns {Promise<AppointmentCal>} Appointment atualizado
 */
export const rescheduleAppointment = async (id, rescheduleData) => {
  const response = await appointmentCalApi.rescheduleAppointment(id, rescheduleData)
  return AppointmentCalMapper.toEntity(response)
}

/**
 * Confirma um appointment
 * @param {number} id - ID do appointment
 * @returns {Promise<AppointmentCal>} Appointment com status CONFIRMED
 */
export const confirmAppointment = async (id) => {
  const response = await appointmentCalApi.confirmAppointment(id)
  return AppointmentCalMapper.toEntity(response)
}

/**
 * Marca um appointment como concluído
 * @param {number} id - ID do appointment
 * @returns {Promise<AppointmentCal>} Appointment com status CONCLUDED
 */
export const concludeAppointment = async (id) => {
  const response = await appointmentCalApi.concludeAppointment(id)
  return AppointmentCalMapper.toEntity(response)
}

/**
 * Cancela um appointment
 * @param {number} id - ID do appointment
 * @param {string} reason - Motivo da cancelamento (opcional)
 * @returns {Promise<AppointmentCal>} Appointment cancelado
 */
export const cancelAppointment = async (id, reason = null) => {
  const response = await appointmentCalApi.cancelAppointment(id, reason)
  return AppointmentCalMapper.toEntity(response)
}

/**
 * Deleta um appointment
 * @param {number} id - ID do appointment
 * @returns {Promise<void>}
 */
export const deleteAppointment = async (id) => {
  return await appointmentCalApi.deleteAppointment(id)
}
