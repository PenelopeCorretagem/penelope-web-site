import { useState } from 'react'
import { HeaderView } from '@shared/components/layout/Header/HeaderView'
import { RouterView } from '@routes/RouterView'
import { ChatbotView } from '@shared/components/ui/Chatbot/ChatbotView'
import { SidebarView } from '@shared/components/layout/Sidebar/SidebarView'
import { AuthTransitionView } from '@shared/pages/AuthTransition/AuthTransitionView'
import { useAuthTransitionViewModel } from '@shared/pages/AuthTransition/useAuthTransitionViewModel'
import { usePageViewModel } from './usePageViewModel'

/**
 * PageView - Componente raiz da aplicação
 */

export function PageView() {
  const {
    isAuthenticated,
    isAdmin,
    authReady,
    isAuthPage,
    shouldShowFooter,
    shouldShowSidebar,
  } = usePageViewModel()

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { isTransitioning, status, message } = useAuthTransitionViewModel()

  return (
    <div className='flex h-screen w-full overflow-hidden'>
      {shouldShowSidebar && (
        <div className="hidden md:flex">
          <SidebarView
            open={sidebarOpen}
            onToggle={() => setSidebarOpen(p => !p)}
            isAdmin={isAdmin}
          />
        </div>
      )}
      <div className='flex flex-col w-full h-full overflow-hidden'>
        {!isAuthPage && (
          <HeaderView isAuthenticated={isAuthenticated} isAdmin={isAdmin} sidebarVisible={shouldShowSidebar} />
        )}
        <div className='flex-1 overflow-x-hidden overflow-y-hidden'>
          <RouterView
            isAuthenticated={isAuthenticated}
            isAdmin={isAdmin}
            authReady={authReady}
            shouldShowFooter={shouldShowFooter}
          />
          <ChatbotView />
        </div>
      </div>

      {isTransitioning && <AuthTransitionView status={status} message={message} />}
    </div>
  )
}
