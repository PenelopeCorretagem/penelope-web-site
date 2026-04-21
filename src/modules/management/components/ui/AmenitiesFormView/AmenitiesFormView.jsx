import * as LucideIcons from 'lucide-react'
import { X } from 'lucide-react'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { InputView } from '@shared/components/ui/Input/InputView'
import { isValidIcon } from '@management/utils/lucideIconsUtil'

/**
 * AmenitiesFormView - Modal para criar/editar amenities
 *
 * RESPONSABILIDADES:
 * - Exibir formulário de criação/edição de amenities
 * - Gerenciar inputs do formulário
 * - Disparar abertura do icon picker (renderizado no parent)
 *
 * O IconPickerView é renderizado no AmenitiesView (parent),
 * não dentro deste componente.
 */
export function AmenitiesFormView({
  isOpen,
  isEditMode,
  formData,
  loading,
  onClose,
  onFormChange,
  onSave,
  onIconPickerOpen,
}) {
  const renderIcon = (iconName, isWhite = false, additionalClass = '') => {
    if (!isValidIcon(iconName)) {
      return <span className={`text-xs ${isWhite ? 'text-white' : 'text-gray-400'} ${additionalClass}`}>Sem ícone</span>
    }

    try {
      const Icon = LucideIcons[iconName]
      return <Icon size={20} className={`${isWhite ? 'text-white' : ''} ${additionalClass}`} />
    } catch (error) {
      return <span className={`text-xs ${isWhite ? 'text-white' : 'text-gray-400'} ${additionalClass}`}>Erro</span>
    }
  }

  if (!isOpen) return null

  return (
    <div className="absolute top-0 left-0 w-full h-full z-40 flex items-center justify-center">
      <div className="bg-default-dark opacity-70 w-full h-full" />

      <div className="bg-default-light opacity-100 rounded-lg shadow-lg max-w-md w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-default-dark-light p-6">
          <h3 className="text-lg font-semibold text-default-dark">
            {isEditMode ? 'Editar Diferencial' : 'Adicionar Diferencial'}
          </h3>
          <ButtonView
            onClick={onClose}
            shape="square"
            width="fit"
            color="white"
          >
            <X size={20} />
          </ButtonView>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Diferencial */}
          <div>
            <label className="text-sm font-medium text-default-dark mb-2 block">
              Diferencial <span className="text-distac-primary">*</span>
            </label>
            <InputView
              type="text"
              placeholder=""
              value={formData.description}
              onChange={(value) => onFormChange('description', value)}
              hasLabel={false}
              isActive={true}
            />
          </div>

          {/* Seletor de ícone */}
          <div>
            <label className="text-sm font-medium text-default-dark mb-2 block">
              Ícone <span className="text-distac-primary">*</span>
            </label>
            <div className="flex items-center gap-3">
              <ButtonView
                onClick={onIconPickerOpen}
                color="white"
                className="flex-1 !justify-start group"
                width="full"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-distac-primary group-hover:bg-white transition">
                  {renderIcon(formData.icon, true, 'group-hover:text-distac-primary')}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-default-dark">{formData.icon}</p>
                  <p className="text-xs text-muted">Clique para alterar</p>
                </div>
              </ButtonView>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-6 flex gap-3">
          <ButtonView
            onClick={onClose}
            color="white"
            width="full"
          >
            Cancelar
          </ButtonView>
          <ButtonView
            onClick={onSave}
            disabled={!formData.description.trim() || loading}
            width="full"
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </ButtonView>
        </div>
      </div>
    </div>
  )
}
