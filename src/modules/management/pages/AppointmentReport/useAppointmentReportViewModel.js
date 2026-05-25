import { useState, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { useScheduleViewModel as useBaseScheduleViewModel } from '../Schedule/useScheduleViewModel'
import { AppointmentReportModel } from './AppointmentReportModel'
import { RouterModel } from '@routes/RouterModel'

/**
 * useAppointmentReportViewModel.js
 * Hook de viewmodel para a página de relatório de agendamentos.
 */
export function useAppointmentReportViewModel() {
  const [model] = useState(() => new AppointmentReportModel())
  const [, forceUpdate] = useState(0)
  const location = useLocation()
  const router = RouterModel.getInstance()
  const recordsRoute = router.getRoute('SCHEDULE_REPORT_RECORDS')

  const refreshUI = useCallback(() => forceUpdate((prev) => prev + 1), [])

  const vm = useBaseScheduleViewModel({
    defaultDisplayMode: 'report',
    availableDisplayModesOverride: ['report'],
  })

  useEffect(() => {
    const nextSection = location.pathname === recordsRoute ? 'records' : 'dashboard'
    if (model.setActiveSection(nextSection)) {
      refreshUI()
    }
  }, [location.pathname, model, recordsRoute, refreshUI])

  return {
    ...vm,
    activeSection: model.activeSection,
  }
}
