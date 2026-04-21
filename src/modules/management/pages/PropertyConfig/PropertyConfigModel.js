import { formatAreaForDisplay, formatAreaForDatabase } from '@shared/utils/area/formatAreaUtil'

/**
 * Modelo de dados para configuração de propriedade
 */
export class PropertyConfigModel {
  constructor(advertisement = null) {


    this.id = advertisement?.id || null
    this.active = advertisement?.active !== undefined ? advertisement.active : true
    this.displayEndDate = advertisement?.endDate ? this._formatDate(advertisement.endDate) : ''

    // Access Estate entity getters (not private properties)
    const estate = advertisement?.estate
    this.propertyTitle = estate?.title || ''
    this.propertyType = estate?.type?.key || 'DISPONIVEL'
    this.propertyDescription = estate?.description || ''
    this.area = estate?.area || ''
    this.numberOfRooms = estate?.numberOfRooms || ''

    // Responsible
    this.responsible = advertisement?.responsible?.id || advertisement?.creator?.id || ''

    // Card description from address
    this.cardDescription = estate?.address?.neighborhood || ''



    // Extract differentials from features (keep as Feature objects)

    this.differentials = Array.isArray(estate?.features) ? [...estate.features] : []


    // Store original advertisement data for updates
    this.originalAdvertisementData = advertisement

    // Address
    const mainAddress = estate?.address || {}


    this.address = {
      cep: mainAddress?.zipCode || '',
      number: mainAddress?.number || '',
      region: mainAddress?.region || '',
      street: mainAddress?.street || '',
      neighborhood: mainAddress?.neighborhood || '',
      city: mainAddress?.city || '',
      state: mainAddress?.uf || ''
    }



    // Stand address
    const standAddressData = estate?.standAddress


    this.standAddress = {
      cep: standAddressData?.zipCode || '',
      number: standAddressData?.number || '',
      region: standAddressData?.region || '',
      street: standAddressData?.street || '',
      neighborhood: standAddressData?.neighborhood || '',
      city: standAddressData?.city || '',
      state: standAddressData?.uf || ''
    }

    this.enableStandAddress = !!standAddressData && Object.values(standAddressData).some(v => v)


    // Images
    const images = estate?.images || []



    this.images = {
      video: this._extractImageUrl(images, 'Video'),
      cover: this._createFilePreview(this._extractImageUrl(images, 'Capa'), 'Capa'),
      gallery: this._extractAndCreatePreviews(images, 'Galeria'),
      floorPlans: this._extractAndCreatePreviews(images, 'Planta')
    }


  }

  /**
   * Cria um PropertyConfigModel a partir de uma entidade Advertisement
   */
  static fromAdvertisementEntity(advertisementEntity) {


    if (!advertisementEntity) {
      console.warn('⚠️ [PROPERTY MODEL] No advertisement entity provided, creating empty model')
      return new PropertyConfigModel()
    }

    return new PropertyConfigModel(advertisementEntity)
  }

  /**
   * Enhanced image URL extraction with better type matching
   */
  _extractImageUrl(images, type) {

    if (!Array.isArray(images) || images.length === 0) {
      return ''
    }

    // Try exact match first using type.description (from ImageEstateType entity)
    let image = images.find(img => img.type?.description === type)

    // If not found, try alternative type mappings
    if (!image) {
      const typeMapping = {
        'Video': ['video', 'Video', 'VIDEO', '4'],
        'Capa': ['capa', 'Capa', 'CAPA', 'cover', 'Cover', 'COVER', '1'],
        'Galeria': ['galeria', 'Galeria', 'GALERIA', 'gallery', 'Gallery', 'GALLERY', '2'],
        'Planta': ['planta', 'Planta', 'PLANTA', 'floor_plan', 'Floor_Plan', 'FLOOR_PLAN', 'floorplan', 'FloorPlan', 'FLOORPLAN', '3']
      }

      const alternativeTypes = typeMapping[type] || []
      image = images.find(img => alternativeTypes.includes(String(img.type?.description)))
    }

    const url = image?.url || ''

    return url
  }

