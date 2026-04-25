# AuthTransitionView - Documentação

## 📋 Visão Geral

`AuthTransitionView` é um componente de transição visual que exibe durante operações de autenticação (login/logout). Substitui o antigo `LoadingView` com uma nomenclatura mais semântica e suporte completo a mobile.

## 🎯 Propósito

- Exibir feedback visual durante login/logout
- Indicar verificação de permissões em rotas protegidas
- Sincronizar entre abas do navegador
- Responsivo em mobile e desktop

## 📦 Componentes

### 1. **AuthTransitionView.jsx**
Componente de apresentação responsável pela UI.

```jsx
<AuthTransitionView 
  status="login" 
  message="Autenticando sua conta..."
/>
```

**Props:**
- `status` (string): `'login'` | `'logout'` | `'verifying'` - Define a mensagem padrão
- `message` (string, opcional): Mensagem customizada

### 2. **useAuthTransitionViewModel.js**
Hook que gerencia a lógica de transição.

```javascript
const { 
  isTransitioning,  // boolean - indica se está transitando
  status,           // string - status atual
  message,          // string - mensagem exibida
  showTransition,   // função - inicia transição
  hideTransition    // função - oculta transição
} = useAuthTransitionViewModel()
```

**Eventos suportados:**
- `authTransition` - Customizado: `{ detail: { type: 'login'|'logout', message?: string } }`
- `storage` - Detecta mudanças de token entre abas
- `authChanged` - Detecta mudanças de autenticação

### 3. **AuthTransitionModel.js**
Singleton que gerencia estado da transição (usar raramente).

```javascript
const model = AuthTransitionModel.getInstance()
model.startTransition('login', 'Autenticando...')
model.endTransition()
```

## 🔗 Integração com Login

### Passo 1: Adicionar ao PageView (✅ Já feito)

```jsx
import { AuthTransitionView } from '@shared/pages/AuthTransition/AuthTransitionView'
import { useAuthTransitionViewModel } from '@shared/pages/AuthTransition/useAuthTransitionViewModel'

export function PageView() {
  const { isTransitioning, status, message } = useAuthTransitionViewModel()
  
  return (
    <>
      {/* Componentes normais */}
      {isTransitioning && (
        <AuthTransitionView status={status} message={message} />
      )}
    </>
  )
}
```

### Passo 2: Disparar ao fazer Login

**Opção A: Na função de submissão (SignInPanel/AuthView)**

```javascript
const handleLoginSubmit = async (credentials) => {
  // Disparar transição
  window.dispatchEvent(new CustomEvent('authTransition', {
    detail: { 
      type: 'login', 
      message: 'Autenticando sua conta...' 
    }
  }))

  try {
    const response = await loginAPI.post('/login', credentials)
    
    // Salvar tokens
    sessionStorage.setItem('jwtToken', response.data.token)
    sessionStorage.setItem('userId', response.data.userId)
    sessionStorage.setItem('userRole', response.data.role)
    sessionStorage.setItem('_hadToken', 'true')
    
    // Disparar evento de auth
    window.dispatchEvent(new CustomEvent('authChanged'))
    
    // Aguardar transição terminar
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Redirecionar
    navigate('/') // ou a rota apropriada
  } catch (error) {
    // Esconder transição em caso de erro
    window.dispatchEvent(new CustomEvent('authTransition', {
      detail: { type: 'error', message: 'Erro ao autenticar' }
    }))
  }
}
```

**Opção B: Usar PageView.handleDevLogin como referência**

```javascript
const handleDevLogin = () => {
  window.dispatchEvent(new CustomEvent('authTransition', {
    detail: { type: 'login', message: 'Autenticando sua conta...' }
  }))

  setTimeout(() => {
    sessionStorage.setItem('jwtToken', `token-${Date.now()}`)
    sessionStorage.setItem('userRole', 'CLIENTE')
    sessionStorage.setItem('userId', '1')
    sessionStorage.setItem('_hadToken', 'true')
    window.dispatchEvent(new CustomEvent('authChanged'))
    window.location.href = '/'
  }, 500)
}
```

### Passo 3: Logout (✅ Já implementado)

