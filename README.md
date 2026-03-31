# 🏢 Corretora Penelope - Frontend

Sistema de gerenciamento de anúncios de imóveis e agendamento de visitas com React 19 + Tailwind CSS v4 + Vite. **Arquitetura MVVM** para componentes reutilizáveis.

## 🚀 Tecnologias

- **React 19.1.1** - Biblioteca JavaScript para interfaces de usuário
- **Tailwind CSS v4.1.13** - Framework CSS utility-first (versão mais recente)
- **Vite 7.1.2** - Build tool e servidor de desenvolvimento ultra-rápido
- **ESLint 9** - Linter com configuração flat config para qualidade de código
- **Prettier 3** - Formatador de código com plugin Tailwind

## 🏗️ Estrutura do Projeto

```
penelope-web-site/
├── .vscode/                    # 🛠️ Configurações VS Code (compartilhadas)
│   ├── extensions.json         #    Extensões recomendadas
│   └── settings.json           #    Configurações padronizadas do projeto
├── node_modules/               # 📦 Dependências
├── public/                     # 🌐 Assets estáticos
└── src/
    ├── modules/                    # 📁 Módulos da aplicação
    │   ├── auth/                   # 🔐 Módulo de Autenticação
    │   │   ├── components/         #     Componentes de autenticação
    │   │   └── pages/              #     Páginas (Login, Cadastro, etc.)
    │   ├── institutional/          # 🏛️ Módulo Institucional
    │   │   ├── components/         #     Componentes institucionais
    │   │   └── pages/              #     Páginas (Home, Sobre, Contato, etc.)
    │   └── management/             # 🏠 Área Privada (Clientes + Corretores)
    │       ├── components/         #     Componentes do painel
    │       │   └── ui/             #     Componentes de UI específicos
    │       │       └── ManagementMenu/  # Menu de gerenciamento
    │       └── pages/              #     Páginas do painel
    │           └── Profile/        #     Perfil do usuário
    │               └── ProfileView.jsx
    └── shared/                     # 🔧 Recursos compartilhados
        ├── assets/                 #     Assets globais (imagens, ícones, etc.)
        ├── components/             #     Componentes reutilizáveis
        │   ├── feedback/           #     Componentes de feedback (erros, etc.)
        │   │   └── ErrorDisplay/
        │   ├── layout/             #     Componentes de layout (Section, etc.)
        │   │   └── Section/
        │   └── ui/                 #     Componentes de UI (MVVM)
        │       ├── Button/         #     Botões
        │       │   └── ButtonView.jsx
        │       ├── Heading/        #     Títulos
        │       │   └── HeadingView.jsx
        │       ├── Input/          #     Campos de entrada (MVVM)
        │       │   ├── InputModel.js           # 📊 Model
        │       │   ├── InputView.jsx           # 👁️ View
        │       │   └── useInputViewModel.js    # 🎯 ViewModel
        │       ├── ManagementForm/ #     Formulários de gerenciamento (MVVM)
        │       │   ├── ManagementFormModel.js
        │       │   ├── ManagementFormView.jsx
        │       │   └── useManagementFormViewModel.js
        │       └── Text/           #     Textos
        │           └── TextView.jsx
        ├── hooks/                  #     Hooks customizados
        ├── services/               #     Serviços e APIs
        ├── styles/                 #     Estilos e temas
        │   └── theme.js            #     Funções de tema Tailwind
        └── utils/                  #     Funções auxiliares
├── .env.development            # 🔧 Variáveis de ambiente - Desenvolvimento
├── .env.homologation           # 🏗️ Variáveis de ambiente - Homologação
├── .env.production             # 🚀 Variáveis de ambiente - Produção
├── .env.mock                   # 🧪 Variáveis de ambiente - Modo mock (MSW)
├── .gitignore                  # 📝 Arquivos ignorados pelo Git
├── .prettierrc                 # 💅 Configuração Prettier
├── eslint.config.js            # 📏 Configuração ESLint (flat config)
├── index.html                  # 📄 Template HTML principal
├── package.json                # 📦 Dependências e scripts
├── package-lock.json           # 🔒 Lock de dependências
├── README.md                   # 📖 Este arquivo
└── vite.config.js              # ⚡ Configuração Vite
```

