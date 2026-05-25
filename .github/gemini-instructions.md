# Penelope Web Site — Copilot Instructions

Você é um **especialista em desenvolvimento PENELOPE-WEB-SITE** com profundo conhecimento da arquitetura, padrões de código, convenções de nomenclatura e práticas recomendadas do projeto. Seu papel é gerar código de alta qualidade seguindo os **padrões arquiteturais reais** implementados no projeto.

Todo código de negócio, documentações internas (JSDoc) e textos de interface do usuário (UI) devem ser escritos em **Português Brasileiro (pt-BR)**.

---

## 1. Visão Geral do Projeto

Plataforma web de gestão imobiliária construída com **React 18 + Vite 7 + Tailwind CSS 4**. O projeto segue arquitetura **MVVM (Model-View-ViewModel)** com módulos de funcionalidade isolados.

---

## 2. Tech Stack

### Runtime & Build

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| Node.js | `>=18.0.0` | Runtime |
| npm | `>=9.0.0` | Gerenciador de pacotes |
| Vite | `^7.1.2` | Bundler e dev server |
| `@vitejs/plugin-react` | `^5.0.0` | React Fast Refresh |
| PostCSS | `^8.5.6` | Processamento CSS |
| Autoprefixer | `^10.4.19` | Prefixos CSS automáticos |

### Framework & UI

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| React | `^18.3.1` | Biblioteca de UI (apenas componentes funcionais) |
| React DOM | `^18.3.1` | Renderização no DOM |
| React Router DOM | `^7.9.1` | Roteamento client-side |
| Tailwind CSS | `^4.1.13` | Estilização utility-first com design tokens |
| `@tailwindcss/vite` | `^4.1.13` | Integração Tailwind + Vite |
| clsx | `^2.1.1` | Composição condicional de classes CSS |

### HTTP & Integrações

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| Axios | `^1.12.2` | Cliente HTTP com interceptors (JWT) |
| `@calcom/embed-react` | `^1.5.3` | Widget de agendamento Cal.com |

### Ícones

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| Lucide React | `^0.544.0` | Biblioteca de ícones principal |
| React Icons | `^5.5.0` | Biblioteca de ícones complementar |

### Acessibilidade

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| `@djpfs/react-vlibras` | `^2.0.2` | Widget VLibras (Libras) |
| `react-vlibras-plugin` | `^0.1.3` | Plugin VLibras adicional |
| `eslint-plugin-jsx-a11y` | `^6.4.1` | Linting de acessibilidade JSX |

### Qualidade de Código (devDependencies)

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| ESLint | `^10.0.1` | Linting JS/JSX (flat config) |
| `eslint-plugin-react` | `^7.22.0` | Regras React |
| `eslint-plugin-react-hooks` | `^5.2.0` | Regras de hooks |
| `eslint-plugin-react-refresh` | `^0.4.20` | Regras de HMR |
| Stylelint | configurado | Linting CSS com suporte Tailwind |
| `@types/react` | `^19.1.10` | Tipagem TypeScript para React |
| `@types/react-dom` | `^19.1.7` | Tipagem TypeScript para React DOM |
| globals | `^16.3.0` | Definições de variáveis globais JS |

> **Módulo:** `"type": "module"` — o projeto usa ES Modules nativamente.

---

