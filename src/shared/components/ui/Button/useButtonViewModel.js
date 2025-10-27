import { useState, useCallback } from 'react'
import { ButtonModel } from '@shared/components/ui/Button/ButtonModel'
import { getButtonThemeClasses } from '@shared/styles/theme'

/**
 * Hook de ViewModel para o componente de botão.
 *
 * Responsável por integrar o modelo `ButtonModel` com a camada de exibição (`ButtonView`),
 * fornecendo estado reativo, controle de cliques e classes de estilo temático.
 *
 * Implementa a camada **ViewModel** do padrão **MVVM (Model–View–ViewModel)**.
 *
 * @param {string} [text=''] - Texto exibido no botão.
 * @param {string} [color='pink'] - Cor principal.
 * @param {string} [type='button'] - Tipo do botão.
 * @param {Object} [config={}] - Configuração opcional (ex: { onClick }).
 * @param {string|null} [to=null] - Rota associada (para links internos).
 *
 * @returns {Object} Objeto contendo dados do botão, handlers e helpers de estilo.
 */
export function useButtonViewModel(text = '', color = 'pink', type = 'button', config = {}, to = null) {
  /** @type {ButtonModel} Modelo base do botão. */
  const [model] = useState(() => new ButtonModel(text, color, type, to))

  /**
   * Retorna as classes CSS do botão com base em suas propriedades.
   *
   * @function
   * @param {string} [width='full'] - Largura visual (full, auto, etc.).
   * @param {string} [shape='square'] - Formato (square, rounded).
   * @param {string} [className=''] - Classes adicionais.
   * @param {boolean} [disabled=false] - Estado de desabilitado.
   * @param {boolean} [active=false] - Estado ativo.
   * @returns {string} Classes CSS combinadas.
   */
  const getButtonClasses = useCallback((width = 'full', shape = 'square', className = '', disabled = false, active = false) => {
    return getButtonThemeClasses({
      color: model.color,
      active: active || model.active,
      width,
      shape,
      disabled: disabled || model.disabled,
      className,
    })
  }, [model])

  /**
   * Handler de clique do botão.
   *
   * - Impede ação se estiver desabilitado;
   * - Para links, respeita o comportamento padrão de navegação;
   * - Executa callback `onClick` do config.
   *
   * @function
   * @param {MouseEvent} event - Evento de clique.
   */
  const handleClick = useCallback((event) => {
    // Verifica se o botão está desabilitado via props ou modelo
    if (model.disabled || event.currentTarget?.disabled) {
      event.preventDefault()
      return
    }

    if (model.isLink() && model.to) {
      config.onClick?.(event, model)
      return
    }

    config.onClick?.(event, model)
  }, [model, config])

  /**
   * Alterna o estado ativo do botão, se não estiver desabilitado.
   *
   * @function
   * @returns {boolean} `true` se o estado foi alterado, `false` se estava desabilitado.
   */
  const toggle = useCallback(() => {
    if (model.disabled) return false
    model.toggle()
    return true
  }, [model])

  return {
    text: model.text,
    color: model.color,
    type: model.type,
    to: model.to,
    isLink: model.isLink(),
    active: model.active,
    disabled: model.disabled,
    canClick: !model.disabled,
    getButtonClasses,
    handleClick,
    toggle,
  }
}
