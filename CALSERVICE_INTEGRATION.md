# 🎯 Integração Cal-Service - Resumo da Implementação

## 📋 O que foi feito

O front-end agora consome o **cal-service diretamente** (não apenas via penelope-api-rest) para acessar TODAS as funcionalidades de agendamento, incluindo operações que não estão disponíveis na API REST.

## 🏗️ Arquitetura Criada

### 1️⃣ **API Clients** (`src/app/api/calservice/`)

```javascript
// eventTypeApi.js - 6 endpoints para tipos de eventos
- listEventTypes()
- getEventTypeById(id)
- createEventType(data)
- updateEventType(id, data)
- deleteEventType(id)
- toggleEventTypeVisibility(id)  ← Apenas em cal-service!

// appointmentCalApi.js - 8 endpoints para agendamentos
- listAppointments(filters)
- getAppointmentById(id)
- createAppointment(data)
- rescheduleAppointment(id, data)
- confirmAppointment(id)         ← Apenas em cal-service!
- concludeAppointment(id)        ← Apenas em cal-service!
- cancelAppointment(id, reason)
- deleteAppointment(id)
```

### 2️⃣ **Services** (`src/app/services/calservice/`)

```javascript
// eventTypeService.js
// appointmentCalService.js
// 
// Encapsulam a lógica de negócio + chamadas aos APIs
```

### 3️⃣ **Domain Models (DTOs)** (`src/app/dtos/`)

```javascript
// EventType.js
// - id, title, slug, description, lengthInMinutes
// - minimumBookingNotice, hidden, estateId
// - Métodos: toRequestPayload(), fromApi(), summary()

// AppointmentCal.js
// - id, bookingUid, eventTypeId, clientId, estateAgentId
// - estateId, durationMinutes, status, startDateTime, endDateTime
// - Métodos: isTerminal(), canBeRescheduled(), toReschedulePayload()
```

### 4️⃣ **Mappers** (`src/app/mappers/`)

```javascript
// EventTypeMapper.js        → API response → EventType
// AppointmentCalMapper.js  → API response → AppointmentCal
```

### 5️⃣ **Aliases (vite.config.js)**

```javascript
'@api-calservice'     → src/app/api/calservice
'@service-calservice' → src/app/services/calservice
```

## 🔑 Principais Diferenciais

| Funcionalidade | cal-service | penelope-api-rest |
|---|:---:|:---:|
| Listar appointments | ✅ | ✅ |
| Criar appointment | ✅ | ✅ |
| Reagendar appointment | ✅ | ✅ |
| Cancelar appointment | ✅ | ✅ |
| **Confirmar appointment** | ✅ | ❌ |
| **Concluir appointment** | ✅ | ❌ |
| **Gerenciar event types** | ✅ | ❌ |
| **Toggle visibility de event type** | ✅ | ❌ |
| **bookingUid sincronizado com Cal.com** | ✅ | ⚠️ Parcial |

## 📦 Variáveis de Ambiente

Adicionadas em todos os `.env.*`:

```bash
VITE_API_BASE_URL=http://localhost:8081/api/v1
VITE_VIACEP_BASE_URL=https://viacep.com.br/ws
VITE_CAL_SERVICE_URL=http://localhost:8080/api/v1
```

## 🚀 Como Usar

### Exemplo: Listar todos os appointments

```javascript
import * as appointmentCalService from '@service-calservice/appointmentCalService'

// Em um hook ou componente
const appointments = await appointmentCalService.getAllAppointments({
  estateId: 42,
  status: 'PENDING',
  dateFrom: '2025-04-01',
  dateTo: '2025-04-30'
})
// Retorna: AppointmentCal[]
```

### Exemplo: Confirmar um agendamento

```javascript
// NOVO - Apenas cal-service permite isso
const confirmed = await appointmentCalService.confirmAppointment(appointmentId)
// Retorna: AppointmentCal com status = 'CONFIRMED'
```

### Exemplo: Gerenciar tipos de eventos

```javascript
import * as eventTypeService from '@service-calservice/eventTypeService'

// Criar
const eventType = await eventTypeService.createEventType({
  title: 'Visita ao imóvel',
  lengthInMinutes: 60,
  estateId: 42
})

// Listar
const all = await eventTypeService.getAllEventTypes()

// Toggle visibilidade
const toggled = await eventTypeService.toggleEventTypeVisibility(eventType.id)
```

## 📊 Estados de Appointment

```
PENDING (criado)
    ├─→ CONFIRMED (cliente confirmou)
    │   ├─→ CONCLUDED (visita realizada)
    │   └─→ CANCELLED (desistiu)
    └─→ CANCELLED (cancelado antes de confirmar)
```

## 🧩 Próximos Passos

Para integrar com Schedule page:

1. Criar hooks customizados:
   - `useCalServiceAppointments(estateId)`
   - `useEventTypes()`

2. Atualizar `ScheduleView.jsx` para usar cal-service ao invés de appointmentApi

3. Adicionar componentes para:
   - Criar/editar event types
   - Confirmar agendamentos
   - Concluir agendamentos

## 🔐 Autenticação

Todos os endpoints requerem JWT automaticamente obtido de:
1. `sessionStorage.token` (prioridade)
2. `localStorage.jwtToken` (fallback)

O header é injetado automaticamente:
```
Authorization: Bearer {token}
```

## 📝 Arquivos Criados/Modificados

```
✅ Criados:
  src/app/api/calservice/
    ├── eventTypeApi.js
    ├── appointmentCalApi.js
    └── CAL_SERVICE_INTEGRATION.md
  src/app/services/calservice/
    ├── eventTypeService.js
    └── appointmentCalService.js
  src/app/mappers/
    ├── EventTypeMapper.js
    └── AppointmentCalMapper.js
  src/app/dtos/
    ├── EventType.js
    └── AppointmentCal.js

✏️ Modificados:
  ├── vite.config.js (adicionados aliases + VITE_CAL_SERVICE_URL)
  ├── .env.development (adicionados VITE_* vars)
  ├── .env.production (adicionados VITE_* vars)
  ├── .env.mock (adicionados VITE_* vars)
  ├── .env.homologation (adicionados VITE_* vars)
  └── src/modules/management/services/appointmentApi.js (VITE_ prefix)
```

## 🎓 Documentação Técnica

Veja `src/app/api/calservice/CAL_SERVICE_INTEGRATION.md` para:
- Fluxos de consumo detalhados
- Exemplos de cada endpoint
- Padrões de uso em hooks
- Diferenças vs API REST