## 3. Estrutura de Pastassrc/
├── app/                             # Core da aplicação (infraestrutura e dados)
│   ├── api/                         # Clientes HTTP puros por integração (penelopec, calservice, viacep)
│   ├── dtos/                        # Classes de domínio/entidades puras (User, Estate, Address)
│   ├── mappers/                     # Conversores bidirecionais (Contrato da API ↔ Entidade)
│   ├── responses/                   # Handlers de tradução de erros HTTP por domínio
│   ├── routes/                      # Gerenciamento de rotas (RouterModel, RouterView, useRouterViewModel)
│   └── services/                    # Orquestração, regras de negócio e validações
├── modules/                         # Módulos de funcionalidade isolados (escopo de negócio)
│   ├── auth/                        # Fluxo de Autenticação (Login, Registro, Reset de Senha)
│   │   ├── components/layout/       # Painéis específicos (SignInPanel, SignUpPanel, etc.)
│   │   └── pages/                   # Páginas do fluxo (Auth, ResetPassword)
│   ├── institutional/               # Páginas públicas e institucionais
│   │   ├── assets/                  # Mídias locais fixas
│   │   └── pages/                   # Home, About, Advertisements, AdvertisementDetails, Contacts
│   └── management/                  # Painel Administrativo e Dashboard de Gestão
│       └── pages/                   # Account, Profile, Users, Amenities, Schedule
│           └── Schedule/            # Módulo de Agenda (exemplo de fluxo MVVM complexo)
│               ├── components/layout/
│               │   └── Calendar/    # Sub-componente com MVVM próprio
│               └── hooks/
└── shared/                          # Recursos globais reaproveitáveis
├── assets/                      # Fontes e mídias globais
├── components/                  # Componentes reutilizáveis compartilhados
│   ├── feedback/                # AlertView, ErrorDisplayView
│   ├── layout/                  # SectionView, HeaderView, FooterView, SidebarView
│   └── ui/                      # ButtonView, InputView, PropertyCardView, ChatbotView...
├── constants/                   # routes.js, estateTypes.js, accessLevels.js, imageTypes.js
├── hooks/                       # useCEPAutoFill, useHeaderHeight, useDebounce
├── pages/                       # Loading, NotFound, Unauthorized
├── styles/                      # style.css (tokens via @theme), theme.js (mapeamento semântico)
└── utils/                       # authSessionUtil, format*, validate*, generate*

---

## 4. Arquitetura MVVM

Cada página ou componente de alta complexidade **DEVE** ser decomposto em uma tríade de arquivos dentro da mesma pasta:

| Arquivo | Responsabilidade |
|---------|-----------------|
| `ComponentView.jsx` | Apresentação pura (JSX + Tailwind) |
| `ComponentModel.js` | Lógica de negócio pura, sem dependências React |
| `useComponentViewModel.js` | Hook React conectando Model ao View (state, effects, callbacks) |

### Fluxo obrigatórioComponentView.jsx → useComponentViewModel.js → ComponentModel.js

- **Model:** Classe JS com campos privados (`#`), getters/setters, métodos de negócio. Proibido importar React ou fazer chamadas HTTP.
- **ViewModel:** Hook que instancia o Model via `useState(() => new Model())`, gerencia efeitos e chama Services. Usa `forceUpdate` para notificar a View quando o estado interno muda.
- **View:** Componente funcional que desestrutura o retorno do ViewModel e renderiza JSX. Proibido conter lógica de negócio ou chamadas a APIs.

### Escalonamento (Nested MVVM)

Se uma View tornar-se extensa ou carregar sub-interfaces com estados independentes, quebrar a complexidade criando subpastas `components/layout/` com MVVM isolado para cada sub-componente.

---

## 5. Camada de Dados — Responsabilidades Estritas

O fluxo de dados segue sempre esta direção: **API → Service → Mapper → DTO → ViewModel → View**. Nenhuma camada pula etapas.

### API (`src/app/api/`)

Responsabilidade única: **requisições HTTP brutas**.

```javascript// ✅ Correto
export const getAllUsers = async (page = 1, pageSize = 10) => {
const response = await axiosInstance.get('/users', {
baseURL: PENELOPEC_API_BASE_URL,
params: { page, pageSize },
})
return response.data // sempre retorna dado bruto
}

Regras:
- Retorna sempre `response.data` — nunca mapeia, transforma ou valida negócio
- **Nunca** importa Mappers, DTOs, Services ou utilitários de sessão
- **Nunca** faz `try/catch` — erros HTTP sobem para o Service
- **Nunca** contém lógica condicional de negócio (`if (!estateId) return ...`)
- **Nunca** define aliases redundantes (`export const listAll = getAll`)

---

### Mapper (`src/app/mappers/`)

Responsabilidade única: **conversão bidirecional entre dados brutos e entidades**.

```javascript// ✅ Correto
export class UserMapper {
static toEntity(data) {
if (!data) return null
return new User({
id: data.id,
name: data.name,
accessLevel: normalizeAccessLevel(data.accessLevel),
})
}static toEntityList(dataList) {
if (!Array.isArray(dataList)) return []
return dataList.map(data => UserMapper.toEntity(data)).filter(Boolean)
}static toRequestPayload(user) {
if (!user) return null
if (user instanceof User) return user.toRequestPayload()
return { name: user.name, email: user.email }
}
}

