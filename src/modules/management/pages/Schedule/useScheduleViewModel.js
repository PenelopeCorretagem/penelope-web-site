import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useAppointments } from '../../hooks/useAppointments'
import { useFilters } from '../../hooks/useFilters'
import { useCalendarData } from '../../hooks/useCalendarData'
import { useUIState } from '../../hooks/useUIState'
import { useAppointmentActions } from '../../hooks/useAppointmentActions'
import { useReportData } from '../../hooks/useReportData'
import { ScheduleModel } from './ScheduleModel'
import { getUserById, getUsersWithCreci } from '@service-penelopec/userService'
import { getAllSchedules } from '@service-calservice/scheduleService'
import { authSessionUtil } from '@shared/utils/authSession/authSessionUtil'
import { isAdminAccessLevel, isBrokerAccessLevel, isClientAccessLevel } from '@constant/accessLevels'

/**
 * useScheduleViewModel.js
 * ViewModel principal que coordena todos os hooks menores
 */

export function useScheduleViewModel(options = {}) {
  const {
    defaultDisplayMode = 'calendar',
    availableDisplayModesOverride = null,
  } = options

  const location = useLocation()
  const { role: authenticatedUserRole, userId: authenticatedUserId } = authSessionUtil.get()
  const isAdminUser = isAdminAccessLevel(authenticatedUserRole)
  const isBrokerUser = isBrokerAccessLevel(authenticatedUserRole)
  const isClientUser = isClientAccessLevel(authenticatedUserRole)

  const [isScopeLoading, setIsScopeLoading] = useState(isAdminUser)
  const [canSelectEstateAgent, setCanSelectEstateAgent] = useState(false)
  const [estateAgentFilterOptions, setEstateAgentFilterOptions] = useState([])
  const [selectedEstateAgentFilter, setSelectedEstateAgentFilter] = useState('')
  const [defaultEstateAgentFilter, setDefaultEstateAgentFilter] = useState('')

  const [selectedDate, setSelectedDate] = useState(() => new Date())
  const [displayMode, setDisplayMode] = useState(defaultDisplayMode) // 'calendar', 'daily', 'report'
  const [selectedEstateAgentName, setSelectedEstateAgentName] = useState('')
  const [workSchedule, setWorkSchedule] = useState(null)
  const selectedDateRef = useRef(selectedDate)
  const isReadOnlyAdminView = isAdminUser && canSelectEstateAgent && !isScopeLoading && !selectedEstateAgentFilter
  const canCreateAppointments = isAdminUser || isBrokerUser || isClientUser
  const canManageAppointments = canCreateAppointments && !isReadOnlyAdminView
  const canDeleteAppointments = (isAdminUser || isBrokerUser) && !isReadOnlyAdminView

  // Hooks especializados
  const appointmentService = useAppointments()
  const loadAppointmentsService = appointmentService.loadAppointments
  const setAppointmentsService = appointmentService.setAppointments
  const filterService = useFilters(appointmentService.model.getAll())
  const calendarData = useCalendarData(selectedDate, filterService.filteredAppointments)
  const uiState = useUIState()
  const actions = useAppointmentActions(appointmentService)
  const reportData = useReportData(filterService.filteredAppointments)
  const navigateLabels = useMemo(() => ScheduleModel.getPeriodNavigationLabels(uiState.viewMode), [uiState.viewMode])

  // Determina quais modos de visualização estão disponíveis
  const isAllAgentsSelected = selectedEstateAgentFilter === 'TODOS'
  const availableDisplayModes = useMemo(() => {
    if (Array.isArray(availableDisplayModesOverride) && availableDisplayModesOverride.length > 0) {
      return availableDisplayModesOverride
    }

    if (isClientUser) {
      return ['calendar'] // Cliente só vê calendário
    }

    if (isBrokerUser) {
      return ['calendar', 'daily']
    }

    if (!isAdminUser) {
      return ['calendar'] // Não admin só vê calendário
    }

    if (!canSelectEstateAgent) {
      // Admin com CRECI pode ver calendar e report
      return ['calendar', 'report']
    }

    // Admin sem CRECI - sempre pode ver calendar e report
    return ['calendar', 'report']
  }, [isClientUser, isBrokerUser, isAdminUser, canSelectEstateAgent, availableDisplayModesOverride])

  // Força viewMode="day" quando "TODOS" está selecionado
  const forcedViewMode = isAllAgentsSelected ? 'day' : uiState.viewMode
  const canChangeViewMode = !isAllAgentsSelected

  const appointmentScopeFilters = useMemo(() => {
    if (isClientUser) {
      return {
        clientId: Number(authenticatedUserId),
      }
    }

    if (isBrokerUser) {
      return {
        estateAgentId: Number(authenticatedUserId),
      }
    }

    if (!isAdminUser) {
      return {}
    }

    if (canSelectEstateAgent) {
      if (!selectedEstateAgentFilter || selectedEstateAgentFilter === 'TODOS') {
        return {}
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
  }, [isClientUser, isBrokerUser, isAdminUser, canSelectEstateAgent, selectedEstateAgentFilter, authenticatedUserId])

  const estateAgentScopeFilterOptions = useMemo(() => {
    if (estateAgentFilterOptions.length > 0) {
      return estateAgentFilterOptions
    }

    return [{ value: '', label: 'Nenhum corretor com CRECI' }]
  }, [estateAgentFilterOptions])

  const filterConfigs = filterService.filterConfigs
  const defaultFilters = filterService.defaultFilters

  const preselectedEstateReference = useMemo(() => {
    const locationState = location.state || {}
    const searchParams = new URLSearchParams(location.search)
    const advertisementSlug = searchParams.get('advertisement') || ''

    return {
      preselectedEstateId: locationState.preselectedEstateId ?? null,
      preselectedEstateTitle: locationState.preselectedEstateTitle || locationState.advertisementTitle || '',
      preselectedEstateSlug: locationState.preselectedEstateSlug || advertisementSlug,
    }
  }, [location.search, location.state])

  const handleFiltersChange = filterService.handleFiltersChange

  const handleScheduleFiltersChange = useCallback((filterKey, filterValue) => {
    if (filterKey === 'estateAgentScopeFilter') {
      setSelectedEstateAgentFilter(filterValue)
      return
    }

    handleFiltersChange(filterKey, filterValue)
  }, [handleFiltersChange])

  const handleResetFilters = useCallback(() => {
    filterService.resetFilters()

    if (canSelectEstateAgent) {
      setSelectedEstateAgentFilter(defaultEstateAgentFilter)
    }
  }, [filterService, canSelectEstateAgent, defaultEstateAgentFilter])

  // Extrai o nome do corretor selecionado para exibição no relatório
  useEffect(() => {
    if (!canSelectEstateAgent) {
      // Admin com CRECI vê seus próprios dados
      setSelectedEstateAgentName('')
      return
    }

    if (isAllAgentsSelected || !selectedEstateAgentFilter) {
      setSelectedEstateAgentName('Todos os corretores')
      return
    }

    // Encontra o nome do corretor selecionado
    const agentOption = estateAgentFilterOptions.find(opt => opt.value === selectedEstateAgentFilter)
    setSelectedEstateAgentName(agentOption?.label || '')
  }, [selectedEstateAgentFilter, canSelectEstateAgent, estateAgentFilterOptions, isAllAgentsSelected])

  // Valida e ajusta displayMode quando muda de modo disponível
  useEffect(() => {
    if (!availableDisplayModes.includes(displayMode)) {
      setDisplayMode(availableDisplayModes[0] || defaultDisplayMode)
    }
  }, [availableDisplayModes, displayMode, defaultDisplayMode])

  // Força forçar viewMode = day quando TODOS selecionado
  useEffect(() => {
    if (isAllAgentsSelected && uiState.viewMode !== 'day') {
      uiState.setViewMode('day')
    }
  }, [isAllAgentsSelected, uiState])

  const handleDisplayModeChange = useCallback((mode) => {
    if (availableDisplayModes.includes(mode)) {
      setDisplayMode(mode)
    }
  }, [availableDisplayModes])

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
        const agentOptions = [
          { value: 'TODOS', label: 'Todos os Corretores' },
          ...usersWithCreci
            .map(user => ({
              value: String(user.id),
              label: user.name || `Corretor #${user.id}`,
            }))
            .filter(option => Boolean(option.value)),
        ]

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

  useEffect(() => {
    const loadSchedules = async () => {
      try {
        const schedules = await getAllSchedules()
        const defaultSchedule = Array.isArray(schedules)
          ? schedules.find(schedule => schedule.isDefault) || schedules[0] || null
          : null
        setWorkSchedule(defaultSchedule)
      } catch {
        setWorkSchedule(null)
      }
    }

    loadSchedules()
  }, [])

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
          uiState.closeConfirmationAlert()
          uiState.openSuccessAlert('Agendamento confirmado com sucesso.')
        } catch (error) {
          uiState.closeConfirmationAlert()
          uiState.openErrorAlert(error.message || 'Erro ao confirmar agendamento')
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
          uiState.closeConfirmationAlert()
          uiState.openSuccessAlert('Agendamento concluído com sucesso.')
        } catch (error) {
          uiState.closeConfirmationAlert()
          uiState.openErrorAlert(error.message || 'Erro ao concluir agendamento')
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
          uiState.closeConfirmationAlert()
          uiState.openSuccessAlert('Agendamento cancelado com sucesso.')
        } catch (error) {
          uiState.closeConfirmationAlert()
          uiState.openErrorAlert(error.message || 'Erro ao cancelar agendamento')
        } finally {
          uiState.setBusyAppointmentId(null)
        }
      },
    })
    uiState.handleCloseAppointmentTools()
  }, [isReadOnlyAdminView, uiState, actions, appointmentService, selectedDate])

  const handleDeleteFromTools = useCallback(() => {
    if (!canDeleteAppointments) return
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
          uiState.closeConfirmationAlert()
          uiState.openSuccessAlert('Agendamento excluído com sucesso.', 2000)
        } catch (error) {
          uiState.closeConfirmationAlert()
          uiState.openErrorAlert(error.message || 'Erro ao excluir agendamento')
        } finally {
          uiState.setBusyAppointmentId(null)
        }
      },
    })
    uiState.handleCloseAppointmentTools()
  }, [isReadOnlyAdminView, uiState, actions, appointmentService, selectedDate])


  // Dados derivados
  const totalAppointmentsCount = appointmentService.model.getTotal()

  const upcomingAppointments = useMemo(() => {
    const all = appointmentService.model.getAll()
    const now = new Date()
    return all
      .filter(a => a.startDateTime && a.startDateTime >= now)
      .sort((a, b) => a.startDateTime - b.startDateTime)
      .slice(0, 5)
  }, [appointmentService])

  const monthCount = useMemo(() => {
    const all = appointmentService.model.getAll()
    return all.filter(a => {
      const d = a.startDateTime
      if (!d) return false
      return d.getMonth() === selectedDate.getMonth() && d.getFullYear() === selectedDate.getFullYear()
    }).length
  }, [appointmentService, selectedDate])

  return {
    // Estado
    selectedDate,
    setSelectedDate,
    loading: appointmentService.loading,
    error: appointmentService.error,

    // Modos de visualização
    displayMode,
    handleDisplayModeChange,
    availableDisplayModes,
    isAllAgentsSelected,
    forcedViewMode,
    canChangeViewMode,

    // Permissões
    isAdminUser,
    isClientUser,
    isReadOnlyAdminView,
    canCreateAppointments,
    canManageAppointments,
    canDeleteAppointments,

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
    viewMode: forcedViewMode,
    setViewMode: canChangeViewMode ? uiState.setViewMode : () => {},
    isModalOpen: uiState.isModalOpen,
    selectedModalDate: uiState.selectedModalDate,
    selectedModalHour: uiState.selectedModalHour,
    appointmentToEdit: uiState.appointmentToEdit,
    busyAppointmentId: uiState.busyAppointmentId,
    selectedAppointmentForTools: uiState.selectedAppointmentForTools,
    confirmationAlert: uiState.confirmationAlert,
    isConfirmationAlertProcessing: uiState.isConfirmationAlertProcessing,
    successAlert: uiState.successAlert,
    errorAlert: uiState.errorAlert,

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

    // Dados de relatório
    reportData,
    selectedEstateAgentName,
    workSchedule,

    // Dados
    filteredAppointments: filterService.filteredAppointments,
    allAppointments: appointmentService.model.getAll(),
    totalAppointments: totalAppointmentsCount,
    upcomingAppointments,
    monthCount,

    // Ações de UI
    handleTimeSlotClick: (date, hour) => uiState.handleTimeSlotClick(date, hour, ScheduleModel.isPastDate(date)),
    handleModalClose: uiState.handleModalClose,
    handleOpenAppointmentTools: uiState.handleOpenAppointmentTools,
    handleCloseAppointmentTools: uiState.handleCloseAppointmentTools,
    handleResetFilters,
    closeConfirmationAlert: uiState.closeConfirmationAlert,
    closeSuccessAlert: uiState.closeSuccessAlert,
    closeErrorAlert: uiState.closeErrorAlert,
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
    preselectedEstateReference,
  }
}
