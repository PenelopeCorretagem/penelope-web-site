export class PropertiesCarouselViewModel {
  constructor(model, updateView) {
    this.model = model
    this.updateView = updateView
    this.isAnimating = false
    this.isDragging = false
    this.startX = 0
    this.currentTranslate = 0
    this.prevTranslate = 0
  }

  next() {
    if (this.isAnimating || this.isDragging) return

    const currentIndex = this.model.getCurrentIndex()
    this.model.setCurrentIndex(currentIndex + 1)
    this.updateView()
  }

  previous() {
    if (this.isAnimating || this.isDragging) return

    const currentIndex = this.model.getCurrentIndex()
    this.model.setCurrentIndex(currentIndex - 1)
    this.updateView()
  }

  goToSlide(realIndex) {
    if (this.isAnimating || this.isDragging) return

    const cloneCount = this.model.getCloneCount()
    // Vai para o item real no meio do array
    this.model.setCurrentIndex(cloneCount + realIndex)
    this.updateView()
  }

  // Verifica se precisa reposicionar para criar loop infinito
  checkInfiniteLoop() {
    const currentIndex = this.model.getCurrentIndex()
    const cloneCount = this.model.getCloneCount()
    const _originalLength = this.model.getOriginalLength()

    // Se chegou no final dos clones finais, volta para o início real
    if (currentIndex >= cloneCount * 2) {
      this.model.setCurrentIndex(cloneCount)
      return true
    }

    // Se chegou no início dos clones iniciais, vai para o final real
    if (currentIndex < cloneCount) {
      this.model.setCurrentIndex(cloneCount * 2 - 1)
      return true
    }

    return false
  }

  setAnimating(value) {
    this.isAnimating = value
  }

  startDrag(clientX) {
    this.isDragging = true
    this.startX = clientX
    this.prevTranslate = this.model.getCurrentIndex() * -33.333
  }

  onDrag(clientX) {
    if (!this.isDragging) return this.prevTranslate

    const currentX = clientX
    const diff = currentX - this.startX
    const percentageMoved = (diff / window.innerWidth) * 100
    this.currentTranslate = this.prevTranslate + percentageMoved

    return this.currentTranslate
  }

  endDrag() {
    if (!this.isDragging) return

    this.isDragging = false
    const movedBy = this.currentTranslate - this.prevTranslate

    // Se moveu mais de 10% da largura, muda de slide
    if (movedBy < -10) {
      this.next()
    } else if (movedBy > 10) {
      this.previous()
    } else {
      // Volta para a posição original
      this.updateView()
    }
  }

  getDragging() {
    return this.isDragging
  }
}
