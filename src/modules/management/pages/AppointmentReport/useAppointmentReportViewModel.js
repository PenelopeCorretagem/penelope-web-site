import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useAppointments } from '../../hooks/useAppointments'
import { useAppointmentReportFilters } from './hooks/useAppointmentReportFilters'
import { useCalendarData } from '../../hooks/useCalendarData'
import { useUIState } from '../../hooks/useUIState'
import { useAppointmentActions } from '../../hooks/useAppointmentActions'
import { useReportData } from '../../hooks/useReportData'
import { CalendarModel } from '@management/models/CalendarModel'
import { AppointmentReportModel } from './AppointmentReportModel'
import { RouterModel } from '@routes/RouterModel'
import { getUserById, getUsersWithCreci } from '@service-penelopec/userService'
import { authSessionUtil } from '@shared/utils/authSession/authSessionUtil'
import { isAdminAccessLevel, isBrokerAccessLevel, isClientAccessLevel } from '@constant/accessLevels'

/**
 * useAppointmentReportViewModel.js
 *
 * Responsabilidades:
 * - Gerenciar a seção ativa (dashboard / records)
 * - Expor loading e dados de agendamentos já enriquecidos do backend
 *
 * Com o novo endpoint /appointments/report do backend:
 * - Os agendamentos já vêm com estateTitle, estateTypeKey e estateTypeFriendlyName
 * - Nenhuma anotação local ou cruzamento de dados é necessário
 * - Todo enriquecimento vem do servidor
 */
