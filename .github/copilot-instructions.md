# Penelope Web Site — Copilot Instructions

Você é um **especialista em desenvolvimento PENELOPE-WEB-SITE** com profundo conhecimento da arquitetura, padrões de código, convenções de nomenclatura e práticas recomendadas do projeto. Seu papel é gerar código de alta qualidade seguindo os **padrões arquiteturais reais** implementados no projeto.

## Visão Geral do Projeto

Plataforma web de gestão imobiliária construída com **React 18 + Vite 7 + Tailwind CSS 4**. O projeto segue arquitetura **MVVM (Model-View-ViewModel)** com módulos de funcionalidade isolados. Linguagem de negócio em **Português Brasileiro (pt-BR)**.

## Tech Stack

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

## Arquitetura MVVM

Cada página/componente complexo segue o padrão de três arquivos:

| Arquivo | Responsabilidade |
|---------|-----------------|
| `ComponentView.jsx` | Apresentação pura (JSX + Tailwind) |
| `ComponentModel.js` | Lógica de negócio pura, sem dependências React |
| `useComponentViewModel.js` | Hook React conectando Model ao View (state, effects, callbacks) |

### Exemplo de fluxo

```
HomeView.jsx → useHomeViewModel.js → HomeModel.js
```

- **Model:** Classe JS com campos privados (`#`), getters/setters, métodos de negócio
- **ViewModel:** Hook customizado que instancia o Model via `useState(() => new Model())`, faz fetch de dados, retorna estado para a View
- **View:** Componente funcional que desestrutura o retorno do ViewModel e renderiza JSX

## Estrutura de Pastas

```
src/
├── app/                    # Core da aplicação
│   ├── api/                # Módulos de API (penelopec, viacep, calservice)
│   ├── dtos/               # Classes de domínio (User, Estate, Address, etc.)
│   ├── mappers/            # Conversão API ↔ Entidades de domínio
│   ├── routes/             # RouterModel, RouterView, useRouterViewModel
│   └── services/           # Camada de orquestração/negócio por integração
├── modules/                # Módulos de funcionalidade
│   ├── auth/               # Autenticação (login, registro, reset senha)
│   ├── institutional/      # Páginas públicas (Home, Properties, About, Contacts)
│   └── management/         # Admin (Users, PropertiesConfig, Schedule, Profile)
└── shared/                 # Código reutilizável
    ├── assets/             # Fontes, imagens
    ├── components/         # Componentes compartilhados (layout/, ui/, feedback/)
    ├── constants/          # Constantes globais (routes, estateTypes, imageTypes, etc.)
    ├── hooks/              # Hooks customizados (useCEPAutoFill, useHeaderHeight)
    ├── pages/              # Páginas genéricas (Loading, NotFound, Unauthorized)
    ├── styles/             # style.css (tokens), theme.js (mapeamento semântico)
    └── utils/              # Utilitários (format*, validate*, generate*)
```

## Convenções de Nomenclatura

| Elemento | Convenção | Exemplo |
|----------|-----------|---------|
| Pastas | `PascalCase` (páginas/componentes) ou `camelCase` (serviços) | `Home/`, `api/` |
| Componentes React | `PascalCase` com sufixo `View` | `HeaderView.jsx` |
| Models | `PascalCase` com sufixo `Model` | `HomeModel.js` |
| ViewModels (hooks) | `camelCase` com prefixo `use` e sufixo `ViewModel` | `useHomeViewModel.js` |
| Utilitários | `camelCase` com sufixo `Util` | `formatCurrencyUtil.js` |
| Constantes | `UPPER_SNAKE_CASE` | `ESTATE_TYPES`, `ROUTES` |
| Variáveis/funções | `camelCase` | `fetchHomeData`, `isLoading` |
| Classes de domínio | `PascalCase` | `User`, `Estate`, `Address` |
| Campos privados | Prefixo `#` (ES private fields) | `#id`, `#name` |

## Imports e Aliases

Usar **imports absolutos** via aliases definidos no `vite.config.js`:

```javascript
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { formatCurrency } from '@utils/formatCurrencyUtil'
import { ROUTES } from '@constant/routes'
import axiosInstance from '@api/axiosInstance'
```

Aliases disponíveis: `@shared`, `@institutional`, `@auth`, `@management`, `@app`, `@routes`, `@api`, `@services`, `@mappers`, `@dtos`, `@mocks`, `@utils`, `@constant`, `@service-penelopec`, `@service-viacep`, `@service-calservice`, `@api-penelopec`, `@api-viacep`, `@api-calservice`.

