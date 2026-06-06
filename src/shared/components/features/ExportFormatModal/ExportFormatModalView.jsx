import { X } from 'lucide-react'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { TextView } from '@shared/components/ui/Text/TextView'

export function ExportFormatModalView({
  isOpen = false,
  onClose = () => {},
  onConfirm = () => {},
  isLoading = false,
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-default-dark/70 p-4">
      <button
        type="button"
        className="absolute inset-0 bg-transparent"
        onClick={onClose}
        aria-label="Fechar modal de exportação"
      />

      <div
        className="relative w-full max-w-md rounded-3xl bg-default-light shadow-2xl overflow-hidden"
      >
        <div className="flex items-baseline justify-between p-10 pb-4 border-b border-default-light-muted">
          <HeadingView level={3} className="text-distac-primary">
            Exportar agendamentos
          </HeadingView>
          <button
            type="button"
            onClick={onClose}
            className="text-default-dark hover:text-distac-primary transition"
            aria-label="Fechar modal de exportação"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-10 pt-4 space-y-4">
          <TextView>
            Selecione o formato do arquivo que deseja baixar.
          </TextView>

          <div className="grid gap-3">
            <ButtonView
              type="button"
              color="pink"
              width="full"
              onClick={() => onConfirm('xlsx')}
              disabled={isLoading}
            >
              Planilha Excel (.xlsx)
            </ButtonView>
            <ButtonView
              type="button"
              color="soft-gray"
              width="full"
              onClick={() => onConfirm('csv')}
              disabled={isLoading}
            >
              Arquivo CSV (.csv)
            </ButtonView>
          </div>

          <ButtonView
            type="button"
            color="white"
            width="full"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </ButtonView>
        </div>
      </div>
    </div>
  )
}
