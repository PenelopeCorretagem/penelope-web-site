/**
 * PropertyTabsModel represents the data and validation logic for property tabs navigation.
 * It manages tabs, anchors, active state, and scroll detection configuration.
 *
 * @class
 */
export class PropertyTabsModel {
  constructor({ tabs = [], anchors = [] } = {}) {
    this.tabs = this.validateTabs(tabs)
    this.anchors = this.validateAnchors(anchors)
    this.activeTab = this.anchors[0] || ''
    this.isManualClick = false
    this.scrollConfig = {
      offset: 50,
      clickTimeout: 500
    }
  }

  validateTabs(tabs) {
    if (!Array.isArray(tabs)) {
      console.warn('PropertyTabsModel: tabs should be an array')
      return []
    }
    return tabs.filter(tab => typeof tab === 'string' && tab.trim() !== '')
  }

  validateAnchors(anchors) {
    if (!Array.isArray(anchors)) {
      console.warn('PropertyTabsModel: anchors should be an array')
      return []
    }
    return anchors.filter(anchor => typeof anchor === 'string' && anchor.trim() !== '')
  }

  setActiveTab(anchor) {
    if (this.anchors.includes(anchor)) {
      this.activeTab = anchor
      return true
    }
    return false
  }

  isTabActive(anchor) {
    return this.activeTab === anchor
  }

  setManualClick(value) {
    this.isManualClick = Boolean(value)
  }

  getTabByIndex(index) {
    return this.tabs[index] || null
  }

  getAnchorByIndex(index) {
    return this.anchors[index] || null
  }

  getTabData() {
    return this.tabs.map((tab, index) => ({
      tab,
      anchor: this.anchors[index],
      isActive: this.isTabActive(this.anchors[index])
    }))
  }

  hasValidData() {
    return this.tabs.length > 0 && this.anchors.length > 0 && this.tabs.length === this.anchors.length
  }
}
