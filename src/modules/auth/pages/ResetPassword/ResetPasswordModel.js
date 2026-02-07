/**
 * ResetPasswordModel - Modelo de dados para redefinição de senha
 * Gerencia os campos dos formulários e configurações de cada etapa
 */
import { RouterModel } from '@routes/RouterModel'

export class ResetPasswordModel {
  constructor() {
    this.routerModel = RouterModel.getInstance()

    this.resetTypes = {
      VERIFICATION: 'verification',
      NEW_PASSWORD: 'new_password'
    }

    // Usar rotas do RouterModel central
    this.routes = {
      [this.resetTypes.VERIFICATION]: '/verificacao',
      [this.resetTypes.NEW_PASSWORD]: '/redefinir-senha'
    }
  }

  getVerificationFields() {
    return [
      {
        name: 'token',
        type: 'text',
        placeholder: 'Código de verificação:',
        required: true,
      }
    ]
  }

  getNewPasswordFields() {
    return [
      {
        name: 'newPassword',
        type: 'password',
        placeholder: 'Nova senha:',
        required: true,
        showPasswordToggle: true,
        // Mesma validação robusta do cadastro
        validate: (value) => {
          if (!value) return false
          const rules = []
          if (value.length < 8) rules.push('pelo menos 8 caracteres')
          if (!/[A-Z]/.test(value)) rules.push('uma letra maiúscula')
          if (!/[a-z]/.test(value)) rules.push('uma letra minúscula')
          if (!/\d/.test(value)) rules.push('um número')
          if (!/[!@#$%^&*(),.?"':{}|<>\[\]\\/`~\-_=+;]/.test(value)) rules.push('um caractere especial')
          if (/\s/.test(value)) rules.push('sem espaços em branco')

          if (rules.length === 0) return true
          return `A senha deve conter ${rules.join(', ')}`
        },
      },
      {
        name: 'confirmPassword',
        type: 'password',
        placeholder: 'Confirmar senha:',
        required: true,
        showPasswordToggle: true,
        validate: (value, formData) => {
          if (!value) return false
          if (value !== formData.newPassword) return 'As senhas não coincidem.'
          return true
        }
      }
    ]
  }

  getFormConfig(resetType) {
    switch (resetType) {
      case this.resetTypes.VERIFICATION:
        return {
          title: 'Redefinir Senha',
          subtitle: 'Para recuperar sua senha, por favor, informe seu e-mail de cadastro.',
          fields: this.getVerificationFields(),
          submitText: 'Verificar'
        }
      case this.resetTypes.NEW_PASSWORD:
        return {
          title: 'Nova Senha',
          subtitle: 'Digite sua nova senha e confirme para finalizar.',
          fields: this.getNewPasswordFields(),
          submitText: 'Redefinir Senha'
        }
      default:
        return this.getFormConfig(this.resetTypes.VERIFICATION)
    }
  }

  getLeftPanelContent(resetType) {
    switch (resetType) {
      case this.resetTypes.VERIFICATION:
        return {
          title: 'Primeiro,',
          subtitle: 'Informe o código de verificação que você recebeu em seu e-mail e em sequência clique em "Verificar".'
        }
      case this.resetTypes.NEW_PASSWORD:
        return {
          title: 'Agora,',
          subtitle: 'Digite sua nova senha nos campos ao lado e clique em "Redefinir Senha" para finalizar.'
        }
      default:
        return this.getLeftPanelContent(this.resetTypes.VERIFICATION)
    }
  }

  getRightPanelContent() {
    return {
      title: 'Quase lá!',
      subtitle: 'Siga os passos para redefinir sua senha.',
      buttonText: 'Voltar ao Login',
      buttonAction: 'login'
    }
  }

  getResetTypeFromRoute(route) {
    // Mapear rotas para tipos de reset
    if (route === '/verificacao' || route.startsWith('/verificacao-')) {
      return this.resetTypes.VERIFICATION
    }
    if (route === '/redefinir-senha') {
      return this.resetTypes.NEW_PASSWORD
    }
    return this.resetTypes.VERIFICATION
  }

  getRouteFromResetType(resetType) {
    return this.routes[resetType] || this.routes[this.resetTypes.VERIFICATION]
  }

  // Métodos para integrar com RouterModel central
  getVerificationRoute(token = null) {
    if (token) {
      return this.routerModel.generateRoute('VERIFICATION_CODE', { token })
    }
    return '/verificacao'
  }

  getResetPasswordRoute() {
    return this.routerModel.getRoute('RESET_PASSWORD')
  }

  getLoginRoute() {
    return this.routerModel.getRoute('LOGIN')
  }

  getForgotPasswordRoute() {
    return this.routerModel.getRoute('FORGOT_PASSWORD')
  }
}