Regras:
- Único lugar que conhece os nomes originais dos campos da API (snake_case, português, aliases)
- **Nunca** importa Services ou APIs
- **Nunca** delega mapeamento de volta ao DTO (`return Entidade.fromApi(data)` — proibido)
- Sem `console.warn` ou `console.log` de debug

---

### DTO (`src/app/dtos/`)

Responsabilidade: **estrutura de dados tipada + lógica de domínio pura**.

```javascript// ✅ Correto
export class User {
#id
#name
#creci
#active
#accessLevelconstructor({ id, name, creci, active, accessLevel }) {
this.#id = id ?? null
this.#name = name ?? ''
this.#creci = creci ?? ''
this.#active = active !== undefined ? active : true
this.#accessLevel = accessLevel ?? null
}get id() { return this.#id }
get name() { return this.#name }
get creci() { return this.#creci }
get active() { return this.#active }
get accessLevel() { return this.#accessLevel }set name(v) { this.#name = v }// ✅ Lógica de domínio pura — pertence ao DTO
isActive() { return this.#active === true }
hasCreci() { return Boolean(this.#creci?.trim()) }
isAdmin() { return this.#accessLevel === 'ADMINISTRADOR' }
isExpired() { return this.#endDate ? new Date(this.#endDate) < new Date() : false }// ✅ Serialização dos próprios campos para a API
toRequestPayload() {
return { name: this.#name, creci: this.#creci }
}
}

Proibido nos DTOs:
- ❌ `static fromApi(data)` — responsabilidade exclusiva do Mapper
- ❌ `summary()`, `getDisplayName()`, `getFormattedAddress()` — apresentação, pertence ao ViewModel
- ❌ Construtor aceitando aliases bilíngues (`nome/name`, `assunto/subject`) — normalização é responsabilidade do Mapper
- ❌ Qualquer import de React, hooks, APIs ou Mappers

---

### Service (`src/app/services/`)

Responsabilidade: **orquestração — valida entrada, aplica regras de negócio, chama API, mapeia saída**.

```javascript// ✅ Correto
import * as userApi from '@api-penelopec/userApi'
import { userMapper } from '@mappers/userMapper'
import { User } from '@dtos/User'
import { handleUserError } from '@responses/penelopec/UserResponse'
import { authSessionUtil } from '@utils/authSessionUtil'
import { ACCESS_LEVEL } from '@constant/accessLevels'export const getAllUsers = async (page = 1, pageSize = 10) => {
try {
const response = await userApi.getAllUsers(page, pageSize)
const rawList = response?.content || response || []
return userMapper.toEntityList(rawList)
} catch (error) {
throw handleUserError(error, 'Listagem')
}
}export const updateUser = async (id, userData) => {
// Validações ANTES do try/catch
if (!id)
throw new Error('O ID é obrigatório para atualizar um usuário')
if (!userData)
throw new Error('Os dados de atualização são obrigatórios')try {
const payload = userData instanceof User
? userMapper.toRequestPayload(userData)
: userDataconst response = await userApi.updateUser(id, payload)
return userMapper.toEntity(response)
} catch (error) {
throw handleUserError(error, 'Atualização')
}
}// ✅ authSessionUtil.get() DENTRO da função — nunca no topo do arquivo
export const getAllAppointments = async (filters = {}) => {
const { role, userId } = authSessionUtil.get()if (role === ACCESS_LEVEL.CLIENTE) {
if (!userId)
throw new Error('Não foi possível identificar o cliente autenticado')
filters.clientId = userId
}try {
const response = await appointmentApi.getAllAppointments(filters)
const rawList = response?.content || response?.appointments || response || []
return AppointmentMapper.toEntityList(rawList)
} catch (error) {
throw handleAppointmentError(error, 'Listagem')
}
}

Regras:
- Valida parâmetros **antes** do `try/catch` com `throw new Error('...')` em pt-BR
- Envolve **toda** chamada à API em `try/catch` + `handleXxxError`
- Chama `authSessionUtil.get()` **dentro das funções**, nunca no topo do módulo
- Converte payload com `instanceof` + `toRequestPayload()` quando recebe entidade
- Normaliza resposta paginada antes de mapear (`response?.content || response || []`)
- **Nunca** chama `axiosInstance` diretamente
- **Nunca** lê `sessionStorage` diretamente — usa sempre `authSessionUtil`
- **Nunca** define aliases redundantes (`export const registerUser = createUser`)

