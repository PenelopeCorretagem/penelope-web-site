import { useState, useCallback, useMemo, useEffect } from 'react'
import { MenuViewModel } from '../../viewmodel/components/MenuViewModel'
import { MenuModel } from '../../model/components/MenuModel'
import { routerService } from '@shared/services/RouterService'

export function useMenuViewModel(isAuthenticated = false, _variant = 'navigation') {
  const [viewModel] = useState(() => {
    const model = new MenuModel(isAuthenticated)
    return new MenuViewModel(model, routerService)
  })

  // eslint-disable-next-line no-unused-vars
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  useEffect(() => {
    const handleRouteChange = () => {
      setCurrentPath(window.location.pathname)
    }

    window.addEventListener('popstate', handleRouteChange)
    return () => window.removeEventListener('popstate', handleRouteChange)
  }, [])

  const [snapshot, setSnapshot] = useState(() => viewModel.getSnapshot())
  const [isLoading, setIsLoading] = useState(false)

  const updateSnapshot = useCallback(() => {
    const newSnapshot = viewModel.getSnapshot()
    console.log('📸 Atualizando snapshot:', {
      activeItem: newSnapshot.activeItem,
      currentRoute: newSnapshot.currentRoute,
      menuItemsCount: newSnapshot.menuItems.length,
      userActionsCount: newSnapshot.userActions.length,
    })
    setSnapshot(newSnapshot)
  }, [viewModel])

  // Sincroniza estado de autenticação quando muda
  useEffect(() => {
    console.log(
      `🔐 useMenuViewModel: atualizando autenticação para ${isAuthenticated}`
    )

    const result = viewModel.setAuthentication(isAuthenticated)

    if (result && result.changed) {
      console.log('✅ Estado de autenticação mudou, atualizando snapshot')
      updateSnapshot()
    }
  }, [isAuthenticated, viewModel, updateSnapshot])

  useEffect(() => {
    console.log('🔌 Configurando listeners de rota...')

    const handleRouteChange = ({ route, previous }) => {
      console.log(`🔄 Hook: rota mudou de ${previous} para ${route}`)
      console.log(`📍 Estado antes da mudança:`)
      console.log(`  - Item ativo: ${viewModel.model.activeItem}`)
      console.log(`  - Rota atual: ${viewModel.routerService?.route}`)

      viewModel.handleRouteChange(route)

      console.log(`📍 Estado após a mudança:`)
      console.log(`  - Item ativo: ${viewModel.model.activeItem}`)
      console.log(`  - Rota atual: ${viewModel.routerService?.route}`)

      updateSnapshot()
    }

    const removeListener =
      routerService.addRouteChangeListener(handleRouteChange)

    // Inicializa com a rota atual e força uma verificação
    setTimeout(() => {
      const currentRoute = routerService.route
      console.log(`🎯 Inicializando com rota atual: ${currentRoute}`)
      console.log(`📊 Estado inicial do modelo:`)
      console.log(`  - Item ativo: ${viewModel.model.activeItem}`)
      console.log(`  - Items disponíveis:`)

      const allItems = [...viewModel.menuItems, ...viewModel.userActions]
      allItems.forEach(item => {
        console.log(
          `    - ${item.id}: ${item.route} (${item.label || 'sem label'})`
        )
      })

      viewModel.handleRouteChange(currentRoute)
      updateSnapshot()
    }, 0)

    return () => {
      console.log('🧹 Removendo listeners...')
      if (typeof removeListener === 'function') {
        removeListener()
      } else {
        routerService.removeRouteChangeListener(handleRouteChange)
      }
    }
  }, [viewModel, updateSnapshot])

  const commands = useMemo(
    () => ({
      handleItemClick: itemId => {
        console.log(`🖱️ Hook: clique no item ${itemId}`)
        console.log(`📍 Estado antes do clique:`)
        console.log(`  - Item ativo: ${viewModel.model.activeItem}`)
        console.log(`  - Rota atual: ${routerService.route}`)

        setIsLoading(true)

        setTimeout(() => {
          const result = viewModel.navigateToItem(itemId)

          console.log(`📍 Estado após navegação:`)
          console.log(`  - Item ativo: ${viewModel.model.activeItem}`)
          console.log(`  - Rota atual: ${routerService.route}`)
          console.log(`  - Resultado:`, result)

          if (result && result.success) {
            console.log(`✅ Hook: navegação bem-sucedida para ${result.route}`)
          } else if (result) {
            console.error(`❌ Hook: erro na navegação - ${result.error}`)
          } else {
            console.log('⚠️ Hook: resultado indefinido da navegação')
          }

          updateSnapshot()
          setIsLoading(false)
        }, 100)
      },

      setAuthentication: isAuth => {
        console.log(`🔐 Hook: mudando autenticação para ${isAuth}`)
        const result = viewModel.setAuthentication(isAuth)
        if (result && result.changed) {
          updateSnapshot()
        }
        return result
      },

      logout: () => {
        console.log('👋 Hook: fazendo logout...')
        const result = viewModel.logout()
        if (result && result.changed) {
          updateSnapshot()
        }
        return result
      },

      clearErrors: () => {
        viewModel.clearErrors()
        updateSnapshot()
      },

      navigateToRoute: route => {
        console.log(`🔀 Hook: navegação direta para ${route}`)
        const result = viewModel.navigateToRoute(route)
        if (result && result.success) {
          updateSnapshot()
        }
        return result
      },

      goBack: () => {
        console.log('⬅️ Hook: voltando página...')
        return routerService.goBack()
      },
    }),
    [viewModel, updateSnapshot]
  )

  // Debug: log das mudanças do snapshot
  useEffect(() => {
    console.log('📊 Snapshot atual:', {
      isAuthenticated: snapshot.isAuthenticated,
      activeItem: snapshot.activeItem,
      currentRoute: snapshot.currentRoute,
      menuItems: snapshot.menuItems.map(item => ({
        id: item.id,
        label: item.label,
        route: item.route,
      })),
      userActions: snapshot.userActions.map(action => ({
        id: action.id,
        label: action.label,
        route: action.route,
      })),
    })
  }, [snapshot])

  return {
    // Estado observável
    menuItems: snapshot.menuItems,
    userActions: snapshot.userActions,
    activeItem: snapshot.activeItem,
    currentRoute: snapshot.currentRoute,
    isAuthenticated: snapshot.isAuthenticated,
    hasErrors: snapshot.hasErrors,
    errorMessages: snapshot.errorMessages,
    isLoading,
    isMobileMenuOpen: snapshot.isMobileMenuOpen,

    // Footer-specific data
    footerSections: viewModel.footerSections,
    getFooterItem: viewModel.getFooterItem.bind(viewModel),

    // Comandos
    ...commands,

    // Funções auxiliares
    isItemActive: itemId => {
      const isActive = viewModel.isItemActive(itemId)
      console.log(`🎯 Hook: verificando se ${itemId} está ativo: ${isActive}`)
      console.log(`  - Item ativo no modelo: ${viewModel.model.activeItem}`)
      console.log(`  - Rota atual: ${routerService.route}`)

      return isActive
    },

    isRouteActive: route => viewModel.isRouteActive(route),

    // Mobile menu controls
    toggleMobileMenu: () => {
      console.log('📱 Hook: alternando menu mobile')
      viewModel.toggleMobileMenu()
      updateSnapshot()
    },

    closeMobileMenu: () => {
      console.log('📱 Hook: fechando menu mobile')
      viewModel.closeMobileMenu()
      updateSnapshot()
    },
  }
}
