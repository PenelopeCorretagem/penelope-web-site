/**
 * AuthModel - Modelo de dados para autenticação
 * Gerencia os campos dos formulários e configurações de cada tipo de auth
 */
export class AuthModel {
  constructor() {
    this.authTypes = {
      LOGIN: 'login',
      REGISTER: 'register',
      FORGOT_PASSWORD: 'forgot_password'
    }

    this.routes = {
      [this.authTypes.LOGIN]: '/login',
      [this.authTypes.REGISTER]: '/registro',
      [this.authTypes.FORGOT_PASSWORD]: '/esqueci-senha'
    }
  }

  getSignInFields() {
    return [
      {
        name: 'email-sign-in',
        type: 'email',
        placeholder: 'E-mail:',
        required: true,
      },
      {
        name: 'senha-sign-in',
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
        name: 'nomeCompleto-sign-up',
        type: 'text',
        placeholder: 'Nome Completo:',
        required: true,
      },
      {
        name: 'email-sign-up',
        type: 'email',
        placeholder: 'E-mail:',
        required: true,
      },
      {
        name: 'senha-sign-up',
        type: 'password',
        placeholder: 'Senha:',
        required: true,
        showPasswordToggle: true,
      }
    ]
  }

  getForgotPasswordFields() {
    return [
      {
        name: 'email-forgot-password',
        type: 'email',
        placeholder: 'E-mail:',
        required: true,
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
          submitText: 'Acessar'
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
          subtitle: 'Vamos te ajudar, informe seus dados para que possamos recuperar sua senha senha.'
        }
      default:
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
}
