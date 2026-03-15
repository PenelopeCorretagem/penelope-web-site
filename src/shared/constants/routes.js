export const ROUTES = {
  // Rotas públicas
  HOME: { key: 'HOME', path: '/', friendlyName: 'Página Inicial' },
  PROPERTIES: { key: 'PROPERTIES', path: '/imoveis', friendlyName: 'Lista de Imóveis' },
  PROPERTY_DETAIL: { key: 'PROPERTY_DETAIL', path: '/imoveis/:id', friendlyName: 'Detalhes do Imóvel' },
  ABOUT: { key: 'ABOUT', path: '/sobre', friendlyName: 'Sobre Nós' },
  CONTACTS: { key: 'CONTACTS', path: '/contatos', friendlyName: 'Contatos' },

  // Autenticação
  LOGIN: { key: 'LOGIN', path: '/login', friendlyName: 'Login' },
  REGISTER: { key: 'REGISTER', path: '/registro', friendlyName: 'Criar Conta' },
  FORGOT_PASSWORD: { key: 'FORGOT_PASSWORD', path: '/esqueci-senha', friendlyName: 'Recuperar Senha' },
  VERIFICATION_CODE: { key: 'VERIFICATION_CODE', path: '/verificacao', friendlyName: 'Código de Verificação' },
  RESET_PASSWORD: { key: 'RESET_PASSWORD', path: '/redefinir-senha', friendlyName: 'Redefinir Senha' },

  // Protegidas - usuário comum
  SCHEDULE: { key: 'SCHEDULE', path: '/agenda', friendlyName: 'Agenda' },
  SCHEDULE_PROPERTY: { key: 'SCHEDULE_PROPERTY', path: '/agenda/:title', friendlyName: 'Agendar Visita' },
  PROFILE: { key: 'PROFILE', path: '/meu-perfil', friendlyName: 'Meu Perfil' },
  ACCOUNT: { key: 'ACCOUNT', path: '/minha-conta', friendlyName: 'Minha Conta' },

  // Admin
  ADMIN: { key: 'ADMIN', path: '/admin', friendlyName: 'Dashboard Admin' },
  ADMIN_PROFILE: { key: 'ADMIN_PROFILE', path: '/admin/meu-perfil', friendlyName: 'Perfil do Admin' },
  ADMIN_ACCOUNT: { key: 'ADMIN_ACCOUNT', path: '/admin/minha-conta', friendlyName: 'Conta do Admin' },
  ADMIN_USERS: { key: 'ADMIN_USERS', path: '/admin/usuarios', friendlyName: 'Gerenciar Usuários' },
  ADMIN_USER_ADD: { key: 'ADMIN_USER_ADD', path: '/admin/usuarios/adicionar', friendlyName: 'Adicionar Usuário' },
  ADMIN_USER_EDIT: { key: 'ADMIN_USER_EDIT', path: '/admin/usuarios/:id/editar', friendlyName: 'Editar Usuário' },
  ADMIN_PROPERTIES: { key: 'ADMIN_PROPERTIES', path: '/admin/gerenciar-imoveis', friendlyName: 'Gerenciar Imóveis' },
  ADMIN_PROPERTIES_CONFIG: { key: 'ADMIN_PROPERTIES_CONFIG', path: '/admin/gerenciar-imoveis/:id', friendlyName: 'Configurar Imóvel' },
  ADMIN_SCHEDULE: { key: 'ADMIN_SCHEDULE', path: '/admin/agenda', friendlyName: 'Agenda Admin' },

  // Erros
  NOT_FOUND: { key: 'NOT_FOUND', path: '/404', friendlyName: 'Página não encontrada' },
  UNAUTHORIZED: { key: 'UNAUTHORIZED', path: '/401', friendlyName: 'Não autorizado' },
  SERVER_ERROR: { key: 'SERVER_ERROR', path: '/500', friendlyName: 'Erro interno do servidor' },
}