  /**
   * Enhanced gallery/floor plans extraction with better sorting and type matching
   */
  _extractAndCreatePreviews(images, type) {

    if (!Array.isArray(images)) {
      return []
    }

    // Try exact match first using type.description
    let matchingImages = images.filter(img => img.type?.description === type)

    // If no exact match, try alternative mappings
    if (matchingImages.length === 0) {
      const typeMapping = {
        'Galeria': ['galeria', 'Galeria', 'GALERIA', 'gallery', 'Gallery', 'GALLERY', '2'],
        'Planta': ['planta', 'Planta', 'PLANTA', 'floor_plan', 'Floor_Plan', 'FLOOR_PLAN', 'floorplan', 'FloorPlan', 'FLOORPLAN', '3']
      }

      const alternativeTypes = typeMapping[type] || []
      matchingImages = images.filter(img => alternativeTypes.includes(String(img.type?.description)))
    }

    const previews = matchingImages
      .sort((a, b) => (a?.id || 0) - (b?.id || 0))
      .map((img, index) => this._createFilePreview(img.url, type, index + 1))
      .filter(Boolean)

    return previews
  }

  /**
   * Cria um objeto File-like para preview de URL
   */
  _createFilePreview(url, type, index = null) {

    if (!url) {
      return null
    }

    const fileName = this._generateFileName(type, index)
    const isVideo = type === 'Video'

    const preview = {
      preview: url,
      name: fileName,
      type: isVideo ? 'video/mp4' : 'image/jpeg',
      isExisting: true,
      url: url,
      size: 0,
      lastModified: Date.now()
    }


    return preview
  }

  /**
   * Enhanced filename generation
   */
  _generateFileName(type, index = null) {
    const typeNames = {
      'Video': 'Vídeo do Imóvel',
      'Capa': 'Imagem de Capa',
      'Galeria': 'Foto da Galeria',
      'Planta': 'Planta Baixa'
    }

    const baseName = typeNames[type] || type

    if (index !== null && index > 0) {
      return `${baseName} ${index}`
    }

    return baseName
  }

  /**
   * Formata data para o formato do input date (YYYY-MM-DD)
   */
  _formatDate(dateString) {
    if (!dateString) return ''

    try {
      const date = new Date(dateString)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    } catch (e) {
      console.error('Erro ao formatar data:', e)
      return ''
    }
  }

  /**
   * Converte o modelo para formato de formulário
   */
  toFormData() {


    const formData = {
      active: this.active,
      propertyTitle: this.propertyTitle,
      displayEndDate: this.displayEndDate,
      propertyType: this.propertyType,
      responsible: this.responsible,
      cardDescription: this.cardDescription,
      propertyDescription: this.propertyDescription,
      area: formatAreaForDisplay(this.area),
      numberOfRooms: this.numberOfRooms,
      // differentials for the form must be an array of normalized keys (strings),
      // but internally we keep Feature objects. Map accordingly.
      differentials: Array.isArray(this.differentials)
        ? this.differentials.map(d => {
          if (!d) return ''
          if (typeof d === 'string') return this._normalizeDifferentialKey(d)
          return this._normalizeDifferentialKey(d.description || d.name || '')
        }).filter(Boolean)
        : [],
      cep: this.address.cep,
      number: this.address.number,
      region: this.address.region,
      street: this.address.street,
      neighborhood: this.address.neighborhood,
      city: this.address.city,
      state: this.address.state,
      standCep: this.standAddress.cep,
      standNumber: this.standAddress.number,
      standRegion: this.standAddress.region,
      standStreet: this.standAddress.street,
      standNeighborhood: this.standAddress.neighborhood,
      standCity: this.standAddress.city,
      standState: this.standAddress.state,
      enableStandAddress: this.enableStandAddress,
      video: this.images.video,
      cover: this.images.cover,
      gallery: this.images.gallery,
      floorPlans: this.images.floorPlans
    }

    return formData
  }

