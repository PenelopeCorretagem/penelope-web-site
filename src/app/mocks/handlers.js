import { rest } from 'msw'
import users from './data/users.json'
import advertisements from './data/advertisements.json'
import amenities from './data/amenities.json'
import appointments from './data/appointments.json'
import contactMessages from './data/contactUs.json'
import images from './data/images.json'
import imageTypes from './data/imageTypes.json'

// Handler genérico que extrai ID de uma URL com padrão /resource/:id
function findById(array, id) {
  return array.find(item => String(item.id) === String(id)) || null
}

export const handlers = [
  // ==================== USERS ====================
  rest.get(/\/users$/, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(users))
  }),
  rest.get(/\/users\/(\d+)$/, (req, res, ctx) => {
    const { '0': id } = req.params
    const item = findById(users, id)
    return item ? res(ctx.status(200), ctx.json(item)) : res(ctx.status(404))
  }),
  rest.post(/\/users$/, (req, res, ctx) => {
    const newUser = {
      id: Math.max(...users.map(u => u.id)) + 1,
      ...req.body,
      active: true
    }
    users.push(newUser)
    return res(ctx.status(201), ctx.json(newUser))
  }),
  rest.patch(/\/users\/(\d+)$/, (req, res, ctx) => {
    const id = req.params['0']
    const idx = users.findIndex(u => String(u.id) === String(id))
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...req.body }
      return res(ctx.status(200), ctx.json(users[idx]))
    }
    return res(ctx.status(404))
  }),
  rest.delete(/\/users\/(\d+)$/, (req, res, ctx) => {
    const id = req.params['0']
    const idx = users.findIndex(u => String(u.id) === String(id))
    if (idx !== -1) {
      users.splice(idx, 1)
      return res(ctx.status(204))
    }
    return res(ctx.status(404))
  }),

  // ==================== ADVERTISEMENTS ====================
  rest.get(/\/advertisements$/, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(advertisements))
  }),
  rest.get(/\/advertisements\/(\d+)$/, (req, res, ctx) => {
    const { '0': id } = req.params
    const item = findById(advertisements, id)
    return item ? res(ctx.status(200), ctx.json(item)) : res(ctx.status(404))
  }),
  rest.post(/\/advertisements$/, (req, res, ctx) => {
    const newAd = {
      id: Math.max(...advertisements.map(a => a.id)) + 1,
      ...req.body,
      active: true,
      createdAt: new Date().toISOString()
    }
    advertisements.push(newAd)
    return res(ctx.status(201), ctx.json(newAd))
  }),
  rest.put(/\/advertisements\/(\d+)$/, (req, res, ctx) => {
    const id = req.params['0']
    const idx = advertisements.findIndex(a => String(a.id) === String(id))
    if (idx !== -1) {
      advertisements[idx] = { ...advertisements[idx], ...req.body }
      return res(ctx.status(200), ctx.json(advertisements[idx]))
    }
    return res(ctx.status(404))
  }),
  rest.patch(/\/advertisements\/(\d+)$/, (req, res, ctx) => {
    const id = req.params['0']
    const idx = advertisements.findIndex(a => String(a.id) === String(id))
    if (idx !== -1) {
      advertisements[idx] = { ...advertisements[idx], ...req.body }
      return res(ctx.status(200), ctx.json(advertisements[idx]))
    }
    return res(ctx.status(404))
  }),

  // ==================== AMENITIES ====================
  rest.get(/\/amenities$/, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(amenities))
  }),
  rest.get(/\/amenities\/(\d+)$/, (req, res, ctx) => {
    const id = req.params['0']
    const item = findById(amenities, id)
    return item ? res(ctx.status(200), ctx.json(item)) : res(ctx.status(404))
  }),
  rest.post(/\/amenities$/, (req, res, ctx) => {
    const newAmenity = {
      id: Math.max(...amenities.map(a => a.id)) + 1,
      ...req.body
    }
    amenities.push(newAmenity)
    return res(ctx.status(201), ctx.json(newAmenity))
  }),
  rest.patch(/\/amenities\/(\d+)$/, (req, res, ctx) => {
    const id = req.params['0']
    const idx = amenities.findIndex(a => String(a.id) === String(id))
    if (idx !== -1) {
      amenities[idx] = { ...amenities[idx], ...req.body }
      return res(ctx.status(200), ctx.json(amenities[idx]))
    }
    return res(ctx.status(404))
  }),
  rest.delete(/\/amenities\/(\d+)$/, (req, res, ctx) => {
    const id = req.params['0']
    const idx = amenities.findIndex(a => String(a.id) === String(id))
    if (idx !== -1) {
      amenities.splice(idx, 1)
      return res(ctx.status(204))
    }
    return res(ctx.status(404))
  }),

  // ==================== APPOINTMENTS ====================
  rest.get(/\/appointments$/, (req, res, ctx) => {
    const page = req.url.searchParams.get('page') || '0'
    const size = req.url.searchParams.get('size') || '10'
    const pageNum = parseInt(page)
    const pageSize = parseInt(size)
    const start = pageNum * pageSize
    const end = start + pageSize
    const content = appointments.slice(start, end)
    return res(ctx.status(200), ctx.json({
      content,
      pageable: {
        pageNumber: pageNum,
        pageSize,
        totalElements: appointments.length,
        totalPages: Math.ceil(appointments.length / pageSize)
      }
    }))
  }),
  rest.get(/\/appointments\/(\d+)$/, (req, res, ctx) => {
    const id = req.params['0']
    const item = findById(appointments, id)
    return item ? res(ctx.status(200), ctx.json(item)) : res(ctx.status(404))
  }),
  rest.patch(/\/appointments\/(\d+)\/reschedule$/, (req, res, ctx) => {
    const id = req.params['0']
    const idx = appointments.findIndex(a => String(a.id) === String(id))
    if (idx !== -1) {
      appointments[idx] = { ...appointments[idx], ...req.body, updatedAt: new Date().toISOString() }
      return res(ctx.status(200), ctx.json(appointments[idx]))
    }
    return res(ctx.status(404))
  }),
  rest.post(/\/appointments\/(\d+)\/cancel$/, (req, res, ctx) => {
    const id = req.params['0']
    const idx = appointments.findIndex(a => String(a.id) === String(id))
    if (idx !== -1) {
      const reason = req.url.searchParams.get('reason')
      appointments[idx] = { ...appointments[idx], status: 'CANCELADO', updatedAt: new Date().toISOString() }
      return res(ctx.status(200), ctx.json({
        message: 'Agendamento cancelado com sucesso',
        appointmentId: Number(id),
        calBookingId: appointments[idx].calBookingId || null,
        reason: reason || null
      }))
    }
    return res(ctx.status(404))
  }),
  rest.post(/\/appointments\/(\d+)\/confirm$/, (req, res, ctx) => {
    return res(ctx.status(405), ctx.json({ error: 'Método não permitido - Use Cal.com para confirmar' }))
  }),
  rest.post(/\/appointments\/(\d+)\/complete$/, (req, res, ctx) => {
    return res(ctx.status(405), ctx.json({ error: 'Método não permitido - Use Cal.com para finalizar' }))
  }),

  // ==================== CONTACT US ====================
  rest.post(/\/contact-us$/, (req, res, ctx) => {
    const newMessage = {
      id: (contactMessages.length > 0 ? Math.max(...contactMessages.map(m => m.id)) : 0) + 1,
      ...req.body
    }
    contactMessages.push(newMessage)
    return res(ctx.status(200), ctx.json({ message: 'Mensagem enviada com sucesso' }))
  }),
  rest.get(/\/contact-us$/, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(contactMessages))
  }),

  // ==================== IMAGES ====================
  rest.get(/\/imagens$/, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(images))
  }),
  rest.get(/\/imagens\/(\d+)$/, (req, res, ctx) => {
    const id = req.params['0']
    const item = findById(images, id)
    return item ? res(ctx.status(200), ctx.json(item)) : res(ctx.status(404))
  }),
  rest.put(/\/imagens\/(\d+)$/, (req, res, ctx) => {
    const id = req.params['0']
    const idx = images.findIndex(i => String(i.id) === String(id))
    if (idx !== -1) {
      images[idx] = { ...images[idx], ...req.body }
      return res(ctx.status(200), ctx.json(images[idx]))
    }
    return res(ctx.status(404))
  }),
  rest.delete(/\/imagens\/(\d+)$/, (req, res, ctx) => {
    const id = req.params['0']
    const idx = images.findIndex(i => String(i.id) === String(id))
    if (idx !== -1) {
      images.splice(idx, 1)
      return res(ctx.status(204))
    }
    return res(ctx.status(404))
  }),
  rest.get(/\/tipos-imagem$/, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(imageTypes))
  }),
  rest.get(/\/tipos-imagem\/(\d+)$/, (req, res, ctx) => {
    const id = req.params['0']
    const item = findById(imageTypes, id)
    return item ? res(ctx.status(200), ctx.json(item)) : res(ctx.status(404))
  }),
  rest.post(/\/advertisement\/photos$/, (req, res, ctx) => {
    // Simula upload retornando URLs mockadas
    const mockUrls = [
      'https://via.placeholder.com/800x600?text=Uploaded+1',
      'https://via.placeholder.com/800x600?text=Uploaded+2',
      'https://via.placeholder.com/800x600?text=Uploaded+3'
    ]
    return res(ctx.status(200), ctx.json(mockUrls.slice(0, 1)))
  }),

  // ==================== AUTHENTICATION ====================
  rest.post(/\/auth\/login$/, (req, res, ctx) => {
    const { email } = req.body
    const user = users.find(u => u.email === email)
    if (user) {
      return res(ctx.status(200), ctx.json({
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtb2NrLXRva2VuIn0.mock-signature',
        id: user.id,
        accessLevel: user.accessLevel === 'ADMINISTRADOR' ? 'ADMINISTRADOR' : 'CLIENTE'
      }))
    }
    return res(ctx.status(401), ctx.json({ error: 'Email ou senha inválidos' }))
  }),
  rest.post(/\/users\/forgot-password$/, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ message: 'Se o e-mail estiver cadastrado, um código de verificação será enviado.' }))
  }),
  rest.post(/\/auth\/validate-reset-token$/, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ valid: true, expired: false, message: 'Token válido' }))
  }),
  rest.post(/\/auth\/reset-password$/, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ message: 'Senha redefinida com sucesso' }))
  }),

  // ==================== FALLBACK ====================
  rest.all('*', (req, res, ctx) => {
    console.warn(`[MSW] Requisição não mapeada: ${req.method} ${req.url.href}`)
    return res(ctx.status(404), ctx.json({ error: 'Endpoint não encontrado no mock' }))
  })
]