---

### Response (`src/app/responses/`)

Responsabilidade: **tradução de erros HTTP em mensagens amigáveis em pt-BR**.

```javascript// ✅ Correto
export const handleUserError = (error, context = '') => {
if (error.response) {
const { status, data } = error.response
const backendMessage = data?.message || (typeof data === 'string' ? data : '')switch (status) {
  case 404: return new Error('Usuário(s) não encontrado(s).')
  case 409: return new Error('Este e-mail já está cadastrado.')
  case 400: return new Error(backendMessage || 'Dados inválidos.')
  case 403: return new Error('Sem permissão para esta operação.')
  default:  return new Error(backendMessage || `Erro ao processar usuário (${context}).`)
}
}
if (error.request)
return new Error('Sem conexão com o servidor. Verifique sua internet.')return new Error(error.message || 'Erro inesperado.')
}

Regras:
- Um arquivo por domínio: `UserResponse.js`, `AdvertisementResponse.js`, `AppointmentResponse.js`, etc.
- Usado **apenas** nos Services, nunca nas APIs
- Mensagens sempre em pt-BR

---

### Sessão (`authSessionUtil`)

Responsabilidade: **único ponto de acesso ao `sessionStorage`**.

```javascriptauthSessionUtil.save({ token, userId, email, isAdmin, accessLevel }) // após login
authSessionUtil.get()    // retorna { token, userId, email, role, hadToken, sessionExpiresAt }
authSessionUtil.clear()  // no logout

```javascript// ✅ Correto — leitura dentro da função
export const getMinhaFuncao = async () => {
const { role, userId } = authSessionUtil.get()
}// ❌ Errado — leitura no topo do módulo (congela a sessão no momento do import)
const { role, userId } = authSessionUtil.get()
export const getMinhaFuncao = async () => { ... }

Nenhuma outra camada lê ou escreve `sessionStorage` diretamente.

---

## 6. Matriz de Dependências

| Camada | Pode importar | Nunca importa |
|--------|--------------|---------------|
| **API** | `axiosInstance`, variáveis de env | Mapper, DTO, Service, authSessionUtil |
| **Mapper** | DTO, constantes globais | API, Service, authSessionUtil, sessionStorage |
| **DTO** | Constantes de domínio | API, Mapper, Service, React, hooks |
| **Service** | API, Mapper, DTO, Response, authSessionUtil, constantes | `axiosInstance` diretamente |
| **Response** | — (sem imports de negócio) | API, Mapper, Service, DTO |
| **ViewModel** | Service, Model MVVM, hooks, constantes | API, Mapper diretamente |
| **View** | ViewModel, componentes, constantes de UI | Service, API, Mapper, sessionStorage |

---

## 7. Convenções de Nomenclatura

| Elemento | Convenção | Exemplo |
|----------|-----------|---------|
| Pastas | `PascalCase` (páginas/componentes) ou `camelCase` (serviços/api) | `Home/`, `api/` |
| Componentes React | `PascalCase` com sufixo `View` | `HeaderView.jsx` |
| Models | `PascalCase` com sufixo `Model` | `HomeModel.js` |
| ViewModels (hooks) | `camelCase` com prefixo `use` e sufixo `ViewModel` | `useHomeViewModel.js` |
| Utilitários | `camelCase` com sufixo `Util` | `formatCurrencyUtil.js` |
| Constantes | `UPPER_SNAKE_CASE` | `ESTATE_TYPES`, `ROUTES` |
| Variáveis/funções | `camelCase` | `fetchHomeData`, `isLoading` |
| Classes de domínio | `PascalCase` | `User`, `Estate`, `Address` |
| Campos privados | Prefixo `#` | `#id`, `#name` |

---

## 8. Imports e Aliases

**Sempre** usar imports absolutos via aliases. **Nunca** usar caminhos relativos longos (`../../../`).

