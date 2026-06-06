export const ACCESS_LEVEL = {
  ADMINISTRADOR: 'ADMINISTRADOR',
  CORRETOR: 'CORRETOR',
  CLIENTE: 'CLIENTE'
}

export const ACCESS_LEVELS = Object.values(ACCESS_LEVEL)

export const normalizeAccessLevel = (value) => {
  const normalized = String(value ?? '').trim().toUpperCase()

  if (['ADMINISTRADOR', 'ADMIN'].includes(normalized)) {
    return ACCESS_LEVEL.ADMINISTRADOR
  }

  if (['CORRETOR', 'BROKER'].includes(normalized)) {
    return ACCESS_LEVEL.CORRETOR
  }

  if (['CLIENTE', 'CLIENT'].includes(normalized)) {
    return ACCESS_LEVEL.CLIENTE
  }

  return ACCESS_LEVEL.CLIENTE
}

export const isAdminAccessLevel = (value) => normalizeAccessLevel(value) === ACCESS_LEVEL.ADMINISTRADOR
export const isBrokerAccessLevel = (value) => normalizeAccessLevel(value) === ACCESS_LEVEL.CORRETOR
export const isClientAccessLevel = (value) => normalizeAccessLevel(value) === ACCESS_LEVEL.CLIENTE
export const isValidAccessLevel = (value) => ACCESS_LEVELS.includes(normalizeAccessLevel(value))

export const getAccessLevelLabel = (value) => {
  const normalized = normalizeAccessLevel(value)

  if (normalized === ACCESS_LEVEL.ADMINISTRADOR) {
    return 'Administrador'
  }

  if (normalized === ACCESS_LEVEL.CORRETOR) {
    return 'Corretor'
  }

  return 'Cliente'
}
