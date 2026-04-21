import { useState } from 'react'
import * as LucideIcons from 'lucide-react'
import { Plus, Edit2, Trash2, X } from 'lucide-react'
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
      <div className="flex-1 overflow-hidden flex flex-col bg-white rounded-lg shadow">
        <div className="overflow-x-auto overflow-y-auto flex-1">
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
            <tbody>
              {amenities.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-muted">
                    Nenhum diferencial cadastrado. Clique em "Adicionar Diferencial" para começar.
                  </td>
                </tr>
              ) : (
                amenities.map(amenity => (
                  <tr key={amenity.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
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
                        >
                          <Edit2 size={18} />
                        </ButtonView>
                        <ButtonView
                          onClick={() => handleDelete(amenity.id)}
                          shape="square"
                          width="fit"
                          color="pink"
                          title="Deletar"
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
