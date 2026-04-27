import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useScheduleAppointments } from './hooks/useScheduleAppointments'
import { useScheduleFilters } from './hooks/useScheduleFilters'
import { useScheduleCalendarData } from './hooks/useScheduleCalendarData'
import { useScheduleUIState } from './hooks/useScheduleUIState'
import { useScheduleAppointmentActions } from './hooks/useScheduleAppointmentActions'
import { ScheduleModel } from './ScheduleModel'
import { getUserById, getUsersWithCreci } from '@service-penelopec/userService'

/**
 * useScheduleViewModel.js
 * ViewModel principal que coordena todos os hooks menores
 */

export function useScheduleViewModel() {
  const isAdminUser = sessionStorage.getItem('userRole') === 'ADMINISTRADOR'
  const isClientUser = sessionStorage.getItem('userRole') === 'CLIENTE'
  const authenticatedUserId = sessionStorage.getItem('userId')

  const [isScopeLoading, setIsScopeLoading] = useState(isAdminUser)
  const [canSelectEstateAgent, setCanSelectEstateAgent] = useState(false)
  const [estateAgentFilterOptions, setEstateAgentFilterOptions] = useState([])
  const [selectedEstateAgentFilter, setSelectedEstateAgentFilter] = useState('')
  const [defaultEstateAgentFilter, setDefaultEstateAgentFilter] = useState('')

  const [selectedDate, setSelectedDate] = useState(() => new Date())
  const selectedDateRef = useRef(selectedDate)
  const isReadOnlyAdminView = isAdminUser && canSelectEstateAgent && !isScopeLoading

  // Hooks especializados
  const appointmentService = useScheduleAppointments()
  const loadAppointmentsService = appointmentService.loadAppointments
  const setAppointmentsService = appointmentService.setAppointments
  const filterService = useScheduleFilters(appointmentService.model.getAll())
  const calendarData = useScheduleCalendarData(selectedDate, filterService.filteredAppointments)
  const uiState = useScheduleUIState()
  const actions = useScheduleAppointmentActions(appointmentService)
  const navigateLabels = useMemo(() => ScheduleModel.getPeriodNavigationLabels(uiState.viewMode), [uiState.viewMode])

  const appointmentScopeFilters = useMemo(() => {
    if (isClientUser) {
      return {}
    }

    if (!isAdminUser) {
      return {}
    }

    if (canSelectEstateAgent) {
      if (!selectedEstateAgentFilter) {
        return null
      }

      return {
        estateAgentId: Number(selectedEstateAgentFilter),
      }
    }

    if (!authenticatedUserId) {
      return null
    }

    return {
      estateAgentId: Number(authenticatedUserId),
    }
  }, [isClientUser, isAdminUser, canSelectEstateAgent, selectedEstateAgentFilter, authenticatedUserId])

  const estateAgentScopeFilterOptions = useMemo(() => {
    if (estateAgentFilterOptions.length > 0) {
      return estateAgentFilterOptions
    }

    return [{ value: '', label: 'Nenhum corretor com CRECI' }]
  }, [estateAgentFilterOptions])

  const filterConfigs = filterService.filterConfigs
  const defaultFilters = filterService.defaultFilters

  const handleFiltersChange = filterService.handleFiltersChange

  const handleScheduleFiltersChange = useCallback((filterKey, filterValue) => {
    if (filterKey === 'estateAgentScopeFilter') {
      setSelectedEstateAgentFilter(filterValue)
      return
    }

    handleFiltersChange(filterKey, filterValue)
  }, [handleFiltersChange])

  const loadAppointmentsWithScope = useCallback(async () => {
    if (isScopeLoading) {
      return
    }

    if (appointmentScopeFilters === null) {
      setAppointmentsService([], selectedDateRef.current)
      return
    }

    await loadAppointmentsService(selectedDateRef.current, appointmentScopeFilters)
  }, [isScopeLoading, appointmentScopeFilters, loadAppointmentsService, setAppointmentsService])

  useEffect(() => {
    selectedDateRef.current = selectedDate
  }, [selectedDate])

  // Define escopo de visualização para admins com/sem CRECI.
  useEffect(() => {
    if (!isAdminUser) {
      setIsScopeLoading(false)
      setCanSelectEstateAgent(false)
      return
    }

    const initializeAdminScope = async () => {
      setIsScopeLoading(true)

      try {
        if (!authenticatedUserId) {
          setCanSelectEstateAgent(false)
          setSelectedEstateAgentFilter('')
          setDefaultEstateAgentFilter('')
          return
        }

        const currentUser = await getUserById(authenticatedUserId)
        const hasCreci = currentUser?.hasCreci?.() || Boolean(String(currentUser?.creci || '').trim())

        if (hasCreci) {
          setCanSelectEstateAgent(false)
          setEstateAgentFilterOptions([])
          setSelectedEstateAgentFilter(String(authenticatedUserId))
          setDefaultEstateAgentFilter(String(authenticatedUserId))
          return
        }

        const usersWithCreci = await getUsersWithCreci()
        const agentOptions = usersWithCreci
          .map(user => ({
            value: String(user.id),
            label: user.getDisplayName?.() || user.name || `Corretor #${user.id}`,
          }))
          .filter(option => Boolean(option.value))

        setCanSelectEstateAgent(true)
        setEstateAgentFilterOptions(agentOptions)
        const initialAgentFilter = agentOptions[0]?.value || ''
        setSelectedEstateAgentFilter(prev => prev || initialAgentFilter)
        setDefaultEstateAgentFilter(initialAgentFilter)
      } catch {
        setCanSelectEstateAgent(false)
        setEstateAgentFilterOptions([])
        setSelectedEstateAgentFilter('')
        setDefaultEstateAgentFilter('')
      } finally {
        setIsScopeLoading(false)
      }
    }

    initializeAdminScope()
  }, [isAdminUser, authenticatedUserId])

  // Carrega agendamentos com escopo definido por perfil.
  useEffect(() => {
    loadAppointmentsWithScope()
  }, [loadAppointmentsWithScope])

  // Handler para navegação de períodos
  const handleNavigatePeriod = useCallback((direction) => {
    const nextDate = new Date(selectedDate)

    if (uiState.viewMode === 'week') {
      nextDate.setDate(nextDate.getDate() + (7 * direction))
    } else if (uiState.viewMode === 'day') {
      nextDate.setDate(nextDate.getDate() + direction)
    } else {
      nextDate.setMonth(nextDate.getMonth() + direction)
    }

    setSelectedDate(nextDate)
  }, [selectedDate, uiState.viewMode])

  // Handler para mudança de mês
  const handleChangeMonth = useCallback((direction) => {
    const nextMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + direction, 1)
    setSelectedDate(nextMonth)
  }, [selectedDate])

  // Handler para voltar ao dia de hoje
  const handleGoToToday = useCallback(() => {
    setSelectedDate(new Date())
  }, [])

  // Handler para sucesso na submissão do formulário
  const handleAppointmentSaved = useCallback(async ({ mode = 'create' } = {}) => {
    await loadAppointmentsWithScope()

    if (mode === 'reschedule') {
      uiState.openSuccessAlert('Agendamento reagendado com sucesso.')
      return
    }

    uiState.openSuccessAlert('Agendamento realizado com sucesso.')
  }, [loadAppointmentsWithScope, uiState])

  // Handlers para ações dentro do modal de ferramentas
  const handleRescheduleFromTools = useCallback(() => {
    if (isReadOnlyAdminView) return

    if (!uiState.selectedAppointmentForTools) return

    uiState.handleRescheduleAppointment(uiState.selectedAppointmentForTools)
    uiState.handleCloseAppointmentTools()
  }, [isReadOnlyAdminView, uiState])

  const handleConfirmFromTools = useCallback(() => {
    if (isReadOnlyAdminView) return

    if (!uiState.selectedAppointmentForTools) return

    uiState.openConfirmationAlert({
      type: 'warning',
      message: 'Deseja confirmar este agendamento?',
      confirmLabel: 'Confirmar',
      confirmColor: 'pink',
      onConfirm: async () => {
        uiState.setBusyAppointmentId(uiState.selectedAppointmentForTools.id)
        try {
          const updated = await actions.executeConfirm(uiState.selectedAppointmentForTools.id)
          await appointmentService.applyUpdatedAppointment(updated, selectedDate)
          uiState.openSuccessAlert('Agendamento confirmado com sucesso.')
        } finally {
          uiState.setBusyAppointmentId(null)
        }
      },
    })
    uiState.handleCloseAppointmentTools()
  }, [isReadOnlyAdminView, uiState, actions, appointmentService, selectedDate])

  const handleConcludeFromTools = useCallback(() => {
    if (isReadOnlyAdminView) return

    if (!uiState.selectedAppointmentForTools) return

    uiState.openConfirmationAlert({
      type: 'warning',
      message: 'Deseja concluir este agendamento?',
      confirmLabel: 'Concluir',
      confirmColor: 'brown',
      onConfirm: async () => {
        uiState.setBusyAppointmentId(uiState.selectedAppointmentForTools.id)
        try {
          const updated = await actions.executeConclude(uiState.selectedAppointmentForTools.id)
          await appointmentService.applyUpdatedAppointment(updated, selectedDate)
        } finally {
          uiState.setBusyAppointmentId(null)
        }
      },
    })
    uiState.handleCloseAppointmentTools()
  }, [isReadOnlyAdminView, uiState, actions, appointmentService, selectedDate])

  const handleCancelFromTools = useCallback(() => {
    if (isReadOnlyAdminView) return

    if (!uiState.selectedAppointmentForTools) return

    uiState.openConfirmationAlert({
      type: 'warning',
      message: 'Deseja cancelar este agendamento?',
      confirmLabel: 'Cancelar',
      confirmColor: 'gray',
      onConfirm: async () => {
        uiState.setBusyAppointmentId(uiState.selectedAppointmentForTools.id)
        try {
          const updated = await actions.executeCancel(uiState.selectedAppointmentForTools.id)
          await appointmentService.applyUpdatedAppointment(updated, selectedDate)
          uiState.openSuccessAlert('Agendamento cancelado com sucesso.')
        } finally {
          uiState.setBusyAppointmentId(null)
        }
      },
    })
    uiState.handleCloseAppointmentTools()
  }, [isReadOnlyAdminView, uiState, actions, appointmentService, selectedDate])

  const handleDeleteFromTools = useCallback(() => {
    if (isReadOnlyAdminView) return

    if (!uiState.selectedAppointmentForTools) return

    uiState.openConfirmationAlert({
      type: 'warning',
      message: 'Deseja excluir este agendamento permanentemente?',
      confirmLabel: 'Excluir',
      confirmColor: 'pink',
      onConfirm: async () => {
        uiState.setBusyAppointmentId(uiState.selectedAppointmentForTools.id)
        try {
          await actions.executeDelete(uiState.selectedAppointmentForTools.id)
          await appointmentService.deleteAppointment(uiState.selectedAppointmentForTools.id, selectedDate)
          uiState.openSuccessAlert('Agendamento excluído com sucesso.')
        } finally {
          uiState.setBusyAppointmentId(null)
        }
      },
    })
    uiState.handleCloseAppointmentTools()
  }, [isReadOnlyAdminView, uiState, actions, appointmentService, selectedDate])

  // Dados derivados
  const upcomingAppointments = useMemo(() => {
    const all = appointmentService.model.getAll()
    const now = new Date()
    return all
      .filter(a => a.date >= now)
      .sort((a, b) => a.date - b.date)
      .slice(0, 5)
  }, [appointmentService.model.getTotal()])

  const monthCount = useMemo(() => {
    const all = appointmentService.model.getAll()
    return all.filter(a => {
      const d = a.date
      return d.getMonth() === selectedDate.getMonth() && d.getFullYear() === selectedDate.getFullYear()
    }).length
  }, [appointmentService.model.getTotal(), selectedDate])

  return {
    // Estado
    selectedDate,
    setSelectedDate,
    loading: appointmentService.loading,
    error: appointmentService.error,

    // Permissões
    isAdminUser,
    isReadOnlyAdminView,
    canManageAppointments: !isReadOnlyAdminView,

    // Filtros
    selectedStatusFilter: filterService.selectedStatusFilter,
    selectedEstateFilter: filterService.selectedEstateFilter,
    selectedEstateTypeFilter: filterService.selectedEstateTypeFilter,
    selectedEstateAgentFilter,
    defaultEstateAgentFilter,
    showEstateAgentScopeSelect: isAdminUser && canSelectEstateAgent,
    estateAgentScopeFilterOptions,
    filterConfigs,
    defaultFilters,
    handleFiltersChange: handleScheduleFiltersChange,
    handleEstateAgentScopeFilterChange: setSelectedEstateAgentFilter,

    // UI State
    viewMode: uiState.viewMode,
    setViewMode: uiState.setViewMode,
    isModalOpen: uiState.isModalOpen,
    selectedModalDate: uiState.selectedModalDate,
    selectedModalHour: uiState.selectedModalHour,
    appointmentToEdit: uiState.appointmentToEdit,
    busyAppointmentId: uiState.busyAppointmentId,
    selectedAppointmentForTools: uiState.selectedAppointmentForTools,
    confirmationAlert: uiState.confirmationAlert,
    successAlert: uiState.successAlert,

    // Dados de calendário
    weekdayLabels: calendarData.weekdayLabels,
    hours: calendarData.hours,
    currentMonthName: calendarData.currentMonthName,
    calendarDays: calendarData.calendarDays,
    navigateLabels,
    weekDates: calendarData.weekDates,
    appointmentsByDay: calendarData.appointmentsByDay,
    appointmentsCountByDate: calendarData.appointmentsCountByDate,
    selectedDateAppointments: calendarData.selectedDateAppointments,
    selectedDateAppointmentsByStatus: calendarData.selectedDateAppointmentsByStatus,
    monthlyAppointmentsByStatus: calendarData.monthlyAppointmentsByStatus,

    // Dados
    filteredAppointments: filterService.filteredAppointments,
    allAppointments: appointmentService.model.getAll(),
    totalAppointments: appointmentService.totalAppointments,
    upcomingAppointments,
    monthCount,

    // Ações de UI
    handleTimeSlotClick: (date, hour) => uiState.handleTimeSlotClick(date, hour, ScheduleModel.isPastDate(date)),
    handleModalClose: uiState.handleModalClose,
    handleOpenAppointmentTools: uiState.handleOpenAppointmentTools,
    handleCloseAppointmentTools: uiState.handleCloseAppointmentTools,
    closeConfirmationAlert: uiState.closeConfirmationAlert,
    closeSuccessAlert: uiState.closeSuccessAlert,
    runConfirmationAlertAction: uiState.runConfirmationAlertAction,
    handleAppointmentSaved,
    handleNavigatePeriod,
    handleChangeMonth,
    handleGoToToday,
    handleRescheduleFromTools,
    handleConfirmFromTools,
    handleConcludeFromTools,
    handleCancelFromTools,
    handleDeleteFromTools,

    // Serviços
    loadAppointments: () => loadAppointmentsWithScope(),
    setAppointments: (appointments) => appointmentService.setAppointments(appointments, selectedDate),
    addAppointment: (appointment) => appointmentService.addAppointment(appointment, selectedDate),
  }
}
