import { HeadingView } from '@shared/components/ui/Heading/HeadingView.jsx'
import { useAdvertisementTabsViewModel } from './useAdvertisementTabsViewModel'

export function AdvertisementTabsView({ tabs, anchors }) {
  const {
    handleTabClick,
    getTabsData,
    hasValidData
  } = useAdvertisementTabsViewModel(anchors, tabs)

  if (!hasValidData) {
    console.warn('AdvertisementTabsView: Invalid props provided')
    return null
  }

  const tabsData = getTabsData()

  return (
    <nav
      className="bg-default-light-alt px-section-x md:px-section-x-md py-4 md:py-6"
      data-tabs-component
      role="tablist"
      aria-label="Advertisement sections navigation"
    >
      <ul className="flex items-center justify-between md:justify-start gap-2 md:gap-subsection md:gap-subsection-md flex-wrap md:flex-nowrap">
        {tabsData.map(({ tab, anchor, isActive }) => (
          <li key={anchor} role="none">
            <button
              type="button"
              className={`uppercase font-medium transition-colors duration-200 focus:outline-none cursor-pointer ${
                isActive
                  ? 'text-distac-primary'
                  : 'text-default-dark hover:text-distac-primary'
              }`}
              onClick={() => handleTabClick(anchor)}
              role="tab"
              aria-selected={isActive}
              aria-controls={anchor}
              id={`tab-${anchor}`}
            >
              <HeadingView
                level={5}
                className="transition-colors duration-200 !text-current text-xs md:text-base"
              >
                {tab}
              </HeadingView>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
