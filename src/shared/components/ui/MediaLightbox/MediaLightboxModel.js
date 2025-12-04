// MediaLightboxModel.js
export class MediaLightboxModel {
  constructor({ media = [], type = 'gallery', startIndex = 0 } = {}) {
    this.media = Array.isArray(media) ? media : [] // array of { type: 'image'|'video'|'floorplan', url }
    this.type = type
    this.currentIndex = Number.isFinite(startIndex) ? startIndex : 0
    this.isOpen = false
  }


  open({ media = [], type = 'gallery', startIndex = 0 } = {}) {
    this.media = Array.isArray(media) ? media : []
    this.type = type
    this.currentIndex = Math.max(0, Math.min(startIndex || 0, this.media.length - 1))
    this.isOpen = true
    return true
  }


  close() {
    this.isOpen = false
    return true
  }


  next() {
    if (this.media.length === 0) return false
    this.currentIndex = (this.currentIndex + 1) % this.media.length
    return true
  }


  prev() {
    if (this.media.length === 0) return false
    this.currentIndex = (this.currentIndex - 1 + this.media.length) % this.media.length
    return true
  }


  setIndex(i) {
    const idx = Number(i)
    if (!Number.isFinite(idx) || idx < 0 || idx >= this.media.length) return false
    this.currentIndex = idx
    return true
  }


  get current() {
    return this.media[this.currentIndex] || null
  }


  get isVideo() {
    return !!this.current && this.current.type === 'video'
  }


  get isImage() {
    return !!this.current && this.current.type === 'image'
  }


  get isFloorplan() {
    return !!this.current && this.current.type === 'floorplan'
  }
}
