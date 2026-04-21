import { useState } from 'react'
import * as LucideIcons from 'lucide-react'
import { Plus, Edit2, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { SectionView } from '@shared/components/layout/Section/SectionView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { AlertView } from '@shared/components/feedback/Alert/AlertView'
import { useAmenitiesViewModel } from './useAmenitiesViewModel'
import { useHeaderHeight } from '@shared/hooks/useHeaderHeight'
import { AmenitiesFormView } from '../../components/ui/AmenitiesFormView/AmenitiesFormView'
import { IconPickerView } from '@management/components/IconPicker/IconPickerView'
import { isValidIcon } from '@management/utils/lucideIconsUtil'

/**
 * AmenitiesView - Tela de gerenciamento de amenities/comodidades
 *
 * RESPONSABILIDADES:
 * - Exibir lista de amenities
 * - Permitir CRUD de amenities
 * - Permitir seleção de ícones
 */
export function AmenitiesView() {
  const headerHeight = useHeaderHeight()
  const {
    amenities,
    loading,
    error,
    isModalOpen,
    isEditMode,
    formData,
    isIconPickerOpen,
    isConfirmDeleteOpen,
    currentPage,
    pageSize,
    totalPages,
    totalElements,
    handleAdd,
    handleEdit,
    handleDelete,
    handleConfirmDelete,
    handleCancelDelete,
    handleCloseModal,
    handleFormChange,
    handleSave,
    handleSelectIcon,
    setIsIconPickerOpen,
    handlePreviousPage,
    handleNextPage,
    handleGoToPage,
    handlePageSizeChange,
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
      <div className="flex items-center justify-between flex-shrink-0">
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

      {/* Alertas */}
      {error && (
        <AlertView variant="error" className="flex-shrink-0">
          {error}
        </AlertView>
      )}

      {/* Tabela de amenities */}
      <div className="flex-1 overflow-hidden flex flex-col bg-white rounded-lg shadow min-h-0">
        {loading && amenities.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted">Carregando diferenciais...</p>
          </div>
        ) : (
          <>
            <div className="overflow-y-auto flex-1 min-h-0">
              <table className="w-full">
                <colgroup>
                  <col style={{ width: 'auto' }} />
                  <col style={{ width: '100%' }} />
                  <col style={{ width: 'auto' }} />
                </colgroup>
                <thead className="sticky top-0 bg-slate-50 border-b border-slate-200">
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
                <div className="flex items-center gap-2">
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
