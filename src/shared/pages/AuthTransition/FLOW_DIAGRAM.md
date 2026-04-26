# 📊 Fluxo de AuthTransition - Diagrama

## 🔐 Fluxo de LOGIN com Transição

```
┌─────────────────────────────────────────────────────────────────┐
│                     USUÁRIO NA PÁGINA DE LOGIN                   │
│  (AuthView com SignInPanel ativado)                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Clica em "Entrar" com credenciais
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  handleLoginSubmit() é chamado                                   │
│  - Valida credenciais localmente                                │
│  - Dispara evento: authTransition { type: 'login' }             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ╔═══════════════════════════════════════════════════════╗
        ║ AuthTransitionView RENDERIZA EM PageView             ║
        ║ ─────────────────────────────────────────────────    ║
        ║ • Logo pulsando                                       ║
        ║ • Spinner circular girando                            ║
        ║ • Texto: "Autenticando sua conta..."                  ║
        ║ • 3 pontos animados de progresso                      ║
        ║                                                       ║
        ║ Duração: 1500ms (configurável)                        ║
        ╚═══════════════════════════════════════════════════════╝
                              │
                              │ Simultaneamente (não bloqueia UI)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  API Request: POST /auth/login (com credentials)                │
│  - Valida credenciais no backend                               │
│  - Retorna: { token, userId, role, email }                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ (após ~300ms do início da transição)
┌─────────────────────────────────────────────────────────────────┐
│  Salvar tokens em sessionStorage:                               │
│  - jwtToken: "eyJ0eXAiOiJKV1QiLC..."                            │
│  - userId: "12345"                                              │
│  - userRole: "CLIENTE" | "ADMINISTRADOR"                       │
│  - userEmail: "user@example.com"                               │
│  - hadToken: "true" (flag para sincronização)                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Disparar evento: authChanged                                   │
│  - PageView detecta mudança                                     │
│  - isAuthenticated muda para true                              │
│  - SidebarView aparece (se não estava)                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ (aguarda até 1200ms restantes)
                              ▼
        ╔═══════════════════════════════════════════════════════╗
        ║ AuthTransitionView DESAPARECE                         ║
        ║ (totalTime ≈ 1500ms)                                  ║
        ╚═══════════════════════════════════════════════════════╝
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  window.location.href = '/'                                     │
│  - Navegação para home                                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│        ✅ USUÁRIO LOGADO NA HOME PAGE                           │
│    Sidebar visível + Header com opções de admin                 │
└─────────────────────────────────────────────────────────────────┘
```

## 🔓 Fluxo de LOGOUT com Transição

```
┌─────────────────────────────────────────────────────────────────┐
│           USUÁRIO CLICOU EM "SAIR" (Sidebar ou NavMenu)         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  handleLogout() é chamado (useSidebarViewModel)                 │
│  - Dispara evento: authTransition { type: 'logout' }            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ╔═══════════════════════════════════════════════════════╗
        ║ AuthTransitionView RENDERIZA EM PageView             ║
        ║ ─────────────────────────────────────────────────    ║
        ║ • Logo pulsando                                       ║
        ║ • Spinner circular girando                            ║
        ║ • Texto: "Encerrando sua sessão..."                   ║
        ║ • 3 pontos animados de progresso                      ║
        ║                                                       ║
        ║ Duração: 1500ms                                       ║
        ╚═══════════════════════════════════════════════════════╝
                              │
                              │ (aguarda ~300ms)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Remover tokens de sessionStorage:                              │
│  - jwtToken (removido)                                          │
│  - userRole (removido)                                          │
│  - userId (removido)                                            │
│  - userEmail (removido)                                         │
│  - userName (removido)                                          │
│  - token (removido)                                             │
│  - hadToken (removido)                                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Disparar evento: authChanged                                   │
│  - PageView detecta mudança                                     │
│  - isAuthenticated muda para false                             │
│  - SidebarView desaparece                                       │
│  - NavMenu muda para modo público                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ (aguarda ~1200ms restantes)
                              ▼
        ╔═══════════════════════════════════════════════════════╗
        ║ AuthTransitionView DESAPARECE                         ║
        ║ (totalTime ≈ 1500ms)                                  ║
        ╚═══════════════════════════════════════════════════════╝
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  window.location.href = '/'                                     │
│  - Navegação para home pública                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│        ✅ USUÁRIO DESLOGADO NA HOME PAGE                        │
│    Sem Sidebar, NavMenu em modo público                         │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Sincronização Entre Abas

```
┌─────────────────────────────────────────────────────────────────┐
│  ABA 1 (Login Page)          │         ABA 2 (Home Page)       │
├─────────────────────────────────────────────────────────────────┤
│                             │                                   │
│  Usuário clica "Entrar"      │  Aguardando... (ouvindo events) │
│         │                    │          ▲                      │
│         ▼                    │          │                      │
│  Tokens salvos em            │          │                      │
│  sessionStorage              │          │                      │
│         │                    │          │                      │
│         └────────────────────┼──────────┘                      │
│                              │ Storage event detectado          │
│  Evento 'authChanged'        │ (nova tab sincroniza)            │
│  disparado em ABA 1          │         │                      │
│         │                    │         ▼                      │
│         │                    │  isAuthenticated atualizado     │
│         │                    │  Sidebar aparece                │
│         │                    │  NavMenu atualiza               │
│         ▼                    │         │                       │
│  Redireciona para home       │         ▼                       │
│                              │  Ambas abas sincronizadas ✅    │
└─────────────────────────────────────────────────────────────────┘
```

## 📱 Responsividade - Mobile vs Desktop

```
MOBILE (< 768px)              DESKTOP (≥ 768px)
┌─────────────────┐           ┌──────────────────────┐
│ Logo: 100px     │           │ Logo: 128px          │
│ Gap: gap-6      │           │ Gap: gap-8           │
│ Text: base      │           │ Text: lg             │
│ Spinner: 12x12  │           │ Spinner: 16x16       │
│                 │           │                      │
│ "Autenticando"  │           │ "Autenticando sua"   │
│ "sua conta..."  │           │ "conta..."           │
│                 │           │                      │
│ Padding: px-6   │           │ Padding: px-6        │
└─────────────────┘           └──────────────────────┘
```

## 🎨 Composição do AuthTransitionView

```
┌─────────────────────────────────────────────────────────┐
│  LAYER: fixed inset-0 z-[10000]                         │
│  └─ Fundo: gradiente rosa→marrom com blur               │
│                                                          │
│  LAYER: relative z-10 (acima do fundo)                  │
│  ├─ Logo (animate-pulse)                                │
│  │  └─ LogoView variant="mark" height=100/128          │
│  │                                                      │
│  ├─ Spinner (CSS @keyframes spin)                       │
│  │  ├─ Border: rgba(255,255,255, 0.2)                  │
│  │  └─ Animação: 360° em 1.2s infinita                │
│  │                                                      │
│  ├─ Mensagem de Status                                  │
│  │  ├─ Texto principal: base/lg font-medium white       │
│  │  └─ 3 pontos animados (animate-bounce)              │
│  │                                                      │
│  └─ Mensagem secundária (small, opacity-80)            │
│     "Isso pode levar alguns segundos"                  │
└─────────────────────────────────────────────────────────┘
```

## 🔌 Eventos e Listeners

```
EVENT FLOW:
──────────