export function useAppointmentReportViewModel() {
  const [model] = useState(() => new AppointmentReportModel())
  const [, forceUpdate] = useState(0)
  const location = useLocation()
  const router = RouterModel.getInstance()
  const recordsRoute = router.getRoute('SCHEDULE_REPORT_RECORDS')

  const refreshUI = useCallback(() => forceUpdate((prev) => prev + 1), [])

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
  const [displayMode, setDisplayMode] = useState('report')
  const [selectedEstateAgentName, setSelectedEstateAgentName] = useState('')
  const selectedDateRef = useRef(selectedDate)
  const isReadOnlyAdminView = isAdminUser && canSelectEstateAgent && !isScopeLoading

  const appointmentService = useAppointments()
  const loadAppointmentsService = appointmentService.loadAppointments
  const setAppointmentsService = appointmentService.setAppointments
  const filterService = useAppointmentReportFilters(appointmentService.model.getAll())
  const calendarData = useCalendarData(selectedDate, filterService.filteredAppointments)
  const uiState = useUIState()
  const actions = useAppointmentActions(appointmentService)
  const reportData = useReportData(filterService.filteredAppointments)
  const navigateLabels = useMemo(() => CalendarModel.getPeriodNavigationLabels(uiState.viewMode), [uiState.viewMode])

  const isAllAgentsSelected = selectedEstateAgentFilter === 'TODOS'
  const availableDisplayModes = useMemo(() => ['report'], [])
  const forcedViewMode = 'day'
  const canChangeViewMode = false

  const getApiErrorMessage = useCallback((error, fallbackMessage) => {
    const apiMessage = error?.response?.data?.message

    if (typeof apiMessage === 'string' && apiMessage.trim()) {
      return apiMessage.trim()
    }

    if (typeof error?.message === 'string' && error.message.trim()) {
      return error.message.trim()
    }

    return fallbackMessage
  }, [])

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

      const parsedId = Number(selectedEstateAgentFilter)
      if (Number.isNaN(parsedId)) {
        return {}
      }

      return {
        estateAgentId: parsedId,
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

  useEffect(() => {
    if (!canSelectEstateAgent) {
      setSelectedEstateAgentName('')
      return
    }

    if (isAllAgentsSelected || !selectedEstateAgentFilter) {
      setSelectedEstateAgentName('Todos os corretores')
      return
    }

    const agentOption = estateAgentFilterOptions.find(opt => opt.value === selectedEstateAgentFilter)
    setSelectedEstateAgentName(agentOption?.label || '')
  }, [selectedEstateAgentFilter, canSelectEstateAgent, estateAgentFilterOptions, isAllAgentsSelected])

  useEffect(() => {
    if (!availableDisplayModes.includes(displayMode)) {
      setDisplayMode(availableDisplayModes[0] || 'report')
    }
  }, [availableDisplayModes, displayMode])

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

    // Prepara filtros completos incluindo intervalo de datas
    const filtersWithDateRange = {
      ...appointmentScopeFilters,
    }

    // Passa startDateTime e endDateTime se estiverem definidos
    if (reportData.startDate) {
      filtersWithDateRange.startDateTime = reportData.startDate.toISOString()
    }
    if (reportData.endDate) {
      filtersWithDateRange.endDateTime = reportData.endDate.toISOString()
    }

    await loadAppointmentsService(selectedDateRef.current, filtersWithDateRange)
  }, [isScopeLoading, appointmentScopeFilters, loadAppointmentsService, setAppointmentsService, reportData.startDate, reportData.endDate])

  useEffect(() => {
    selectedDateRef.current = selectedDate
  }, [selectedDate])

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

  useEffect(() => {
    loadAppointmentsWithScope()
  }, [loadAppointmentsWithScope])

  // Recarrega agendamentos quando datas de filtro mudam
  useEffect(() => {
    loadAppointmentsWithScope()
  }, [reportData.startDate, reportData.endDate, loadAppointmentsWithScope])

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

  const handleChangeMonth = useCallback((direction) => {
    const nextMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + direction, 1)
    setSelectedDate(nextMonth)
  }, [selectedDate])

  const handleGoToToday = useCallback(() => {
    setSelectedDate(new Date())
  }, [])

  const handleAppointmentSaved = useCallback(async ({ mode = 'create' } = {}) => {
    await loadAppointmentsWithScope()

    if (mode === 'reschedule') {
      uiState.openSuccessAlert('Agendamento reagendado com sucesso.')
      return
    }

    uiState.openSuccessAlert('Agendamento realizado com sucesso.')
  }, [loadAppointmentsWithScope, uiState])

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
          uiState.openErrorAlert(getApiErrorMessage(error, 'Erro ao confirmar agendamento'))
        } finally {
          uiState.setBusyAppointmentId(null)
        }
      },
    })
    uiState.handleCloseAppointmentTools()
  }, [isReadOnlyAdminView, uiState, actions, getApiErrorMessage, appointmentService, selectedDate])

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
          uiState.openErrorAlert(getApiErrorMessage(error, 'Erro ao concluir agendamento'))
        } finally {
          uiState.setBusyAppointmentId(null)
        }
      },
    })
    uiState.handleCloseAppointmentTools()
  }, [isReadOnlyAdminView, uiState, actions, getApiErrorMessage, appointmentService, selectedDate])

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
          uiState.openErrorAlert(getApiErrorMessage(error, 'Erro ao cancelar agendamento'))
        } finally {
          uiState.setBusyAppointmentId(null)
        }
      },
    })
    uiState.handleCloseAppointmentTools()
  }, [isReadOnlyAdminView, uiState, actions, getApiErrorMessage, appointmentService, selectedDate])

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
          uiState.closeConfirmationAlert()
          uiState.openSuccessAlert('Agendamento excluído com sucesso.', 2000)
        } catch (error) {
          uiState.closeConfirmationAlert()
          uiState.openErrorAlert(getApiErrorMessage(error, 'Erro ao excluir agendamento'))
        } finally {
          uiState.setBusyAppointmentId(null)
        }
      },
    })
    uiState.handleCloseAppointmentTools()
  }, [isReadOnlyAdminView, uiState, actions, getApiErrorMessage])

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
      return d && d.getMonth() === selectedDate.getMonth() && d.getFullYear() === selectedDate.getFullYear()
    }).length
  }, [appointmentService, selectedDate])

  const vm = {
    selectedDate,
    setSelectedDate,
    loading: appointmentService.loading,
    error: appointmentService.error,
    displayMode,
    handleDisplayModeChange,
    availableDisplayModes,
    isAllAgentsSelected,
    forcedViewMode,
    canChangeViewMode,
    isAdminUser,
    isClientUser,
    isReadOnlyAdminView,
    canManageAppointments: !isReadOnlyAdminView,
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
    viewMode: forcedViewMode,
    setViewMode: () => {},
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
    reportData,
    selectedEstateAgentName,
    filteredAppointments: filterService.filteredAppointments,
    allAppointments: appointmentService.model.getAll(),
    totalAppointments: totalAppointmentsCount,
    upcomingAppointments,
    monthCount,
    handleTimeSlotClick: (date, hour) => uiState.handleTimeSlotClick(date, hour, CalendarModel.isPastDate(date)),
    handleModalClose: uiState.handleModalClose,
    handleOpenAppointmentTools: uiState.handleOpenAppointmentTools,
    handleResetFilters,
    handleCloseAppointmentTools: uiState.handleCloseAppointmentTools,
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
    loadAppointments: () => loadAppointmentsWithScope(),
    setAppointments: (appointments) => appointmentService.setAppointments(appointments, selectedDate),
    addAppointment: (appointment) => appointmentService.addAppointment(appointment, selectedDate),
    preselectedEstateReference,
  }

  // ─── Seção ativa via rota ────────────────────────────────────────────────
  useEffect(() => {
    const nextSection = location.pathname === recordsRoute ? 'records' : 'dashboard'
    if (model.setActiveSection(nextSection)) {
      refreshUI()
    }
  }, [location.pathname, model, recordsRoute, refreshUI])

  return {
    // Tudo do base ViewModel (filtros, ações, calendário, permissões...)
    ...vm,

    // Estado da seção ativa
    activeSection: model.activeSection,

    // Loading direto — não há anotação adicional
    loading: vm.loading,
  }
}
