import { InputView } from '@shared/components/ui/Input/InputView'
import { TextAreaView } from '@shared/components/ui/TextArea/TextAreaView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { ErrorDisplayView } from '@shared/components/feedback/ErrorDisplay/ErrorDisplayView'
import { TextView } from '@shared/components/ui/Text/TextView'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { useFormViewModel } from '@shared/components/ui/Form/useFormViewModel'

/**
 * FormView - Componente de formulário genérico
 * Renderiza formulários usando MVVM com campos configuráveis
 *
 * @param {string} title - Título do formulário
 * @param {string} subtitle - Subtítulo do formulário
 * @param {Array} fields - Array de configuração dos campos
 * @param {string} submitText - Texto do botão de submit
 * @param {string} submitWidth - Largura do botão ('full', 'auto')
 * @param {Function} onSubmit - Handler de submit do formulário
 * @param {ReactNode} footerContent - Conteúdo do rodapé
 * @param {Array} initialErrors - Erros iniciais
 * @param {string} initialSuccess - Mensagem de sucesso inicial
 * @param {boolean} initialLoading - Estado inicial de carregamento
 *
 * Estrutura do campo:
 * {
 *   name: string,           // Nome do campo (chave no formData)
 *   type: string,           // Tipo do input
 *   placeholder: string,    // Placeholder
 *   label: string,          // Label (opcional)
 *   defaultValue: string,   // Valor inicial
 *   required: boolean,      // Se é obrigatório
 *   hasLabel: boolean,      // Se mostra label
 *   showPasswordToggle: boolean, // Para campos password
 *   validate: function,     // Função de validação customizada
 *   errorMessage: string,   // Mensagem de erro customizada
 *   onClick: function,      // Handler de clique
 *   ...otherProps          // Outras props para o InputView
 * }
 */
export function FormView({
  title = '',
  subtitle = '',
  fields = [],
  submitText = 'Enviar',
  submitWidth = 'fit',
  onSubmit,
  onChange, // optional external change handler: (fieldName, value)
  footerContent,
  initialErrors = [],
  initialSuccess = '',
  initialLoading = false,
}) {
  const {
    hasTitle,
    hasSubtitle,
    hasErrors,
    hasSuccess,
    hasFooter,
    errorMessages,
    successMessage,
    isLoading,
    formClasses,
    titleClasses,
    subtitleClasses,
    fieldContainerClasses,
    errorContainerClasses,
    successContainerClasses,
    submitButtonClasses,
    footerClasses,
    handleFieldChange,
    handleSubmit,
    getFieldValue,
    getFieldError,
    hasFieldError,
  } = useFormViewModel({
    title,
    subtitle,
    fields,
    submitText,
    submitWidth,
    onSubmit,
    footerContent,
    errorMessages: initialErrors,
    successMessage: initialSuccess,
    isLoading: initialLoading,
  })

  return (
    <form onSubmit={handleSubmit} className={formClasses}>
      {/* Título */}
      {hasTitle && (
        <HeadingView level={1} className={titleClasses}>
          {title}
        </HeadingView>
      )}

      {/* Subtítulo */}
      {hasSubtitle && (
        <TextView className={subtitleClasses}>
          {subtitle}
        </TextView>
      )}

      {/* Campos */}
      {fields.map((field) => (
        <div key={field.name} className={fieldContainerClasses}>
          {field.type === 'textarea' ? (
            <TextAreaView
              id={field.name}
              name={field.name}
              placeholder={field.placeholder || ''}
              value={getFieldValue(field.name)}
              onChange={(value, event) => {
                handleFieldChange(field.name)(value, event)
                if (onChange) onChange(field.name, value, event)
              }}
              onClick={field.onClick}
              hasLabel={field.hasLabel !== undefined ? field.hasLabel : Boolean(field.label)}
              required={field.required || false}
              isActive={!isLoading}
              rows={field.rows || 4}
            >
              {field.label || ''}
            </TextAreaView>
          ) : (
            <InputView
              id={field.name}
              name={field.name}
              type={field.type || 'text'}
              placeholder={field.placeholder || ''}
              value={getFieldValue(field.name)}
              onChange={(value, event) => {
                handleFieldChange(field.name)(value, event)
                if (onChange) onChange(field.name, value, event)
              }}
              onClick={field.onClick}
              hasLabel={field.hasLabel !== undefined ? field.hasLabel : Boolean(field.label)}
              required={field.required || false}
              showPasswordToggle={field.showPasswordToggle || false}
              isActive={!isLoading}
            >
              {field.label || ''}
            </InputView>
          )}

          {/* Erro específico do campo */}
          {hasFieldError(field.name) && (
            <div className="text-red-600 text-sm mt-1">
              {getFieldError(field.name)}
            </div>
          )}
        </div>
      ))}

      {/* Mensagem de sucesso */}
      {hasSuccess && (
        <div className={successContainerClasses}>
          {successMessage}
        </div>
      )}

      {/* Erros gerais */}
      {hasErrors && errorMessages.length > 0 && (
        <div className={errorContainerClasses}>
          <ErrorDisplayView
            messages={errorMessages}
            position="inline"
            variant="prominent"
          />
        </div>
      )}

      {/* Botão de submit – só aparece se submitText for válido */}
      {submitText?.trim() && (
      <ButtonView
        type="submit"
        width={submitWidth}
        disabled={isLoading}
        className={submitButtonClasses}
      >
        {isLoading ? 'Carregando...' : submitText}
      </ButtonView>
      )}


      {/* Rodapé */}
      {hasFooter && (
        <div className={footerClasses}>
          {footerContent}
        </div>
      )}
    </form>
  )
}
