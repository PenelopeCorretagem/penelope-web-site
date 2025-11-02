import { AlertView } from '@shared/components/feedback/Alert/AlertView'

export function ResetAlert({ alertConfig, onClose }) {
  return (
    <AlertView
      isVisible={!!alertConfig}
      type={alertConfig?.type}
      message={alertConfig?.message}
      onClose={alertConfig?.onClose || onClose}
    >
      {alertConfig?.children}
    </AlertView>
  )
}
