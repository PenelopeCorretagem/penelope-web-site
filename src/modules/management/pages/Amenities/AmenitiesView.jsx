import { useState } from 'react'
import * as LucideIcons from 'lucide-react'
import { Plus, Edit2, Trash2, X } from 'lucide-react'
import { SectionView } from '@shared/components/layout/Section/SectionView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { AlertView } from '@shared/components/feedback/Alert/AlertView'
import { InputView } from '@shared/components/ui/Input/InputView'
import { useAmenitiesViewModel } from './useAmenitiesViewModel'
import { useHeaderHeight } from '@shared/hooks/useHeaderHeight'
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
    handleAdd,
    handleEdit,
    handleDelete,
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
      console.warn(`Erro ao renderizar ícone ${iconName}:`, error)
      return <span className={`text-xs ${isWhite ? 'text-white' : 'text-gray-400'}`}>Erro</span>
    }
  }

  if (loading && amenities.length === 0) {
    return (
      <div style={{ '--header-height': `${headerHeight}px` }}>
        <SectionView className="flex items-center justify-center min-h-[calc(100vh-var(--header-height))]">
          <p className="text-muted">Carregando diferenciais...</p>
        </SectionView>
      </div>
    )
  }

  return (
    <div style={{ '--header-height': `${headerHeight}px` }}>
      <SectionView className="flex flex-col subsection h-[calc(100vh-var(--header-height))] min-h-[calc(100vh-var(--header-height))] max-h-[calc(100vh-var(--header-height))] overflow-hidden !gap-subsection md:!gap-subsection-md">
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
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-default-dark">
                    Ícone
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-default-dark">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-default-dark">
                    Nome do Ícone
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
                      <td className="px-6 py-3 text-default-dark">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-distac-primary">
                          {renderIcon(amenity.icon, true)}
                        </div>
                      </td>
                      <td className="px-6 py-3 text-default-dark font-medium">
                        {amenity.description}
                      </td>
                      <td className="px-6 py-3 text-muted text-sm">
                        {amenity.icon}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(amenity)}
                            className="p-2 text-distac-primary hover:bg-distac-primary hover:text-white rounded transition"
                            title="Editar"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(amenity.id)}
                            className="p-2 text-distac-primary hover:bg-red-50 rounded transition"
                            title="Deletar"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </SectionView>

      {/* Modal de criar/editar */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-default-dark">
                {isEditMode ? 'Editar Diferencial' : 'Adicionar Diferencial'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-1 hover:bg-slate-100 rounded transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {/* Descrição */}
              <div>
                <label className="text-sm font-medium text-default-dark mb-2 block">
                  Descrição
                </label>
                <InputView
                  type="text"
                  placeholder="Ex: Wi-Fi"
                  value={formData.description}
                  onChange={(value) => handleFormChange('description', value)}
                  hasLabel={false}
                  isActive={true}
                />
              </div>

              {/* Seletor de ícone */}
              <div>
                <label className="text-sm font-medium text-default-dark mb-2 block">
                  Ícone
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsIconPickerOpen(true)}
                    className="flex-1 flex items-center gap-3 px-4 py-2 border border-slate-200 rounded-md hover:border-distac-primary transition"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-distac-primary">
                      {renderIcon(formData.icon, true)}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-default-dark">{formData.icon}</p>
                      <p className="text-xs text-muted">Clique para alterar</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 p-6 flex gap-3">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-md font-medium text-default-dark hover:bg-slate-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.description.trim() || loading}
                className="flex-1 px-4 py-2 bg-distac-primary text-white rounded-md font-medium hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Icon Picker Modal */}
      <IconPickerView
        isOpen={isIconPickerOpen}
        onClose={() => setIsIconPickerOpen(false)}
        onSelectIcon={handleSelectIcon}
        currentIcon={formData.icon}
      />
    </div>
  )
}
