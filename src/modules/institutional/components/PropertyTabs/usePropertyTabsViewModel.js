import { useState, useEffect, useCallback, useRef } from 'react'
import { PropertyTabsModel } from './PropertyTabsModel'

export function usePropertyTabsViewModel(anchors, tabs) {
  const [model] = useState(() => new PropertyTabsModel({ tabs, anchors }))
  const [activeTab, setActiveTab] = useState(model.activeTab)
  const isManualClick = useRef(false)

  const getDOMElements = useCallback(() => {
    const header = document.querySelector('header[role="banner"]')
    const tabsElement = document.querySelector('[data-tabs-component]')
    const headerHeight = header?.offsetHeight || 0
    const tabsHeight = tabsElement?.offsetHeight || 0

    return {
      header,
      tabsElement,
      headerHeight,
      tabsHeight,
      totalOffset: headerHeight + tabsHeight,
    }
  }, [])

  const checkActiveSection = useCallback(() => {
    const { totalOffset } = getDOMElements()
    const offset = totalOffset + model.scrollConfig.offset

    let activeSection = model.anchors[0]

    for (let i = 0; i < model.anchors.length; i++) {
      const element = document.getElementById(model.anchors[i])
      if (element) {
        const rect = element.getBoundingClientRect()

        if (rect.top <= offset && rect.bottom > offset) {
          activeSection = model.anchors[i]
          break
        }
        if (rect.top <= offset) {
          activeSection = model.anchors[i]
        }
      }
    }

    return activeSection
  }, [model.anchors, model.scrollConfig.offset, getDOMElements])

  const scrollToElement = useCallback(
    (anchor) => {
      const element = document.getElementById(anchor)
      if (!element) return false

      const { totalOffset } = getDOMElements()
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      const scrollPosition = elementPosition - totalOffset - 20

      window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth',
      })

      return true
    },
    [getDOMElements]
  )

  useEffect(() => {
    if (!model.hasValidData()) {
      console.warn('PropertyTabsViewModel: Invalid data provided')
      return
    }

    const handleScroll = () => {
      if (isManualClick.current) return

      const newActiveTab = checkActiveSection()
      setActiveTab((prev) => {
        if (prev !== newActiveTab) {
          model.setActiveTab(newActiveTab)
          return newActiveTab
        }
        return prev
      })
    }

    const initialActive = checkActiveSection()
    setActiveTab(initialActive)
    model.setActiveTab(initialActive)

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [checkActiveSection, model])

  const isTabActive = useCallback(
    (anchor) => {
      return model.isTabActive(anchor)
    },
    [activeTab, model]
  )

  const handleTabClick = useCallback(
    (anchor) => {
      if (!model.anchors.includes(anchor)) {
        console.warn(`PropertyTabsViewModel: Invalid anchor "${anchor}"`)
        return
      }

      setActiveTab(anchor)
      model.setActiveTab(anchor)
      isManualClick.current = true

      const scrollSuccess = scrollToElement(anchor)

      if (scrollSuccess) {
        setTimeout(() => {
          isManualClick.current = false
        }, model.scrollConfig.clickTimeout)
      } else {
        isManualClick.current = false
      }
    },
    [model, scrollToElement]
  )

  const getTabsData = useCallback(() => {
    return model.getTabData()
  }, [model, activeTab])

  return {
    activeTab,
    isTabActive,
    handleTabClick,
    getTabsData,
    hasValidData: model.hasValidData(),
    model,
  }
}