## 🧪 Modo de desenvolvimento com MSW

O projeto agora suporta um **modo de mock** que permite rodar o front-end totalmente separado do backend. Isso é útil para desenvolvimento offline, testes de UI ou demos.

### Como funciona

1. Defina a variável `VITE_API_MODE=mock` no arquivo `.env.mock` (já criado no repositório).
2. Execute o dev server com `npm run dev:mock` (ele usa `vite --mode mock`).
3. No início da aplicação, `main.jsx` detecta o modo mock e inicializa o **Mock Service Worker** (MSW).
4. Todas as requisições HTTP que corresponderem aos handlers definidos em `src/mocks/handlers.js` são interceptadas e recebem respostas com dados JSON locais.
5. No modo normal (`npm run dev`), o MSW não é inicializado e as chamadas continuam indo para o backend real.

### Estrutura de mocks

```
src/mocks/
├── browser.js      # Setup do worker MSW
├── handlers.js     # Definição de endpoints simulados
└── data/
    ├── users.json      # Exemplo de lista de usuários
    └── properties.json # Exemplo de propriedades
```

Os handlers usam expressões regulares para abranger tanto URLs relativas quanto chamadas com base URL configurada.

### Scripts úteis

- `npm run dev`       → servidor normal usando API real
- `npm run dev:mock`  → servidor em modo mock (MSW intercepta requisições)

> ⚠️ Após adicionar novos handlers é necessário (uma única vez) inicializar o service worker em `public/` com:
> ```bash
> npx msw init public/ --save-dev
> ```

---

## 🎯 Arquitetura MVVM

Este projeto utiliza o padrão **MVVM (Model-View-ViewModel)** para componentes complexos e reutilizáveis, proporcionando separação clara de responsabilidades e facilidade de manutenção.

### 📐 Estrutura MVVM de um Componente

Cada componente MVVM é composto por três arquivos principais:

```
ComponentName/
├── ComponentNameModel.js          # 📊 MODEL - Dados e regras de negócio
├── ComponentNameView.jsx          # 👁️ VIEW - Apresentação (UI pura)
└── useComponentNameViewModel.js   # 🎯 VIEWMODEL - Lógica de apresentação
```

### 🔍 Exemplo Real: Input Component

#### 1️⃣ **Model** (`InputModel.js`)
Gerencia **dados e validações**:

```javascript
export class InputModel {
  constructor({ value = '', type = 'text', required = false, ... }) {
    this.value = value
    this.type = type
    this.required = required
  }

  // Getters computados
  get hasValue() {
    return Boolean(this.value.trim())
  }

  get isEmpty() {
    return !this.hasValue
  }

  // Métodos de atualização
  updateValue(newValue) {
    this.value = String(newValue || '')
    return true
  }

  // Validação
  validateType(type) {
    const VALID_TYPES = ['text', 'email', 'password', 'number']
    return VALID_TYPES.includes(type) ? type : 'text'
  }
}
```

#### 2️⃣ **ViewModel** (`useInputViewModel.js`)
Gerencia **lógica de apresentação e estado**:

```javascript
export function useInputViewModel(initialProps = {}) {
  const [viewModel] = useState(() => {
    const model = new InputModel(initialProps)
    return new InputViewModel(model)
  })

  const [, forceUpdate] = useState(0)

  // Commands que atualizam o model e refresh a view
  const commands = {
    updateValue: (value) => {
      viewModel.updateValue(value)
      forceUpdate(prev => prev + 1)
    },
    validateInput: () => {
      return viewModel.validateInput()
    }
  }

  // Event handlers
  const handleChange = (event) => {
    viewModel.handleChange(event)
    forceUpdate(prev => prev + 1)
  }

  return {
    // Data do Model
    value: viewModel.value,
    hasErrors: viewModel.hasErrors,

    // CSS Classes (lógica de apresentação)
    inputClasses: viewModel.inputClasses,
    labelClasses: viewModel.labelClasses,

    // Event Handlers
    handleChange,

    // Commands
    ...commands
  }
}
```

#### 3️⃣ **View** (`InputView.jsx`)
**UI pura** - apenas renderiza:

