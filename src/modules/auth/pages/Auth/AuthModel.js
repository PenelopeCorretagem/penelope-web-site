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
        name: 'email',
        type: 'email',
        placeholder: 'E-mail:',
        required: true,
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
      },
      {
        name: 'email',
        type: 'email',
        placeholder: 'E-mail:',
        required: true,
      },
      {
        name: 'senha',
        type: 'password',
        placeholder: 'Senha:',
        required: true,
        showPasswordToggle: true,
        // Validação robusta: min 8, uppercase, lowercase, digit, special char, no spaces
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
        name: 'confirmSenha',
        type: 'password',
        placeholder: 'Confirmar Senha:',
        required: true,
        showPasswordToggle: true,
        validate: (value, formData) => {
          if (!value) return false
          if (value !== formData.senha) return 'As senhas não coincidem.'
          return true
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
}
