import { SectionView } from '@shared/components/layout/Section/SectionView'
import { EditFormView } from '@shared/components/ui/EditForm/EditFormView'
import { BackButtonView } from '@shared/components/ui/BackButton/BackButtonView'
import { AlertView } from '@shared/components/feedback/Alert/AlertView'
import { useUserConfigViewModel } from './useUserConfigViewModel'
import { useHeaderHeight } from '@shared/hooks/useHeaderHeight'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { useNavigate } from 'react-router-dom'

export function UserConfigView() {
  const {
    selectedUser,
    userConfigFields,
    alertConfig,
    loading,
    isEditMode,
    handleSubmit,
    handleDelete,
    handleCloseAlert
  } = useUserConfigViewModel()

  const headerHeight = useHeaderHeight()
  const navigate = useNavigate()

  // Clean cancel function for UserConfig - always goes back
  const handleCancelUserConfig = () => {
    navigate(-1)
  }

  if (loading) {
    return (
      <div style={{ '--header-height': `${headerHeight}px` }}>
        <SectionView
          className="flex items-center justify-center min-h-[calc(100vh-var(--header-height))]"
        >
          Carregando...
        </SectionView>
      </div>
    )
  }

  return (
    <div style={{ '--header-height': `${headerHeight}px` }}>
      <SectionView
        className="flex flex-col subsection h-[calc(100vh-var(--header-height))] min-h-[calc(100vh-var(--header-height))] max-h-[calc(100vh-var(--header-height))] overflow-hidden !gap-subsection md:!gap-subsection-md"
      >
        <div className="flex items-center w-full justify-between flex-shrink-0">
          <HeadingView level={2} className="text-distac-primary">
            {isEditMode ? 'Editar Usuário' : 'Adicionar Usuário'}
          </HeadingView>
          <BackButtonView mode="text" text="Voltar" />
        </div>

        <div className="flex-1 overflow-hidden">
          <EditFormView
            fields={userConfigFields}
            initialData={selectedUser || {}}
            onSubmit={handleSubmit}
            onCancel={handleCancelUserConfig}
            isEditing={true}
            showDeleteButton={isEditMode}
            onDelete={isEditMode ? handleDelete : undefined}
          />
        </div>

        <AlertView
          isVisible={!!alertConfig}
          type={alertConfig?.type}
          message={alertConfig?.message}
          onClose={handleCloseAlert}
        />
      </SectionView>
    </div>
  )
}