```jsx
export function InputView({
  children,
  value = '',
  type = 'text',
  onChange,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false)

  // Lógica visual específica (toggle senha)
  const actualType = (type === 'password' && showPassword) ? 'text' : type

  return (
    <div>
      <label>{children}</label>
      <input
        type={actualType}
        value={value}
        onChange={onChange}
        {...props}
      />
      {type === 'password' && (
        <button onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? <EyeOff /> : <Eye />}
        </button>
      )}
    </div>
  )
}
```

### 🔄 Fluxo de Dados MVVM

```
User Interaction (View)
        ↓
Event Handler (ViewModel)
        ↓
Update Model (Model)
        ↓
Compute Properties (ViewModel)
        ↓
Re-render (View)
```

### ✅ Vantagens do MVVM

- **📦 Separação de Responsabilidades**: Cada camada tem uma função clara
- **🧪 Testabilidade**: Model e ViewModel podem ser testados isoladamente
- **♻️ Reusabilidade**: Models e ViewModels podem ser compartilhados
- **🔧 Manutenibilidade**: Mudanças em uma camada não afetam as outras
- **📱 Escalabilidade**: Fácil adicionar novos recursos sem quebrar código existente

### 🎨 Quando Usar MVVM?

#### ✅ Use MVVM para:
- Componentes **complexos e reutilizáveis** (Input, Form, Table, Modal)
- Componentes com **lógica de negócio** ou **validações**
- Componentes com **estado complexo**
- Componentes usados em **múltiplos contextos**

#### ❌ Não use MVVM para:
- Componentes **puramente visuais** (Button, Text, Heading)
- Componentes **simples e específicos** de uma página
- Wrappers de componentes de terceiros

### 📚 Componentes MVVM no Projeto

Atualmente implementados:

1. **Input** (`shared/components/ui/Input/`)
   - Gerencia entrada de dados com validação
   - Suporta múltiplos tipos (text, email, password, number)
   - Toggle de visualização de senha

2. **ManagementForm** (`shared/components/ui/ManagementForm/`)
   - Formulários dinâmicos de gerenciamento
   - Estados: visualização e edição
   - Validação e feedback de erros

## 📂 Organização por Módulos

### **🔐 auth/** - Autenticação
Contém todas as funcionalidades relacionadas a login, cadastro e recuperação de senha.

### **🏛️ institutional/** - Institucional
Páginas públicas do site (Home, Sobre, Contato, etc.).

### **🏠 management/** - Gerenciamento
Área privada pós-login para clientes e corretores gerenciarem seus perfis e propriedades.

### **🔧 shared/** - Compartilhado
Recursos utilizados por todos os módulos (componentes, hooks, serviços, utils).

## 🌍 Configuração de Múltiplos Ambientes

Este projeto suporta **3 ambientes distintos** com configurações específicas:

### **📋 Resumo dos Ambientes**

| **Ambiente**     | **Arquivo**         | **Descrição**         | **Uso**         |
| ---------------- | ------------------- | --------------------- | --------------- |
| **Development**  | `.env.development`  | Desenvolvimento local | `npm run dev`   |
| **Homologation** | `.env.homologation` | Testes e validação    | `npm run homol` |
| **Production**   | `.env.production`   | Ambiente de produção  | `npm run build` |

### **🔧 Configuração dos Arquivos de Ambiente**

#### **.env.development**

```bash
# Desenvolvimento Local
APP_MODEL=development
APP_VERSION=dev
APP_PORT=8080
APP_NAME=Corretora Penelope - DEV
APP_URL=http://localhost:3000
API_URL=
```

#### **.env.homologation**

```bash
# Homologação
APP_MODEL=homologation
APP_VERSION=homol
APP_PORT=3001
APP_NAME=Corretora Penelope - HOMOL
APP_URL=
API_URL=
```

#### **.env.production**

```bash
# Produção
APP_MODEL=production
APP_VERSION=1.0.0
APP_PORT=3002
APP_NAME=Corretora Penelope
APP_URL=
API_URL=
```

### **💻 Scripts por Ambiente**

