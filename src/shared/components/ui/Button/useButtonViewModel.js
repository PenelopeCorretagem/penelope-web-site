import { useState, useCallback } from 'react'
import { ButtonModel } from '@shared/components/ui/Button/ButtonModel'

/**
 * Hook de ViewModel para o componente de botão.
 *
 * Responsável por integrar o modelo `ButtonModel` com a camada de exibição (`ButtonView`),
 * fornecendo estado reativo e controle de cliques.
 *
 * **NÃO contém lógica de estilização** - isso é responsabilidade da View.
 *
 * Implementa a camada **ViewModel** do padrão **MVVM (Model–View–ViewModel)**.
 *
 * @param {string} [text=''] - Texto exibido no botão.
 * @param {string} [color='pink'] - Cor principal.
 * @param {string} [type='button'] - Tipo do botão.
 * @param {Object} [config={}] - Configuração opcional (ex: { onClick }).
 * @param {string|null} [to=null] - Rota associada (para links internos).
 * @param {string} [shape='rectangle'] - Forma do botão (rectangle, square, circle).
 * @param {string} [title=''] - Título do botão (tooltip/acessibilidade).
 *
 * @returns {Object} Objeto contendo dados do botão e handlers.
 */
export function useButtonViewModel(text = '', color = 'pink', type = 'button', config = {}, to = null, shape = 'rectangle', title = '') {
  /** @type {ButtonModel} Modelo base do botão. */
  const [model] = useState(() => new ButtonModel(text, color, type, to, shape, title))

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

  // Retorna apenas dados e comportamento - SEM lógica de estilo
  return {
    text: model.text,
    color: model.color,
    type: model.type, // Mantém o tipo original do modelo
    to: model.to,
    shape: model.shape,
    title: model.title,
    isLink: model.isLink(),
    active: model.active,
    disabled: model.disabled,
    canClick: !model.disabled,
    handleClick,
    toggle,
  }
}
