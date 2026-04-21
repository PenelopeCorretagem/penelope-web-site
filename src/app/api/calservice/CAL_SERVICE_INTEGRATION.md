/**
 * INTEGRAÇÃO CAL-SERVICE NO FRONT-END
 * ==================================
 * 
 * Guia completo de como o front-end consome o cal-service
 * 
 * ## Arquitetura Criada
 * 
 * 📂 src/app/api/calservice/
 *    ├── eventTypeApi.js          → Endpoints para gerenciar tipos de eventos
 *    └── appointmentCalApi.js     → Endpoints para gerenciar agendamentos
 * 
 * 📂 src/app/services/calservice/
 *    ├── eventTypeService.js      → Lógica de negócio para event types
 *    └── appointmentCalService.js → Lógica de negócio para appointments
 * 
 * 📂 src/app/mappers/
 *    ├── EventTypeMapper.js       → Conversão API → Entidades
 *    └── AppointmentCalMapper.js  → Conversão API → Entidades
 * 
 * 📂 src/app/dtos/
 *    ├── EventType.js             → DTO para tipos de eventos
 *    └── AppointmentCal.js        → DTO para agendamentos completos
 * 
 * ## Aliases Disponíveis
 * 
 * import * as eventTypeApi from '@api-calservice/eventTypeApi'
 * import * as appointmentCalApi from '@api-calservice/appointmentCalApi'
 * import * as eventTypeService from '@service-calservice/eventTypeService'
 * import * as appointmentCalService from '@service-calservice/appointmentCalService'
 * import { EventTypeMapper } from '@mappers/EventTypeMapper'
 * import { AppointmentCalMapper } from '@mappers/AppointmentCalMapper'
 * import { EventType } from '@dtos/EventType'
 * import { AppointmentCal } from '@dtos/AppointmentCal'
 * 
 * ## Configuração de Ambiente
 * 
 * Adicionar a variável em .env.{environment}:
 * 
 *   VITE_CAL_SERVICE_URL=http://localhost:8080/api/v1
 * 
 * ## Fluxo de Consumo
 * 
 * ### 1. Listar EventTypes
 * 
 *   import * as eventTypeService from '@service-calservice/eventTypeService'
 * 
 *   const eventTypes = await eventTypeService.getAllEventTypes()
 *   // Retorna: EventType[]
 * 
 * ### 2. Criar EventType
 * 
 *   const newEventType = await eventTypeService.createEventType({
 *     title: 'Visita ao imóvel',
 *     description: 'Agendamento de visita',
 *     lengthInMinutes: 60,
 *     minimumBookingNotice: 120,
 *     estateId: 42
 *   })
 *   // Retorna: EventType
 * 
 * ### 3. Atualizar EventType
 * 
 *   const updated = await eventTypeService.updateEventType(1, {
 *     title: 'Novo Título',
 *     lengthInMinutes: 90
 *   })
 *   // Retorna: EventType
 * 
 * ### 4. Toggle Visibility de EventType
 * 
 *   const toggled = await eventTypeService.toggleEventTypeVisibility(1)
 *   // Retorna: EventType (com .hidden invertido)
 * 
 * ### 5. Deletar EventType
 * 
 *   await eventTypeService.deleteEventType(1)
 * 
 * ### 6. Listar Appointments
 * 
 *   import * as appointmentCalService from '@service-calservice/appointmentCalService'
 * 
 *   const appointments = await appointmentCalService.getAllAppointments({
 *     estateId: 42,
 *     status: 'PENDING',
 *     dateFrom: '2025-04-01',
 *     dateTo: '2025-04-30'
 *   })
 *   // Retorna: AppointmentCal[]
 * 
 * ### 7. Criar Appointment
 * 
 *   const newAppt = await appointmentCalService.createAppointment({
 *     eventTypeId: 1,
 *     clientId: 100,
 *     estateAgentId: 50,
 *     estateId: 42,
 *     startDateTime: '2025-04-10T10:00:00',
 *     endDateTime: '2025-04-10T11:00:00'
 *   })
 *   // Retorna: AppointmentCal (com bookingUid preenchido)
 * 
 * ### 8. Reagendar Appointment
 * 
 *   const rescheduled = await appointmentCalService.rescheduleAppointment(1, {
 *     startDateTime: '2025-04-11T10:00:00',
 *     endDateTime: '2025-04-11T11:00:00'
 *   })
 *   // Retorna: AppointmentCal
 * 
 * ### 9. Confirmar Appointment (PENDING → CONFIRMED)
 * 
 *   const confirmed = await appointmentCalService.confirmAppointment(1)
 *   // Retorna: AppointmentCal com status CONFIRMED
 * 
 * ### 10. Concluir Appointment (CONFIRMED → CONCLUDED)
 * 
 *   const concluded = await appointmentCalService.concludeAppointment(1)
 *   // Retorna: AppointmentCal com status CONCLUDED
 * 
 * ### 11. Cancelar Appointment
 * 
 *   const cancelled = await appointmentCalService.cancelAppointment(1, 'Cliente cancelou')
 *   // Retorna: AppointmentCal com status CANCELLED
 * 
 * ### 12. Deletar Appointment
 * 
 *   await appointmentCalService.deleteAppointment(1)
 * 
 * ## Estados de Appointment
 * 
 * - PENDING:   Agendamento criado, aguardando confirmação
 * - CONFIRMED: Cliente confirmou a visita
 * - CONCLUDED: Visita foi realizada
 * - CANCELLED: Agendamento foi cancelado (estado terminal)
 * 
 * Transições válidas:
 * - PENDING → CONFIRMED, CANCELLED
 * - CONFIRMED → CONCLUDED, CANCELLED
 * - CONCLUDED → (terminal, sem transições)
 * - CANCELLED → (terminal, sem transições)
 * 
 * ## Uso em Hooks
 * 
 * exemplo useCalServiceAppointments.js:
 * 
 *   import { useState, useEffect } from 'react'
 *   import * as appointmentCalService from '@service-calservice/appointmentCalService'
 * 
 *   export function useCalServiceAppointments(estateId) {
 *     const [appointments, setAppointments] = useState([])
 *     const [loading, setLoading] = useState(false)
 *     const [error, setError] = useState(null)
 * 
 *     useEffect(() => {
 *       (async () => {
 *         try {
 *           setLoading(true)
 *           const data = await appointmentCalService.getAllAppointments({
 *             estateId
 *           })
 *           setAppointments(data)
 *         } catch (err) {
 *           setError(err.message)
 *         } finally {
 *           setLoading(false)
 *         }
 *       })()
 *     }, [estateId])
 * 
 *     return { appointments, loading, error }
 *   }
 * 
 * ## Autenticação
 * 
 * Todos os endpoints requerem token JWT no header:
 * Authorization: Bearer {token}
 * 
 * O token é obtido automaticamente de:
 * - sessionStorage['token'] (prioridade)
 * - localStorage['jwtToken'] (fallback)
 * 
 * ## Diferenças vs Penelope-API-REST
 * 
 * A API REST (penelope-api-rest) é um proxy que chama o cal-service,
 * mas algumas funcionalidades estão disponíveis APENAS no cal-service:
 * 
 * ✅ Apenas cal-service:
 * - Toggle visibility de event types
 * - Confirmar agendamentos (PENDING → CONFIRMED)
 * - Concluir agendamentos (CONFIRMED → CONCLUDED)
 * - Obter bookingUid sincronizado com Cal.com
 * 
 * ✅ Ambas (cal-service + API REST):
 * - Listar/buscar appointments
 * - Criar appointments
 * - Reagendar appointments
 * - Cancelar appointments
 * 
 * Portanto, o front-end deve usar cal-service diretamente para
 * funcionalidade completa de agendamentos!
 */

// Este arquivo é apenas documentação - não contém código executável
