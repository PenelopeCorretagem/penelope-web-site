# 🏢 Corretora Penelope - Frontend

Sistema de gerenciamento de anúncios de imóveis e agendamento de visitas com React 19 + Tailwind CSS v4 + Vite. **Arquitetura MVVM frontend** separando funcionalidades por domínio de negócio (autenticação, institucional, compartilhado e gerenciamento).

## 🚀 Tecnologias

- **React 19.1.1** - Biblioteca JavaScript para interfaces de usuário
- **Tailwind CSS v4.1.13** - Framework CSS utility-first (versão mais recente)
- **Vite 7.1.2** - Build tool e servidor de desenvolvimento ultra-rápido
- **ESLint 9** - Linter com configuração flat config para qualidade de código
- **Prettier 3** - Formatador de código com plugin Tailwind
- **Arquitetura MVVM** - Model-View-ViewModel para frontend React

## 🏗️ Arquitetura MVVM do Projeto

```
penelope-web-site/
├── .vscode/                    # 🛠️ Configurações VS Code (compartilhadas)
│   ├── extensions.json         #    Extensões recomendadas
│   └── settings.json           #    Configurações padronizadas do projeto
├── node_modules/               # 📦 Dependências
├── public/                     # 🌐 Assets estáticos
└── src/
    ├── management/                 # 🏠 Área Privada Pós-Login (Clientes + Corretores)
    │   ├── 📁 assets/              #     Assets específicos
    │   ├── 📊 model/               #     Models do management (User, Property, etc.)
    │   │   ├── 🧩 components/      #     Componentes específicos do management model
    │   │   └── 📄 pages/           #     Pages relacionadas ao management model
    │   ├── 🔧 service/             #     Serviços e APIs do management
    │   ├── 👁️ view/                #     Views e layouts do management
    │   │   ├── 🧩 components/      #     Componentes do management
    │   │   └── 📄 pages/           #     Pages do management
    │   └── 🎯 viewmodel/           #     ViewModels do management
    │       ├── 🧩 components/      #     Componentes específicos do management viewmodel
    │       └── 📄 pages/           #     Pages relacionadas ao management viewmodel
    ├── auth/                   # 🔐 Módulo de Autenticação (MVVM)
    │   ├── 📁 assets/          #     Assets específicos de auth
    │   ├── 📊 model/           #     Models de usuário, login, etc.
    │   │   ├── 🧩 components/  #     Componentes específicos do auth model
    │   │   └── 📄 pages/       #     Pages relacionadas ao auth model
    │   ├── 🔧 service/         #     APIs de autenticação
    │   ├── 👁️ view/            #     Views de autenticação
    │   │   ├── 🧩 components/  #     Componentes de view (LoginForm, etc.)
    │   │   └── 📄 pages/       #     Pages de view (Login, Cadastro, etc.)
    │   └── 🎯 viewmodel/       #     ViewModels de auth (lógica de login)
    │       ├── 🧩 components/  #     Componentes específicos do auth viewmodel
    │       └── 📄 pages/       #     Pages relacionadas ao auth viewmodel
    ├── institutional/          # 🏛️ Módulo Institucional (MVVM)
    │   ├── 📁 assets/          #     Assets específicos institucionais
    │   ├── 📊 model/           #     Models institucionais (empresa, etc.)
    │   │   ├── 🧩 components/  #     Componentes específicos do institutional model
    │   │   └── 📄 pages/       #     Pages relacionadas ao institutional model
    │   ├── 🔧 service/         #     APIs institucionais
    │   ├── 👁️ view/            #     Views institucionais
    │   │   ├── 🧩 components/  #     Componentes institucionais
    │   │   └── 📄 pages/       #     Pages (Home, Sobre, Contato, etc.)
    │   └── 🎯 viewmodel/       #     ViewModels institucionais
    │       ├── 🧩 components/  #     Componentes específicos do institutional viewmodel
    │       └── 📄 pages/       #     Pages relacionadas ao institutional viewmodel
    ├── shared/                 # 🔧 Recursos compartilhados (MVVM)
    │   ├── 📁 assets/          #     Assets globais
    │   ├── 📊 model/           #     Models compartilhados
    │   │   ├── 🧩 components/  #     Componentes específicos do shared model
    │   │   └── 📄 pages/       #     Pages relacionadas ao shared model
    │   ├── 🔧 service/         #     APIs e serviços globais
    │   ├── 👁️ view/            #     Views e layouts globais
    │   │   ├── 🧩 components/  #     Componentes reutilizáveis globais
    │   │   └── 📄 pages/       #     Pages compartilhadas (404, etc.)
    │   ├── 🎯 viewmodel/       #     ViewModels compartilhados
    │   │   ├── 🧩 components/  #     Componentes específicos do shared viewmodel
    │   │   └── 📄 pages/       #     Pages relacionadas ao shared viewmodel
    │   └── utils/              #     Funções auxiliares
    ├── App.jsx                 # ⚛️ Componente raiz
    ├── index.css               # 🎨 Configuração base Tailwind
    └── main.jsx                # 🚀 Entry point da aplicação
├── .env.development            # 🔧 Variáveis de ambiente - Desenvolvimento
├── .env.homologation           # 🏗️ Variáveis de ambiente - Homologação
├── .env.production             # 🚀 Variáveis de ambiente - Produção
├── .gitignore                  # 📝 Arquivos ignorados pelo Git
├── .prettierrc                 # 💅 Configuração Prettier
├── eslint.config.js            # 📏 Configuração ESLint (flat config)
├── index.html                  # 📄 Template HTML principal
├── package.json                # 📦 Dependências e scripts
├── package-lock.json           # 🔒 Lock de dependências
├── README.md                   # 📖 Este arquivo
└── vite.config.js              # ⚡ Configuração Vite
```

## 🏛️ Padrão MVVM por Módulo

### **📁 Estrutura Padrão de Cada Módulo**

Todos os módulos (`management/`, `auth/`, `institutional/`, `shared/`) seguem rigorosamente o padrão MVVM com organização granular:

```
modulo/
├── 📁 assets/          # Recursos estáticos do módulo
├── 📊 model/           # 🎯 MODEL - Entidades e dados
│   ├── 🧩 components/  #     Componentes específicos do model
│   └── 📄 pages/       #     Pages relacionadas ao model
├── 🔧 service/         # 🎯 Camada de serviços e APIs
├── 👁️ view/            # 🎯 VIEW - Apresentação pura
│   ├── 🧩 components/  #     Componentes de view
│   └── 📄 pages/       #     Pages de view
└── 🎯 viewmodel/       # 🎯 VIEWMODEL - Lógica de apresentação
    ├── 🧩 components/  #     Componentes específicos do viewmodel
    └── 📄 pages/       #     Pages relacionadas ao viewmodel
```

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

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

### 3. VS Code (Altamente Recomendado)

Este projeto inclui configurações padronizadas do VS Code para garantir consistência entre todos os desenvolvedores.

#### 🔌 Extensões Necessárias

O VS Code sugerirá automaticamente as extensões ao abrir o projeto. **Instale todas**:

- **Prettier - Code formatter** - Formatação automática de código
- **ESLint** - Linting e correção automática de problemas
- **TypeScript and JavaScript Language Features** - IntelliSense melhorado

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

## 📄 Licença

MIT License - veja o arquivo `LICENSE` para detalhes.