```bash
# 🛠️ Desenvolvimento
npm run dev              # Usa .env.development

# 🏗️ Homologação
npm run homol            # Usa .env.homologation
npm run homol:build      # Build para homologação
npm run homol:preview    # Preview da build de homol

# 🚀 Produção
npm run build            # Usa .env.production (build para produção)
npm run preview          # Preview da build de produção

# 🔍 Utilitários
npm run env:check        # Mostra variáveis de ambiente ativas
npm run clean:envs       # Limpa cache de variáveis
npm run lint             # Verifica problemas no código
npm run lint:fix         # Corrige problemas automaticamente
```

### **🚦 Fluxo de Deploy por Ambiente**

```bash
# 1. Desenvolvimento → Homologação
npm run dev              # Desenvolva localmente
npm run lint:fix         # Corrija problemas
npm run homol:build      # Build para homologação
npm run homol            # Teste localmente
# Deploy para servidor de homologação

# 2. Homologação → Produção
npm run homol            # Teste final em homol
npm run build            # Build para produção
npm run preview          # Teste local da build
# Deploy para produção
```

### **⚠️ Importante: Controle de Versão**

#### **✅ DEVEM ir para o Git:**

- `.env.development` - Configurações de desenvolvimento
- `.env.homologation` - Configurações de homologação
- `.env.production` - Configurações de produção

#### **❌ NÃO DEVEM ir para o Git:**

- Arquivos com chaves de API sensíveis

## 🛠️ Configuração do Ambiente

### 1. Pré-requisitos

```bash
Node.js >= 18.0.0
npm >= 9.0.0
```

### 2. Instalação

```bash
# Clone o repositório
git clone [https://github.com/PenelopeCorretagem/penelope-web-site/tree/main]
cd penelope-web-site

# Instale as dependências
npm install
```

### 3. VS Code (Altamente Recomendado)

Este projeto inclui configurações padronizadas do VS Code para garantir consistência entre todos os desenvolvedores.

#### 🔌 Extensões Necessárias

O VS Code sugerirá automaticamente as extensões ao abrir o projeto. **Instale todas**:

- **Prettier - Code formatter** - Formatação automática de código
- **ESLint** - Linting e correção automática de problemas
- **Tailwind CSS IntelliSense** - Autocomplete para classes Tailwind

#### ⚙️ Configurações Automáticas Incluídas

✅ **Formatação automática** ao salvar (Ctrl+S)
✅ **Correção ESLint** automática ao salvar
✅ **Organização de imports** automática
✅ **Ordenação de classes Tailwind** automática
✅ **Indentação** padronizada (2 espaços)
✅ **Aspas simples** em JavaScript/JSX
✅ **Sem ponto e vírgula** no final das linhas
✅ **IntelliSense** otimizado para Tailwind CSS v4

### 4. Executar o Projeto

```bash
# Desenvolvimento (com hot reload)
npm run dev
# Aplicação disponível em: http://localhost:5173

# Build para produção
npm run build

# Preview da build de produção
npm run preview
```

## 📝 Convenções de Código

### Estrutura de Componentes

```jsx
// Componente simples (sem MVVM)
export function ComponentName({ prop1, prop2 }) {
  return <div>...</div>
}

// Componente com lógica (sem MVVM)
export function ComponentName(props) {
  const [state, setState] = useState()

  const handleAction = () => {
    // lógica
  }

  return <div>...</div>
}

// Componente MVVM (usa hook ViewModel)
export function ComponentView(props) {
  const vm = useComponentViewModel(props)

  return (
    <div className={vm.containerClasses}>
      <input
        value={vm.value}
        onChange={vm.handleChange}
        className={vm.inputClasses}
      />
    </div>
  )
}
```

### Nomenclatura

- **Componentes**: PascalCase (ex: `ButtonView.jsx`, `InputView.jsx`)
- **Hooks**: camelCase com prefixo `use` (ex: `useInputViewModel.js`)
- **Models**: PascalCase com sufixo `Model` (ex: `InputModel.js`)
- **ViewModels**: PascalCase com sufixo `ViewModel` (ex: `InputViewModel`)
- **Pastas**: PascalCase para componentes (ex: `Input/`, `ManagementForm/`)

## 📄 Licença

MIT License - veja o arquivo `LICENSE` para detalhes.
