import { RouterModel } from '@app/routes/RouterModel'
import { validateEmail } from '@shared/utils/validateEmailUtil'
import { validatePassword, validatePasswordConfirmation } from '@shared/utils/validatePasswordUtil'

/**
 * AuthModel - Modelo de dados para autenticação
 * Gerencia os campos dos formulários e configurações de cada tipo de auth
 */
export class AuthModel {
  constructor() {
    this.routerModel = RouterModel.getInstance()

    this.authTypes = {
      LOGIN: 'login',
      REGISTER: 'register',
      FORGOT_PASSWORD: 'forgot_password'
    }

    // Usar rotas do RouterModel em vez de hardcoded
    this.routes = {
      [this.authTypes.LOGIN]: this.routerModel.getRoute('LOGIN'),
      [this.authTypes.REGISTER]: this.routerModel.getRoute('REGISTER'),
      [this.authTypes.FORGOT_PASSWORD]: this.routerModel.getRoute('FORGOT_PASSWORD')
    }
  }

  getSignInFields() {
    return [
      {
        name: 'email',
        type: 'email',
        placeholder: 'E-mail:',
        required: true,
        validate: validateEmail
      },
      {
        name: 'senha',
        type: 'password',
        placeholder: 'Senha:',
        required: true,
        showPasswordToggle: true,
      }
    ]
  }

  getSignUpFields() {
    return [
      {
        name: 'nomeCompleto',
        type: 'text',
        placeholder: 'Nome Completo:',
        required: true,
        validate: (value) => {
          if (!value || value.trim().length < 2) {
            return 'Nome completo deve ter pelo menos 2 caracteres'
          }
          if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value.trim())) {
            return 'Nome deve conter apenas letras e espaços'
          }
          const nameParts = value.trim().split(/\s+/)
          if (nameParts.length < 2) {
            return 'Informe nome e sobrenome'
          }
          return true
        }
      },
      {
        name: 'email',
        type: 'email',
        placeholder: 'E-mail:',
        required: true,
        validate: validateEmail
      },
      {
        name: 'senha',
        type: 'password',
        placeholder: 'Senha:',
        required: true,
        showPasswordToggle: true,
        validate: validatePassword
      },
      {
        name: 'confirmSenha',
        type: 'password',
        placeholder: 'Confirmar Senha:',
        required: true,
        showPasswordToggle: true,
        validate: (value, formData) => {
          return validatePasswordConfirmation(formData?.senha, value)
        }
      }
    ]
  }

  getForgotPasswordFields() {
    return [
      {
        name: 'email',
        type: 'email',
        placeholder: 'E-mail:',
        required: true,
        validate: validateEmail
      }
    ]
  }

  getFormConfig(authType) {
    switch (authType) {
      case this.authTypes.LOGIN:
        return {
          title: 'Acessar Conta',
          subtitle: 'Utilize seu email e senha para entrar.',
          fields: this.getSignInFields(),
          submitText: 'Acessar'
        }
      case this.authTypes.REGISTER:
        return {
          title: 'Criar Conta',
          subtitle: 'Preencha os campos para iniciar sua jornada.',
          fields: this.getSignUpFields(),
          submitText: 'Cadastrar'
        }
      case this.authTypes.FORGOT_PASSWORD:
        return {
          title: 'Esqueceu a senha?',
          subtitle: 'Digite seu e-mail abaixo e enviaremos um link para você redefinir sua senha.',
          fields: this.getForgotPasswordFields(),
          submitText: 'Recuperar Senha'
        }
      default:
        return this.getFormConfig(this.authTypes.LOGIN)
    }
  }

  getLeftPanelContent(authType) {
    switch (authType) {
      case this.authTypes.FORGOT_PASSWORD:
        return {
          title: 'Tranquilo,',
          subtitle: 'Vamos te ajudar, informe seus dados para que possamos recuperar sua senha.'
        }
      case this.authTypes.REGISTER:
        return {
          title: 'Já tem conta?',
          subtitle: 'Se você já possui uma conta, faça login para continuar.',
          buttonText: 'Entrar',
          buttonAction: 'login'
        }
      default: // LOGIN
        return {
          title: 'Seja Bem-vindo!',
          subtitle: 'Já tem uma conta? Faça login para continuar.',
          buttonText: 'Entrar',
          buttonAction: 'login'
        }
    }
  }

  getRightPanelContent() {
    return {
      title: 'É novo por aqui?',
      subtitle: 'Clique abaixo e conquiste a chave do seu sonho.',
      buttonText: 'Cadastrar',
      buttonAction: 'register'
    }
  }

  getAuthTypeFromRoute(route) {
    const routeToType = Object.fromEntries(
      Object.entries(this.routes).map(([type, path]) => [path, type])
    )
    return routeToType[route] || this.authTypes.LOGIN
  }

  getRouteFromAuthType(authType) {
    return this.routes[authType] || this.routes[this.authTypes.LOGIN]
  }

  // Novos métodos para integração com RouterModel
  getHomeRoute() {
    return this.routerModel.getRoute('HOME')
  }

  getProfileRoute() {
    return this.routerModel.getRoute('PROFILE')
  }

  getAdminPropertiesRoute() {
    return this.routerModel.getRoute('ADMIN_PROPERTIES')
  }

  isPublicRoute(route) {
    return this.routerModel.getPublicRoutes().includes(route)
  }

  isAuthRequiredRoute(route) {
    return this.routerModel.getAuthRequiredRoutes().includes(route)
  }

  isAdminRequiredRoute(route) {
    return this.routerModel.getAdminRequiredRoutes().includes(route)
  }
}
