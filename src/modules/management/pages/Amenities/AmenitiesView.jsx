import { Plus } from 'lucide-react'
import { PageManagementView } from '@management/components/layout/PageManegement/PageManegementView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { AlertView } from '@shared/components/feedback/Alert/AlertView'
import { useAmenitiesViewModel } from './useAmenitiesViewModel'
import { AmenitiesFormView } from './components/AmenitiesForm/AmenitiesFormView'
import { IconPickerView } from './components/IconPicker/IconPickerView'
import { AmenitiesTableView } from './components/AmenitiesTable/AmenitiesTableView'
import { FilterView } from '@shared/components/layout/Filter/FilterView'

/**
 * AmenitiesView - Tela de gerenciamento de amenities/comodidades
 *
 * RESPONSABILIDADES:
 * - Exibir lista de amenities
 * - Permitir CRUD de amenities
 * - Permitir seleção de ícones
 */
export function AmenitiesView() {
  const {
    amenities,
    loading,
    error,
    isModalOpen,
    isEditMode,
    formData,
    isIconPickerOpen,
    isConfirmDeleteOpen,
    formAlertConfig,
    currentPage,
    totalPages,
    totalElements,
    handleAdd,
    handleEdit,
    handleDelete,
    handleConfirmDelete,
    handleCancelDelete,
    handleCloseModal,
    handleCloseError,
    handleFormChange,
    handleSave,
    handleSelectIcon,
    handleCloseFormAlert,
    setIsIconPickerOpen,
    handlePreviousPage,
    handleNextPage,
    handleFiltersChange,
  } = useAmenitiesViewModel()

  return (
    <PageManagementView
      iconName="Star"
      title="Diferenciais"
      className="flex flex-col overflow-hidden h-full !gap-subsection md:!gap-subsection-md relative"
      headerChildren={(
        <>
          <FilterView
            searchPlaceholder="Buscar diferencial..."
            filterConfigs={[]}
            defaultFilters={{}}
            defaultSortOrder="none"
            onFiltersChange={handleFiltersChange}
          />

          <ButtonView
            variant="distac"
            onClick={handleAdd}
            className="flex items-center gap-2 whitespace-nowrap"
            width="fit"
          >
            <Plus size={14} />
            <span>Adicionar Diferencial</span>
          </ButtonView>
        </>
      )}
    >
      {/* Alertas */}
      {error && (
        <AlertView
          isVisible={!!error}
          type="error"
          message={error}
          onClose={handleCloseError}
          hasCloseButton={true}
        />
      )}

      {/* Tabela de amenities */}
      <AmenitiesTableView
        amenities={amenities}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        totalElements={totalElements}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
      />

      {/* Modal de criar/editar */}
      <AmenitiesFormView
        isOpen={isModalOpen}
        isEditMode={isEditMode}
        formData={formData}
        loading={loading}
        onClose={handleCloseModal}
        onFormChange={handleFormChange}
        onSave={handleSave}
        onIconPickerOpen={() => setIsIconPickerOpen(true)}
      />

      <AlertView
        isVisible={!!formAlertConfig}
        type={formAlertConfig?.type || 'warning'}
        message={formAlertConfig?.message || 'Não foi possível salvar o diferencial.'}
        onClose={handleCloseFormAlert}
        hasCloseButton={true}
      />

      {/* Icon Picker Modal */}
      <IconPickerView
        isOpen={isIconPickerOpen}
        onClose={() => setIsIconPickerOpen(false)}
        onSelectIcon={handleSelectIcon}
        currentIcon={formData.icon}
      />

      {/* Confirmation Delete Alert */}
      <AlertView
        isVisible={isConfirmDeleteOpen}
        type="warning"
        message="Tem certeza que deseja deletar este diferencial? Esta ação não poderá ser desfeita."
        hasCloseButton={true}
        buttonsLayout="row"
        onClose={handleCancelDelete}
      >
        <ButtonView
          variant="danger"
          onClick={handleConfirmDelete}
          disabled={loading}
          width="fit"
        >
          {loading ? 'Deletando...' : 'Deletar'}
        </ButtonView>
      </AlertView>
    </PageManagementView>
  )
}
