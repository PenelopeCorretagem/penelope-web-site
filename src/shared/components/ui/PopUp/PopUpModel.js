/**
 * PopUpModel - Modelo de dados para componente Popup
 * Define estrutura, configurações padrão e validações
 */
export class PopUpModel {
  constructor() {
    // Configurações padrão do popup
    this.defaultConfig = {
      isOpen: false,
      title: null,
      showCloseButton: true,
      maxWidth: '500px',
      className: '',
      overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
        padding: '20px'
      },
      content: {
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '30px',
        border: '4px solid #6B2C8E',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      },
      closeButton: {
        color: '#B84899',
        fontSize: '24px',
        size: '30px'
      },
      titleStyle: {
        fontSize: '18px',
        color: '#333',
        borderColor: '#B84899'
      }
    }

    // Estados possíveis do popup
    this.states = {
      CLOSED: 'closed',
      OPEN: 'open',
      OPENING: 'opening',
      CLOSING: 'closing'
    }
  }

  /**
   * Valida as props passadas para o popup
   */
  validateProps(props) {
    const errors = []

    if (props.isOpen !== undefined && typeof props.isOpen !== 'boolean') {
      errors.push('isOpen deve ser um boolean')
    }

    if (props.title !== undefined && props.title !== null && typeof props.title !== 'string') {
      errors.push('title deve ser string ou null')
    }

    if (props.showCloseButton !== undefined && typeof props.showCloseButton !== 'boolean') {
      errors.push('showCloseButton deve ser um boolean')
    }

    if (props.maxWidth !== undefined && typeof props.maxWidth !== 'string') {
      errors.push('maxWidth deve ser uma string (ex: "500px", "50%")')
    }

    if (props.onClose !== undefined && typeof props.onClose !== 'function') {
      errors.push('onClose deve ser uma função')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Mescla configurações customizadas com padrões
   */
  mergeConfig(customConfig = {}) {
    return {
      ...this.defaultConfig,
      ...customConfig,
      overlay: {
        ...this.defaultConfig.overlay,
        ...(customConfig.overlay || {})
      },
      content: {
        ...this.defaultConfig.content,
        ...(customConfig.content || {})
      },
      closeButton: {
        ...this.defaultConfig.closeButton,
        ...(customConfig.closeButton || {})
      },
      titleStyle: {
        ...this.defaultConfig.titleStyle,
        ...(customConfig.titleStyle || {})
      }
    }
  }

  /**
   * Verifica se um estado é válido
   */
  isValidState(state) {
    return Object.values(this.states).includes(state)
  }

  /**
   * Retorna as classes CSS padrão
   */
  getDefaultClasses() {
    return {
      overlay: 'popup-overlay',
      content: 'popup-content',
      closeButton: 'popup-close-button',
      title: 'popup-title',
      body: 'popup-body'
    }
  }

  /**
   * Gera estilos inline baseados na configuração
   */
  generateStyles(config) {
    return {
      overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: config.overlay.backgroundColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: config.overlay.zIndex,
        padding: config.overlay.padding
      },
      content: {
        backgroundColor: config.content.backgroundColor,
        borderRadius: config.content.borderRadius,
        padding: config.content.padding,
        maxWidth: config.maxWidth,
        width: '100%',
        position: 'relative',
        boxShadow: config.content.boxShadow,
        border: config.content.border
      },
      closeButton: {
        position: 'absolute',
        top: '15px',
        right: '15px',
        background: 'none',
        border: 'none',
        fontSize: config.closeButton.fontSize,
        cursor: 'pointer',
        color: config.closeButton.color,
        padding: '0',
        width: config.closeButton.size,
        height: config.closeButton.size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold'
      },
      title: {
        margin: '0 0 20px 0',
        textAlign: 'center',
        fontSize: config.titleStyle.fontSize,
        fontWeight: 'bold',
        color: config.titleStyle.color,
        paddingBottom: '15px',
        borderBottom: `2px dotted ${config.titleStyle.borderColor}`
      }
    }
  }
}