  /**
   * Normaliza a descrição de um diferencial para uma "key" usada no formulário
   * Ex: "Pet Friendly" -> "pet_friendly"
   */
  _normalizeDifferentialKey(text) {
    if (!text) return ''
    return String(text)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '_')
      .replace(/[^\w_]/g, '')
  }

  /**
   * Enhanced method to extract new image files, considering both new files and replacements
   */
  extractNewImageFiles(formData) {
    const newFiles = []

    // Check if cover is new or replaced
    if (formData.cover && !formData.cover.isExisting) {
      newFiles.push({
        file: formData.cover,
        type: 1, // Cover type
        fieldType: 'cover'
      })
    }

    // Process gallery images - can have multiple new files
    if (Array.isArray(formData.gallery)) {
      formData.gallery.forEach((file, index) => {
        if (file && !file.isExisting) {
          newFiles.push({
            file: file,
            type: 2, // Gallery type
            fieldType: 'gallery',
            index: index
          })
        }
      })
    }

    // Process floor plans - can have multiple new files
    if (Array.isArray(formData.floorPlans)) {
      formData.floorPlans.forEach((file, index) => {
        if (file && !file.isExisting) {
          newFiles.push({
            file: file,
            type: 3, // Floor plan type
            fieldType: 'floorPlan',
            index: index
          })
        }
      })
    }

    return newFiles
  }

  /**
   * Enhanced API request conversion with better image handling for updates
   */
  toApiRequest(formData, uploadedImageData = [], availableAmenities = []) {


    // Função para limitar e sanitizar strings
    const sanitizeString = (value, maxLength = null) => {
      if (!value) return ''
      const cleaned = String(value).trim()
      return maxLength ? cleaned.substring(0, maxLength) : cleaned
    }

    // Função para formatar CEP (apenas números, 8 dígitos)
    const formatCep = (cep) => {
      if (!cep) return ''
      const cleanCep = String(cep).replace(/\D/g, '')
      return cleanCep.padStart(8, '0').substring(0, 8)
    }

    // Função para validar e sanitizar tipo ENUM
    const sanitizePropertyType = (type) => {
      const validTypes = ['DISPONIVEL', 'EM_OBRAS', 'LANCAMENTO']
      const cleanType = String(type || '').trim().toUpperCase()
      return validTypes.includes(cleanType) ? cleanType : 'DISPONIVEL'
    }

    // Função para gerar data de fim válida no padrão LocalDate (yyyy-MM-dd)
    const generateValidEndDate = (inputDate) => {
      if (inputDate) {
        try {
          const date = new Date(inputDate)
          if (!isNaN(date.getTime())) {
            return date.toISOString().split('T')[0]
          }
        } catch (e) {
          console.warn('Data inválida fornecida, usando data padrão')
        }
      }
      // Se não há data ou é inválida, usar 30 dias a partir de hoje
      const now = new Date()
      const endDate = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000))
      return endDate.toISOString().split('T')[0]
    }

    const sanitizeNumber = (value) => {
      const num = Number(value)
      return isNaN(num) ? 0 : num
    }

    const mapDifferentialsToIds = (differentials) => {
      if (!Array.isArray(differentials)) return []

      const amenitiesMap = Array.isArray(availableAmenities)
        ? availableAmenities.reduce((acc, amenity) => {
          const description = amenity?.description || amenity?.name || ''
          const id = Number(amenity?.id)

          if (!description || Number.isNaN(id)) {
            return acc
          }

          acc[this._normalizeDifferentialKey(description)] = id
          return acc
        }, {})
        : {}

      return differentials
        .map(diff => {
          // If it's an object with id, use it directly
          if (diff && typeof diff === 'object') {
            if (diff.id) return Number(diff.id)
            const desc = diff.description || diff.name || ''
            return amenitiesMap[this._normalizeDifferentialKey(desc)] || undefined
          }

          // If it's a string key, normalize and map
          if (typeof diff === 'string') {
            return amenitiesMap[this._normalizeDifferentialKey(diff)] || undefined
          }

          return undefined
        })
        .filter(id => id !== undefined)
    }

    const resolveImageType = (typeValue) => {
      if (typeValue === 1 || typeValue === '1' || String(typeValue).toUpperCase() === 'CAPA') {
        return 'CAPA'
      }

      if (typeValue === 3 || typeValue === '3' || String(typeValue).toUpperCase() === 'PLANTA') {
        return 'PLANTA'
      }

      if (typeValue === 4 || typeValue === '4' || String(typeValue).toUpperCase() === 'VIDEO') {
        return 'VIDEO'
      }

      return 'GALERIA'
    }

    const appendImageRequest = (collection, url, typeValue) => {
      if (!url || typeof url !== 'string') return

      const sanitizedUrl = url.trim()
      if (!sanitizedUrl) return

      collection.push({
        url: sanitizedUrl,
        type: resolveImageType(typeValue),
      })
    }

    // Build comprehensive image payload including existing and new images
    const images = []

    // Add video url directly as a string
    if (formData.video && typeof formData.video === 'string') {
      appendImageRequest(images, formData.video, 4) // 4 = Video
    }

    if (formData.cover && formData.cover.isExisting) {
      appendImageRequest(images, formData.cover.url, 1) // Cover
    }

    if (Array.isArray(formData.gallery)) {
      formData.gallery.forEach(file => {
        if (file && file.isExisting) {
          appendImageRequest(images, file.url, 2) // Gallery
        }
      })
    }

    if (Array.isArray(formData.floorPlans)) {
      formData.floorPlans.forEach(file => {
        if (file && file.isExisting) {
          appendImageRequest(images, file.url, 3) // Floor plan
        }
      })
    }

    // Add newly uploaded images
    if (Array.isArray(uploadedImageData)) {
      uploadedImageData.forEach(item => {
        if (item.urls && item.type) {
          item.urls.forEach((url) => appendImageRequest(images, url, item.type))
        }
      })
    }

    const selectedResponsibleId = sanitizeNumber(formData.responsible)
    const creatorIdFromSession = sanitizeNumber(sessionStorage.getItem('userId'))
    const creatorIdFromOriginal = sanitizeNumber(this.originalAdvertisementData?.creator?.id)
    const responsibleIdFromOriginal = sanitizeNumber(this.originalAdvertisementData?.responsible?.id)

    // Build complete API request seguindo AdvertisementCreateRequest
    const request = {
      active: Boolean(formData.active),
      featured: Boolean(this.originalAdvertisementData?.featured ?? false),
      endDate: generateValidEndDate(formData.displayEndDate),
      creatorId: creatorIdFromSession || creatorIdFromOriginal || selectedResponsibleId || 1,
      responsibleId: selectedResponsibleId || responsibleIdFromOriginal || creatorIdFromSession || 1,
      estate: {
        id: this.originalAdvertisementData?.estate?.id || null,
        title: sanitizeString(formData.propertyTitle, 255),
        description: sanitizeString(formData.propertyDescription, 1000),
        area: formatAreaForDatabase(formData.area) || 0,
        numberOfRooms: sanitizeNumber(formData.numberOfRooms),
        type: sanitizePropertyType(formData.propertyType),
        address: {
          id: this.originalAdvertisementData?.estate?.address?.id || null,
          street: sanitizeString(formData.street, 255),
          number: sanitizeString(formData.number, 20),
          neighborhood: sanitizeString(formData.neighborhood, 100),
          city: sanitizeString(formData.city, 100),
          uf: sanitizeString(formData.state, 2),
          zipCode: formatCep(formData.cep),
          complement: null,
          region: sanitizeString(formData.region, 50)
        },
        addressStand: (formData.enableStandAddress && formData.standStreet) ? {
          id: this.originalAdvertisementData?.estate?.standAddress?.id || null,
          street: sanitizeString(formData.standStreet, 255),
          number: sanitizeString(formData.standNumber, 20),
          neighborhood: sanitizeString(formData.standNeighborhood, 100),
          city: sanitizeString(formData.standCity, 100),
          uf: sanitizeString(formData.standState, 2),
          zipCode: formatCep(formData.standCep),
          complement: null,
          region: sanitizeString(formData.standRegion, 50)
        } : null,
        amenitiesIds: mapDifferentialsToIds(formData.differentials),
        images
      }
    }








    return request
  }

  /**
   * Verifica se é um novo registro
   */
  isNew() {
    return this.id === null
  }
}