**Nunca** usar caminhos relativos longos (`../../../`).

## Estilização

### Tailwind CSS + Design Tokens

- Usar classes **Tailwind utility-first**
- Design tokens definidos em `src/shared/styles/style.css` via `@theme`
- Cores da marca: `distac-primary` (#b33c8e, rosa), `distac-secondary` (#36221d, marrom), `default-light` (#ebe9e9), `default-dark` (#1f1d1f)
- Mapeamento semântico de componentes em `src/shared/styles/theme.js`
- Composição de classes com `clsx`

### Fontes

- **Poppins** — fonte padrão do corpo
- **Darker Grotesque** — títulos e headings
- **Tan-Nimbus** — fonte customizada (definida via `@font-face`)

### Responsividade

- Abordagem **mobile-first** (estilos base + breakpoint `md:`)
- Tokens de espaçamento com variantes direcionais (`-y`, `-x`) e responsivas (`-md`)

## Camada de API

### Padrão de Serviço

```javascript
// Funções exportadas por nome em cada módulo de API
export const listAllAdvertisements = async (filters = {}) => {
  const response = await axiosInstance.get('/advertisement', { params: filters })
  return RealEstateAdvertisementMapper.toEntityList(response.data)
}
```

### Padrão de Mapper

Conversão bidirecional entre dados da API e entidades do domínio:

```javascript
export class RealEstateAdvertisementMapper {
  static toEntity(data) { return new RealEstateAdvertisement({ ... }) }
  static toEntityList(dataList) { return dataList.map(d => this.toEntity(d)) }
}
```

### Autenticação

- JWT armazenado em `sessionStorage` (`token`, `userId`, `userRole`)
- Interceptor Axios injeta token automaticamente em rotas protegidas
- Evento customizado `authChanged` para comunicação cross-tab

## Entidades de Domínio

Classes em `src/app/dtos/` com:

- Campos privados (`#field`)
- Getters e setters
- Métodos de negócio (`toRequestPayload()`, `getFullAddress()`, `summary()`, etc.)
- Construtores com destructuring e valores default

```javascript
export class User {
  #id; #name; #email;
  constructor({ id, name, email }) {
    this.#id = id ?? null
    this.#name = name ?? ''
  }
  get id() { return this.#id }
  set name(v) { this.#name = v }
  toRequestPayload() { return { name: this.#name, email: this.#email } }
}
```

## Roteamento

- Rotas definidas como objetos em `src/shared/constants/routes.js` com `key`, `path`, `friendlyName`
- Três níveis de proteção: `publicRoutes`, `authRequiredRoutes`, `adminRequiredRoutes`
- Componente `ProtectedRoute` redireciona usuários não autorizados
- Rotas seguem o padrão MVVM: `RouterModel` → `useRouterViewModel` → `RouterView`

## Regras para Geração de Código

1. **Sempre** usar componentes funcionais com hooks — nunca class components
2. **Sempre** seguir o padrão MVVM (View + Model + ViewModel) para páginas e componentes complexos
3. **Sempre** usar imports absolutos via aliases do Vite
4. **Sempre** usar Tailwind CSS para estilização — nunca CSS Modules ou styled-components
5. **Sempre** encapsular campos de classes com `#` (private fields) e expor via getters/setters
6. **Sempre** usar Mappers para conversão entre dados da API e entidades do domínio
7. **Sempre** extrair lógica reutilizável em hooks customizados (`use*`)
8. **Sempre** usar named exports para utilitários, hooks e mappers
9. **Sempre** escrever código e comentários em **Português Brasileiro** quando for texto de negócio/UI
10. **Sempre** validar acessibilidade (atributos `aria-*`, `alt` em imagens, semântica HTML)
11. **Nunca** usar Redux, Zustand ou gerenciamento de estado global — usar estado local + sessionStorage
12. **Nunca** importar Axios diretamente — usar `axiosInstance` configurado em `@api/axiosInstance`

## Scripts Disponíveis

```bash
npm run dev         # Servidor de desenvolvimento (Vite, mode development)
npm run build       # Build de produção
npm run lint        # ESLint check
npm run lint:fix    # ESLint auto-fix
npm run format      # Prettier format
npm run check:prod  # Lint + format check + build
```

## Variáveis de Ambiente

Usar variáveis de ambiente via `import.meta.env.*` conforme `vite.config.js` (ex.: `VITE_API_BASE_URL`, `VITE_CAL_SERVICE_URL`, `VITE_VIACEP_BASE_URL`). Arquivos `.env.{mode}` suportados: `development`, `homologation`, `production`.
