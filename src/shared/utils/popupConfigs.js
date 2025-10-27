import { RouterModel } from '@routes/RouterModel'

/**
 * PopupConfigs - Factory functions para gerar configurações específicas de popup
 * Retorna objetos de configuração que são passados como props para o PopupView
 */

const routerModel = RouterModel.getInstance()

// Configuração base para ações de texto + link
const createTextAction = (text, actionText, type, config = {}) => ({
  text,
  actionText,
  type,
  color: 'text-distac-primary',
  hoverEffect: 'hover:underline',
  ...config
})

// Configuração base para botões
const createButton = (text, type, config = {}) => ({
  text,
  type,
  variant: 'primary',
  className: '',
  ...config
})

/**
 * Configuração para popup de confirmação de email
 */
export function createConfirmEmailConfig(customConfig = {}) {
  return {
    title: 'Enviamos um e-mail de confirmação, por favor, valide seu cadastro!',
    subtitle: null,
    textColor: 'text-gray-800',
    titleSize: 'text-4xl',
    actions: [
      createTextAction(
        'NÃO RECEBEU O E-MAIL?',
        'REENVIAR',
        'callback',
        { callbackKey: 'onResendEmail' }
      ),
      createTextAction(
        'JÁ CONFIRMOU?',
        'ACESSAR',
        'navigate',
        { route: routerModel.get('LOGIN') }
      )
    ],
    buttons: [],
    showCloseButton: false,
    ...customConfig
  }
}

/**
 * Configuração para popup de email já existente
 */
export function createEmailExistsConfig(customConfig = {}) {
  return {
    title: 'O E-MAIL INFORMADO JÁ ESTÁ CADASTRADO NO NOSSO SISTEMA.',
    subtitle: null,
    textColor: 'text-gray-800',
    titleSize: 'text-4xl',
    actions: [
      createTextAction(
        'ESQUECEU A SENHA?',
        'REDEFINIR SENHA',
        'navigate',
        { route: routerModel.get('FORGOT_PASSWORD') }
      ),
      createTextAction(
        'LEMBROU?',
        'ACESSAR',
        'navigate',
        { route: routerModel.get('LOGIN') }
      )
    ],
    buttons: [],
    showCloseButton: false,
    ...customConfig
  }
}

/**
 * Configuração para popup de link de recuperação enviado
 */
export function createRecoveryLinkSentConfig(customConfig = {}) {
  return {
    title: 'Você receberá em breve uma mensagem com as instruções para redefinir sua senha.',
    subtitle: null,
    textColor: 'text-gray-800',
    titleSize: 'text-4xl',
    actions: [
      createTextAction(
        'NÃO RECEBEU O E-MAIL?',
        'REENVIAR',
        'callback',
        { callbackKey: 'onResendEmail' }
      ),
      createTextAction(
        'JÁ REDEFINIU A SENHA?',
        'ACESSAR',
        'navigate',
        { route: routerModel.get('LOGIN') }
      )
    ],
    buttons: [],
    showCloseButton: false,
    ...customConfig
  }
}

/**
 * Configuração para popup de senha alterada com sucesso
 */
export function createPasswordChangedConfig(customConfig = {}) {
  return {
    title: 'Senha alterada com sucesso!',
    subtitle: null,
    textColor: 'text-gray-800',
    titleSize: 'text-4xl',
    actions: [],
    buttons: [
      createButton(
        'IR PARA O LOGIN',
        'navigate',
        {
          variant: 'destac',
          route: routerModel.get('LOGIN'),
          className: 'mt-8'
        }
      )
    ],
    showCloseButton: false,
    ...customConfig
  }
}

/**
 * Configuração para popup customizado básico
 */
export function createCustomPopupConfig(config = {}) {
  return {
    title: config.title || 'Popup',
    subtitle: config.subtitle || null,
    textColor: config.textColor || 'text-gray-800',
    titleSize: config.titleSize || 'text-4xl',
    actions: config.actions || [],
    buttons: config.buttons || [],
    showCloseButton: config.showCloseButton !== false,
    ...config
  }
}

/**
 * Factory function genérica que permite criar qualquer configuração
 */
export function createPopupConfig(type, customConfig = {}) {
  switch (type) {
    case 'confirm_email':
      return createConfirmEmailConfig(customConfig)
    case 'email_exists':
      return createEmailExistsConfig(customConfig)
    case 'recovery_link_sent':
      return createRecoveryLinkSentConfig(customConfig)
    case 'password_changed':
      return createPasswordChangedConfig(customConfig)
    case 'custom':
    default:
      return createCustomPopupConfig(customConfig)
  }
}

// Utilitários para criação rápida de ações e botões
export const popupUtils = {
  createTextAction,
  createButton,
  createNavigateAction: (text, actionText, route) =>
    createTextAction(text, actionText, 'navigate', { route }),
  createCallbackAction: (text, actionText, callbackKey) =>
    createTextAction(text, actionText, 'callback', { callbackKey }),
  createNavigateButton: (text, route, variant = 'primary') =>
    createButton(text, 'navigate', { route, variant }),
  createCallbackButton: (text, callbackKey, variant = 'primary') =>
    createButton(text, 'callback', { callbackKey, variant })
}
