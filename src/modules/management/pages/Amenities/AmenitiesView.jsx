import * as LucideIcons from 'lucide-react'
import { Plus, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { SectionView } from '@shared/components/layout/Section/SectionView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { AlertView } from '@shared/components/feedback/Alert/AlertView'
import { useAmenitiesViewModel } from './useAmenitiesViewModel'
import { AmenitiesFormView } from '@management/components/AmenitiesForm/AmenitiesFormView'
import { IconPickerView } from '@management/components/IconPicker/IconPickerView'
import { isValidIcon } from '@shared/utils/lucideIcons/lucideIconsUtil'
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
    filterModel,
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

  const renderIcon = (iconName, isWhite = false) => {
    if (!isValidIcon(iconName)) {
      return <span className={`text-xs ${isWhite ? 'text-white' : 'text-gray-400'}`}>Sem ícone</span>
    }
    
    try {
      const Icon = LucideIcons[iconName]
      return <Icon size={20} className={isWhite ? 'text-white' : ''} />
    } catch (error) {
      return <span className={`text-xs ${isWhite ? 'text-white' : 'text-gray-400'}`}>Erro</span>
    }
  }


  return (
    <SectionView className="flex flex-col overflow-hidden h-full !gap-subsection md:!gap-subsection-md relative">
      {/* Header com título e botão de adicionar */}
      <div className="flex flex-col gap-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <HeadingView level={2} className="text-distac-primary">
            Diferenciais
          </HeadingView>
          <ButtonView
            variant="distac"
            onClick={handleAdd}
            className="flex items-center gap-2"
            width="fit"
          >
            <Plus size={18} />
            Adicionar Diferencial
          </ButtonView>
        </div>

        {/* Filtros */}
        <div className="flex flex-col gap-3">
          <FilterView
            searchPlaceholder="Buscar diferencial..."
            filterConfigs={[
              {
                key: 'initialFilter',
                options: [
                  { value: 'TODOS', label: 'Letra Inicial: Todas' },
                  ...Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ').map(letter => ({ value: letter, label: letter }))
                ],
                width: 'fit',
                variant: 'brown',
                shape: 'square',
              }
            ]}
            defaultFilters={{ initialFilter: 'TODOS' }}
            defaultSortOrder="none"
            onFiltersChange={handleFiltersChange}
          />
        </div>
      </div>

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
      <div className="flex-1 overflow-hidden flex flex-col bg-white rounded-lg shadow min-h-0">
        {loading && amenities.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted">Carregando diferenciais...</p>
          </div>
        ) : (
          <>
            {/* Header da Tabela (Fixo com compensação de scrollbar) */}
            <div className="bg-slate-50 border-b border-slate-200">
              <div className="overflow-y-scroll invisible">
                <table className="w-full table-fixed visible bg-slate-50">
                  <colgroup>
                    <col className="w-[100px]" />
                    <col className="w-auto" />
                    <col className="w-[160px]" />
                  </colgroup>
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-default-dark border-r border-slate-200">
                        Ícone
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-default-dark border-r border-slate-200">
                        Diferencial
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-default-dark">
                        Ações
                      </th>
                    </tr>
                  </thead>
                </table>
              </div>
            </div>

            <div className="overflow-y-scroll flex-1 min-h-0">
              <table className="w-full table-fixed">
                <colgroup>
                  <col className="w-[100px]" />
                  <col className="w-auto" />
                  <col className="w-[160px]" />
                </colgroup>
                <tbody className="divide-y divide-slate-100">
                  {amenities.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="px-6 py-8 text-center text-muted">
                        Nenhum diferencial cadastrado. Clique em "Adicionar Diferencial" para começar.
                      </td>
                    </tr>
                  ) : (
                    amenities.map(amenity => (
                      <tr key={amenity.id} className="hover:bg-slate-50 transition">
                        <td className="px-6 py-3 text-default-dark border-r border-slate-200">
                          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-distac-primary">
                            {renderIcon(amenity.icon, true)}
                          </div>
                        </td>
                        <td className="px-6 py-3 text-default-dark font-medium border-r border-slate-200">
                          {amenity.description}
                        </td>
                        <td className="px-6 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <ButtonView
                              onClick={() => handleEdit(amenity)}
                              shape="square"
                              width="fit"
                              color="pink"
                              title="Editar"
                              disabled={loading}
                            >
                              <Edit2 size={18} />
                            </ButtonView>
                            <ButtonView
                              onClick={() => handleDelete(amenity.id)}
                              shape="square"
                              width="fit"
                              color="pink"
                              title="Deletar"
                              disabled={loading}
                            >
                              <Trash2 size={18} />
                            </ButtonView>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Rodapé com paginação */}
            {totalPages > 1 && (
              <div className="flex-shrink-0 border-t border-slate-200 bg-slate-50 px-6 py-3 flex items-center justify-between">
                <div className="text-sm text-muted">
                  Página <span className="font-semibold text-default-dark">{currentPage}</span> de{' '}
                  <span className="font-semibold text-default-dark">{totalPages}</span>
                  {totalElements > 0 && (
                    <span className="ml-2 text-xs">
                      ({totalElements} {totalElements === 1 ? 'item' : 'itens'})
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 px-4">
                  <ButtonView
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1 || loading}
                    shape="square"
                    width="fit"
                    color="gray"
                    title="Página anterior"
                  >
                    <ChevronLeft size={18} />
                  </ButtonView>
                  <ButtonView
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages || loading}
                    shape="square"
                    width="fit"
                    color="gray"
                    title="Próxima página"
                  >
                    <ChevronRight size={18} />
                  </ButtonView>
                </div>
              </div>
            )}
          </>
        )}
      </div>

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
    </SectionView>
  )
}
