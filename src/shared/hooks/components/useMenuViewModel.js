// modules/institutional/hooks/components/useMenuViewModel.js
import { useState, useCallback, useMemo, useEffect } from 'react'
import { MenuViewModel } from '../../viewmodel/components/MenuViewModel'
import { MenuModel } from '../../model/components/MenuModel'
import { routerService } from '@shared/services/RouterService'

/**
 * Hook para gerenciar estado e interações do MenuViewModel
 * Integra com RouterService para navegação
 * @param {boolean} initialAuth - Estado inicial de autenticação
 * @returns {Object} Estado, comandos e helpers do menu
 */
export function useMenuViewModel(initialAuth = false) {
  // Criar o viewModel uma única vez
  const [viewModel] = useState(() => {
    console.log('🏗️ Criando MenuViewModel...')
    const model = new MenuModel(initialAuth)
    return new MenuViewModel(model, routerService)
  })

  const [snapshot, setSnapshot] = useState(() => viewModel.getSnapshot())
  const [isLoading, setIsLoading] = useState(false)

  const updateSnapshot = useCallback(() => {
    const newSnapshot = viewModel.getSnapshot()
    console.log('📸 Atualizando snapshot:', newSnapshot)
    setSnapshot(newSnapshot)
  }, [viewModel])

  // Escuta mudanças de rota para atualizar o item ativo
  useEffect(() => {
    console.log('🔌 Configurando listeners de rota...')

    const handleRouteChange = ({ route, previous }) => {
      console.log(`🔄 Hook: rota mudou de ${previous} para ${route}`)
      viewModel.handleRouteChange(route)
      updateSnapshot()
    }

    // Adiciona o listener
    const removeListener =
      routerService.addRouteChangeListener(handleRouteChange)

    // Inicializa com a rota atual após um pequeno delay para garantir sincronização
    setTimeout(() => {
      const currentRoute = routerService.route
      console.log(`🎯 Inicializando com rota atual: ${currentRoute}`)
      viewModel.handleRouteChange(currentRoute)
      updateSnapshot()
    }, 0)

    // Cleanup
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
        setIsLoading(true)

        // Simula delay de navegação (remova se não quiser delay)
        setTimeout(() => {
          const result = viewModel.navigateToItem(itemId)

          if (result.success) {
            console.log(`✅ Hook: navegação bem-sucedida para ${result.route}`)
          } else {
            console.error(`❌ Hook: erro na navegação - ${result.error}`)
          }

          updateSnapshot()
          setIsLoading(false)
        }, 100) // Delay reduzido para melhor responsividade
      },

      setAuthentication: isAuth => {
        console.log(`🔐 Hook: mudando autenticação para ${isAuth}`)
        const result = viewModel.setAuthentication(isAuth)
        if (result.changed) {
          updateSnapshot()
        }
        return result
      },

      logout: () => {
        console.log('👋 Hook: fazendo logout...')
        const result = viewModel.logout()
        if (result.changed) {
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
        if (result.success) {
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

    // Comandos
    ...commands,

    // Funções auxiliares
    isItemActive: itemId => {
      const isActive = viewModel.isItemActive(itemId)
      console.log(`🎯 Hook: verificando se ${itemId} está ativo: ${isActive}`)
      return isActive
    },

    isRouteActive: route => viewModel.isRouteActive(route),

    // ViewModel para casos especiais
    viewModel,
  }
}
