export class PropertiesCarouselModel {
  constructor(items) {
    this.originalItems = items
    // Cria array infinito: clones no início e no fim
    this.items = this.createInfiniteArray(items)
    this.currentIndex = items.length // Começa no primeiro item real (após os clones)
    this.cloneCount = items.length
  }

  createInfiniteArray(items) {
    if (items.length === 0) return []
    // Adiciona clones: [clones finais] + [items originais] + [clones iniciais]
    return [...items, ...items, ...items]
  }

  getItems() {
    return this.items
  }

  getOriginalItems() {
    return this.originalItems
  }

  getCurrentIndex() {
    return this.currentIndex
  }

  setCurrentIndex(index) {
    this.currentIndex = index
  }

  getTotalItems() {
    return this.items.length
  }

  getCloneCount() {
    return this.cloneCount
  }

  getOriginalLength() {
    return this.originalItems.length
  }

  // Normaliza o índice para o item real correspondente
  getRealIndex() {
    const originalLength = this.originalItems.length
    if (originalLength === 0) return 0
    return ((this.currentIndex % originalLength) + originalLength) % originalLength
  }
}