1. LOGIN
   ├─ window.dispatchEvent(authTransition { type: 'login' })
   │  └─ useAuthTransitionViewModel listening
   │     └─ setIsTransitioning(true), setStatus('login')
   │
   ├─ API Request /auth/login
   │
   ├─ sessionStorage.setItem('jwtToken', token)
   │  └─ Storage event disparado
   │     └─ Outras abas ouvem via window.addEventListener('storage')
   │
   └─ window.dispatchEvent(authChanged)
      └─ PageView.useEffect listening
         └─ checkAuth(), atualiza isAuthenticated


2. LOGOUT
   ├─ window.dispatchEvent(authTransition { type: 'logout' })
   │  └─ useAuthTransitionViewModel listening
   │
   ├─ sessionStorage.removeItem('jwtToken')
   │  └─ Storage event disparado
   │     └─ Outras abas sincronizam
   │
   └─ window.dispatchEvent(authChanged)
      └─ PageView atualiza isAuthenticated = false


3. SYNC ENTRE ABAS
   ├─ ABA 1: sessionStorage.setItem('token', ...)
   │
   ├─ Storage event gerado automaticamente
   │
   └─ ABA 2: window.addEventListener('storage', (e) => {
        if (e.key === 'jwtToken') {
          // ABA 2 sincroniza com ABA 1
        }
      })
```

## 🐛 Estados Possíveis

```
┌────────────────────────────────────────────┐
│ AuthTransitionView Estado                  │
├────────────────────────────────────────────┤
│                                            │
│ ✗ Não renderiza                            │
│   isTransitioning = false                  │
│   (Comportamento normal)                   │
│                                            │
│ ✓ Renderiza - LOGIN                        │
│   status = 'login'                         │
│   message = 'Autenticando sua conta...'    │
│   isTransitioning = true                   │
│   duration = 1500ms                        │
│                                            │
│ ✓ Renderiza - LOGOUT                       │
│   status = 'logout'                        │
│   message = 'Encerrando sua sessão...'    │
│   isTransitioning = true                   │
│   duration = 1500ms                        │
│                                            │
│ ✓ Renderiza - VERIFYING                    │
│   status = 'verifying'                     │
│   message = 'Verificando acesso...'       │
│   isTransitioning = true                   │
│   (Em rotas protegidas durante carregamento)
│                                            │
└────────────────────────────────────────────┘
```

## 📋 Checklist de Integração

```
ANTES DE IR PARA PRODUÇÃO:

□ AuthTransitionView renderiza em PageView?
□ Evento 'authTransition' é disparado ao logar?
□ Tokens são salvos em sessionStorage?
□ Evento 'authChanged' é disparado após salvar tokens?
□ Transição exibe por ~1.5 segundos?
□ Redirecionamento funciona após transição?
□ Logout dispara transição também?
□ Sincronização entre abas funciona?
□ Responsividade mobile/desktop ok?
□ Erros de login são tratados corretamente?
□ AuthTransitionView desaparece em caso de erro?
□ Arquivo antigo LoadingView foi removido?
```