| Alias | Caminho |
|-------|---------|
| `@shared` | `src/shared/` |
| `@app` | `src/app/` |
| `@institutional` | `src/modules/institutional/` |
| `@auth` | `src/modules/auth/` |
| `@management` | `src/modules/management/` |
| `@routes` | `src/app/routes/` |
| `@api` | `src/app/api/` |
| `@services` | `src/app/services/` |
| `@mappers` | `src/app/mappers/` |
| `@dtos` | `src/app/dtos/` |
| `@responses` | `src/app/responses/` |
| `@utils` | `src/shared/utils/` |
| `@constant` | `src/shared/constants/` |
| `@mocks` | `src/app/mocks/` |
| `@api-penelopec` | `src/app/api/penelopec/` |
| `@api-viacep` | `src/app/api/viacep/` |
| `@api-calservice` | `src/app/api/calservice/` |
| `@service-penelopec` | `src/app/services/penelopec/` |
| `@service-viacep` | `src/app/services/viacep/` |
| `@service-calservice` | `src/app/services/calservice/` |

---

## 9. Estilização

### Tailwind CSS + Design Tokens

- Usar classes **Tailwind utility-first** — nunca CSS Modules ou styled-components
- Design tokens definidos em `src/shared/styles/style.css` via `@theme`
- Mapeamento semântico de componentes em `src/shared/styles/theme.js`
- Composição de classes com `clsx`

### Cores institucionais

| Token | Valor | Uso |
|-------|-------|-----|
| `distac-primary` | `#b33c8e` | Rosa — cor principal da marca |
| `distac-secondary` | `#36221d` | Marrom — cor secundária |
| `default-light` | `#ebe9e9` | Fundo claro do sistema |
| `default-dark` | `#1f1d1f` | Fundo escuro do sistema |

### Fontes

- `font-body` — Poppins (corpo de texto)
- `font-title` — Darker Grotesque (títulos e headings)
- `Tan-Nimbus` — fonte de destaque via `@font-face`

### Responsividade

- Abordagem **mobile-first**: estilos base → breakpoint `md:`
- Tokens de espaçamento semânticos: `p-section`, `gap-card`, `p-button-rectangle`
- Variantes responsivas: `p-card md:p-card-md`

---

## 10. Roteamento

- Rotas definidas como objetos em `src/shared/constants/routes.js` com `key`, `path`, `friendlyName`
- Três níveis de proteção: `publicRoutes`, `authRequiredRoutes`, `adminRequiredRoutes`
- Componente `ProtectedRoute` redireciona usuários não autorizados
- Rotas seguem MVVM: `RouterModel` → `useRouterViewModel` → `RouterView`

---

## 11. Regras Invioláveis de Geração de Código

**Sempre:**
1. Componentes funcionais com hooks — nunca class components
2. Padrão MVVM (View + Model + ViewModel) para páginas e componentes complexos
3. Imports absolutos via aliases do Vite
4. Tailwind CSS — nunca CSS Modules ou styled-components
5. Campos privados `#` com getters/setters nas classes
6. Mappers para conversão entre dados da API e entidades do domínio
7. Hooks customizados para lógica reutilizável
8. Named exports para utilitários, hooks, mappers e services
9. pt-BR para textos de negócio/UI e JSDoc
10. Acessibilidade: `aria-*`, `alt` em imagens, HTML semântico
11. `try/catch` + `handleXxxError` **no Service** para toda chamada à API
12. `authSessionUtil.get()` **dentro das funções** do Service — nunca no topo do arquivo

**Nunca:**
13. Redux, Zustand ou estado global — usar estado local + `authSessionUtil`
14. Importar `axios` diretamente — usar `axiosInstance` via `@api/axiosInstance`
15. `try/catch` ou lógica de negócio na camada de API
16. Importar Mappers ou DTOs na camada de API
17. `static fromApi(data)` nos DTOs — mapeamento pertence ao Mapper
18. Métodos de apresentação nos DTOs (`summary()`, `getDisplayName()`, `getFormattedAddress()`)
19. Ler `sessionStorage` diretamente fora do `authSessionUtil`
20. Aliases redundantes de funções (`export const listAll = getAll`)
21. Caminhos relativos longos (`../../../`)

---

## 12. Scripts Disponíveis

```bashnpm run dev         # Servidor de desenvolvimento
npm run build       # Build de produção
npm run lint        # ESLint check
npm run lint:fix    # ESLint auto-fix
npm run format      # Prettier format
npm run check:prod  # Lint + format check + build

## 13. Variáveis de Ambiente

Usar via `import.meta.env.*`. Arquivos suportados: `.env.development`, `.env.homologation`, `.env.production`.
