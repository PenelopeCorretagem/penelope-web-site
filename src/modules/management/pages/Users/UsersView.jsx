import { PageManagementView } from '@management/components/PageManegement/PageManegementView'
import { SectionView } from '@shared/components/layout/Section/SectionView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { AlertView } from '@shared/components/feedback/Alert/AlertView'
import { FilterView } from '@shared/components/ui/Filter/FilterView'
import { SkeletonView } from '@shared/components/ui/Skeleton/SkeletonView'
import { useUsersViewModel } from './useUsersViewModel'
import { useHeaderHeight } from '@shared/hooks/useHeaderHeight'
import { UsersList } from './components/UsersList/UsersList'
import { ACCESS_LEVEL } from '@constant/accessLevels'
import { Plus } from 'lucide-react'
import { useMinLoadingTime } from '@shared/hooks/useMinLoadingTime';

export function UsersView() {
  const {
    users,
    loading,
    error,
    alertConfig,
    userTypeFilter,
    handleEdit,
    handleAdd,
    handleDelete,
    handleCloseAlert,
    handleFiltersChange
  } = useUsersViewModel()

  const headerHeight = useHeaderHeight()
  const isMinLoading = useMinLoadingTime(loading);

  if (isMinLoading) {
    return (
      <div style={{ '--header-height': `${headerHeight}px` }}>
        <SectionView
          className="flex flex-col min-h-[calc(100vh-var(--header-height))] gap-4"
        >
          <SkeletonView className="h-10 w-full mb-8" />
          <SkeletonView className="h-12 w-full" />
          <SkeletonView className="h-12 w-full" />
          <SkeletonView className="h-12 w-full" />
          <SkeletonView className="h-12 w-full" />
        </SectionView>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ '--header-height': `${headerHeight}px` }}>
        <SectionView className="flex items-center justify-center min-h-[calc(100vh-var(--header-height))]">
          <AlertView
            isVisible={true}
            type="error"
            message={error}
            hasCloseButton={false}
            buttonsLayout="col"
            actions={[
              {
                label: 'Tentar novamente',
                onClick: refresh,
                color: 'distac-primary',
              },
            ]}
          />
        </SectionView>
      </div>
    )
  }

  return (
    <div style={{ '--header-height': `${headerHeight}px` }}>
      <PageManagementView
        iconName="Users"
        title="Usuários"
        className="flex flex-col subsection h-[calc(100vh-var !gap-subsection md:!gap-subsection-md"
        headerChildren={(
          <>
            <div className="flex flex-col md:flex-row gap-card md:gap-card-md items-end justify-between w-full">
              <div className="flex-1">
                <FilterView
                  searchPlaceholder="Buscar por nome ou email..."
                  filterConfigs={[
                    {
                      key: 'userTypeFilter',
                      options: [
                        { value: 'TODOS', label: 'Todos os usuários' },
                        { value: ACCESS_LEVEL.ADMINISTRADOR, label: 'Administradores' },
                        { value: ACCESS_LEVEL.CORRETOR, label: 'Corretores' },
                        { value: ACCESS_LEVEL.CLIENTE, label: 'Clientes' }
                      ],
                      width: 'fit',
                      variant: 'brown',
                      shape: 'square',
                      customValue: userTypeFilter,
                      customOnChange: (value) => handleFiltersChange('userTypeFilter', value)
                    }
                  ]}
                  defaultFilters={{ userTypeFilter: 'TODOS' }}
                  defaultSortOrder="none"
                  onFiltersChange={handleFiltersChange}
                  onReset={() => handleFiltersChange('userTypeFilter', 'TODOS')}
                  hasExternalActiveFilters={userTypeFilter !== 'TODOS'}
                  showSortButton={true}
                  hideSearch={false}
                />
              </div>

              <div className="w-full md:w-fit">
                <ButtonView
                  type="button"
                  width="fit"
                  onClick={handleAdd}
                  color="pink"
                  className="whitespace-nowrap"
                >
                  <Plus size={14} className="mr-2" />
                  ADICIONAR USUÁRIO
                </ButtonView>
              </div>
            </div>
          </>
        )}
      >

        <UsersList
          users={users}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />

        <AlertView
          isVisible={!!alertConfig}
          type={alertConfig?.type}
          message={alertConfig?.message}
          onClose={handleCloseAlert}
        />
      </PageManagementView>
    </div>
  )
}