**Sidebar:**
```javascript
// useSidebarViewModel.js
const handleLogout = useCallback(() => {
  window.dispatchEvent(new CustomEvent('authTransition', {
    detail: { type: 'logout', message: 'Encerrando sua sessão...' }
  }))
  
  setTimeout(() => {
    sessionStorage.removeItem('jwtToken')
    // ... remover mais tokens
    window.dispatchEvent(new CustomEvent('authChanged'))
    setTimeout(() => {
      window.location.href = '/'
    }, 300)
  }, 300)
}, [model])
```

**NavMenu:**
```javascript
// useNavMenuViewModel.js
const handleLogout = useCallback(() => {
  window.dispatchEvent(new CustomEvent('authTransition', {
    detail: { type: 'logout', message: 'Encerrando sua sessão...' }
  }))
  
  setTimeout(() => {
    sessionStorage.removeItem('jwtToken')
    // ... remover mais tokens
    setTimeout(() => {
      window.location.href = routerModel.get('HOME')
    }, 300)
  }, 300)
}, [model, routerModel])
```

## 🎨 Responsividade

O componente é totalmente responsivo com Tailwind:

| Aspecto | Mobile | Desktop |
|---------|--------|---------|
| Logo | 100px | 128px |
| Gap | gap-6 | gap-8 |
| Texto | base | lg |
| Spinner | 12x12 (w-12 h-12) | 16x16 (w-16 h-16) |
| Padding | px-6 | px-6 |

## ⏱️ Duração da Transição

Default: `1500ms` (1.5 segundos)

Para customizar:
```javascript
const { setTransitionDuration } = useAuthTransitionViewModel()
setTransitionDuration(2000) // 2 segundos
```

## 🔄 Sincronização Entre Abas

O hook detecta automaticamente:

1. **Logout em outra aba**: Se token for removido em outra aba
2. **Login em outra aba**: Via evento `storage`
3. **Eventos customizados**: Via `authTransition`

## 🧪 Exemplo de Uso Completo

```jsx
// Em AuthView ou SignInPanel
export function SignInPanel() {
  const [isLoading, setIsLoading] = useState(false)

  const handleLoginSubmit = async (credentials) => {
    setIsLoading(true)
    
    // Dispara transição visual
    window.dispatchEvent(new CustomEvent('authTransition', {
      detail: { type: 'login', message: 'Autenticando sua conta...' }
    }))

    try {
      const response = await api.login(credentials)
      
      // Salvar dados
      sessionStorage.setItem('jwtToken', response.token)
      sessionStorage.setItem('userId', response.userId)
      sessionStorage.setItem('userRole', response.role)
      sessionStorage.setItem('userEmail', response.email)
      sessionStorage.setItem('_hadToken', 'true')
      
      // Notificar PageView
      window.dispatchEvent(new CustomEvent('authChanged'))
      
      // Aguardar transição
      setTimeout(() => {
        navigate('/') // Redirecionar após transição visual
      }, 1500)
      
    } catch (error) {
      console.error('Login falhou:', error)
      // Mostrar erro ao usuário
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleLoginSubmit}>
      {/* Formulário */}
    </form>
  )
}
```

## 🐛 Troubleshooting

### A transição não aparece
- Verifique se `PageView` está importando `useAuthTransitionViewModel`
- Verifique se o evento é disparado corretamente: `window.dispatchEvent(new CustomEvent('authTransition', {...}))`

### A transição não desaparece
- Verifique se a duração padrão (1500ms) é suficiente
- Ajuste com `setTransitionDuration(novoValor)`

### Múltiplas transições simultâneas
- O hook gerencia automaticamente, mas evite disparar múltiplos eventos rapidamente

## 🗑️ Migração do LoadingView

O antigo `LoadingView` estava em `src/shared/pages/Loading/LoadingView.jsx` e pode ser removido.

**Substituições:**
- `<LoadingView />` → `<AuthTransitionView status="verifying" />`

## 📝 Notas

- Sempre use `sessionStorage` para tokens (não `localStorage`)
- Sempre dispare evento `authChanged` após mudar tokens
- A transição ocorre a nível global (PageView), não por componente
- O spinner usa CSS animado, sem dependências externas

