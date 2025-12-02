import { formatAreaForDisplay, formatAreaForDatabase } from '@shared/utils/formatAreaUtil'

/**
 * Modelo de dados para configuração de propriedade
 */
export class PropertyConfigModel {
  constructor(propertyData = null) {
    console.log('PropertyConfigModel constructor - input:', propertyData)

    this.id = propertyData?.id || null
    this.active = propertyData?.active !== undefined ? propertyData.active : true
    this.propertyTitle = propertyData?.property?.title || ''
    this.displayEndDate = propertyData?.endDate ? this._formatDate(propertyData.endDate) : ''
    this.propertyType = propertyData?.property?.type || 'DISPONIVEL'
    this.responsible = propertyData?.responsible?.id || propertyData?.creator?.id || ''
    this.cardDescription = propertyData?.property?.address?.neighborhood || ''
    this.propertyDescription = propertyData?.property?.description || ''
    this.area = propertyData?.property?.area || ''
    this.numberOfRooms = propertyData?.property?.numberOfRooms || ''

    // Extract differentials from amenities
    this.differentials = propertyData?.property?.amenities?.map(a =>
      this._normalizeDifferential(a.description)
    ) || []

    // Store original advertisement data for updates
    this.originalAdvertisementData = propertyData

    // Endereço do imóvel
    this.address = {
      cep: propertyData?.property?.address?.cep || '',
      number: propertyData?.property?.address?.number || '',
      region: propertyData?.property?.address?.region || '',
      street: propertyData?.property?.address?.street || '',
      neighborhood: propertyData?.property?.address?.neighborhood || '',
      city: propertyData?.property?.address?.city || '',
      state: propertyData?.property?.address?.uf || ''
    }

    // Fix: Handle both standAddress and addressStand from API
    const standAddressData = propertyData?.property?.standAddress || propertyData?.property?.addressStand
    this.standAddress = {
      cep: standAddressData?.cep || '',
      number: standAddressData?.number || '',
      region: standAddressData?.region || '',
      street: standAddressData?.street || '',
      neighborhood: standAddressData?.neighborhood || '',
      city: standAddressData?.city || '',
      state: standAddressData?.uf || ''
    }

    this.enableStandAddress = !!standAddressData

    // Enhanced image extraction with better type mapping
    const images = propertyData?.property?.images || []
    console.log('🖼️ [PROPERTY MODEL] Raw images from API:', images)

    this.images = {
      video: this._createFilePreview(this._extractImageUrl(images, 'Video'), 'Video'),
      cover: this._createFilePreview(this._extractImageUrl(images, 'Capa'), 'Capa'),
      gallery: this._extractAndCreatePreviews(images, 'Galeria'),
      floorPlans: this._extractAndCreatePreviews(images, 'Planta')
    }

    console.log('🖼️ [PROPERTY MODEL] Processed images:', {
      video: !!this.images.video,
      cover: !!this.images.cover,
      gallery: this.images.gallery.length,
      floorPlans: this.images.floorPlans.length
    })
  }

  /**
   * Cria um PropertyConfigModel a partir de uma entidade Advertisement
   */
  static fromAdvertisementEntity(advertisementEntity) {
    if (!advertisementEntity) {
      return new PropertyConfigModel()
    }

    // Converte a entidade Advertisement para o formato esperado, preservando dados originais
    const propertyData = {
      id: advertisementEntity.id,
      active: advertisementEntity.active,
      endDate: advertisementEntity.endDate || advertisementEntity.createdAt,
      creator: advertisementEntity.creator,
      responsible: advertisementEntity.responsible,
      property: advertisementEntity.property
    }

    return new PropertyConfigModel(propertyData)
  }

  /**
   * Enhanced image URL extraction with better type matching
   */
  _extractImageUrl(images, type) {
    console.log(`🔍 [PROPERTY MODEL] Looking for ${type} in:`, images.map(img => ({ id: img.id, type: img.type, url: img.url })))

    // Try exact match first
    let image = images.find(img => img.type === type)

    // If not found, try alternative type mappings
    if (!image) {
      const typeMapping = {
        'Video': ['video', 'Video', 'VIDEO', '4'],
        'Capa': ['capa', 'Capa', 'CAPA', 'cover', 'Cover', 'COVER', '1'],
        'Galeria': ['galeria', 'Galeria', 'GALERIA', 'gallery', 'Gallery', 'GALLERY', '2'],
        'Planta': ['planta', 'Planta', 'PLANTA', 'floor_plan', 'Floor_Plan', 'FLOOR_PLAN', 'floorplan', 'FloorPlan', 'FLOORPLAN', '3']
      }

      const alternativeTypes = typeMapping[type] || []
      image = images.find(img => alternativeTypes.includes(String(img.type)))
    }

    const url = image?.url || ''
    console.log(`🔍 [PROPERTY MODEL] Extracted ${type} image:`, image ? { id: image.id, type: image.type, url } : 'Not found')
    return url
  }

  /**
   * Enhanced gallery/floor plans extraction with better sorting and type matching
   */
  _extractAndCreatePreviews(images, type) {
    console.log(`🔍 [PROPERTY MODEL] Looking for ${type} images in:`, images.map(img => ({ id: img.id, type: img.type })))

    // Try exact match first
    let matchingImages = images.filter(img => img.type === type)

    // If no exact match, try alternative mappings
    if (matchingImages.length === 0) {
      const typeMapping = {
        'Galeria': ['galeria', 'Galeria', 'GALERIA', 'gallery', 'Gallery', 'GALLERY', '2'],
        'Planta': ['planta', 'Planta', 'PLANTA', 'floor_plan', 'Floor_Plan', 'FLOOR_PLAN', 'floorplan', 'FloorPlan', 'FLOORPLAN', '3']
      }

      const alternativeTypes = typeMapping[type] || []
      matchingImages = images.filter(img => alternativeTypes.includes(String(img.type)))
    }

    const previews = matchingImages
      .sort((a, b) => (a.id || 0) - (b.id || 0)) // Handle missing IDs
      .map((img, index) => this._createFilePreview(img.url, type, index + 1))
      .filter(Boolean)

    console.log(`🔍 [PROPERTY MODEL] Extracted ${type} images:`, previews.length, previews.map(p => p.name))
    return previews
  }

  /**
   * Cria um objeto File-like para preview de URL
   */
  _createFilePreview(url, type, index = null) {
    if (!url) return null

    const fileName = this._generateFileName(type, index)
    const isVideo = type === 'Video'

    const preview = {
      preview: url,
      name: fileName,
      type: isVideo ? 'video/mp4' : 'image/jpeg',
      isExisting: true,
      url: url,
      size: 0, // Unknown size for existing files
      lastModified: Date.now()
    }

    console.log(`✅ [PROPERTY MODEL] Created preview for ${type}:`, fileName)
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
   * Normaliza o nome do diferencial para corresponder aos valores do checkbox
   */
  _normalizeDifferential(name) {
    const map = {
      'Pet': 'pet',
      'Floresta': 'floresta',
      'Brinquedo': 'brinquedo',
      'Lounge': 'lounge',
      'Yoga': 'yoga ',
    }
    return map[name] || name.toLowerCase().replace(/\s+/g, '_')
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
    return {
      active: this.active,
      propertyTitle: this.propertyTitle,
      displayEndDate: this.displayEndDate,
      propertyType: this.propertyType,
      responsible: this.responsible,
      cardDescription: this.cardDescription,
      propertyDescription: this.propertyDescription,
      area: formatAreaForDisplay(this.area),
      numberOfRooms: this.numberOfRooms,
      differentials: this.differentials, // Now properly extracted from constructor
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
  }

  /**
   * Enhanced method to extract new image files, considering both new files and replacements
   */
  extractNewImageFiles(formData) {
    const newFiles = []

    // Check if video is new or replaced
    if (formData.video && !formData.video.isExisting) {
      newFiles.push({
        file: formData.video,
        type: 2, // Videos as gallery for now
        fieldType: 'video'
      })
    }

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

    console.log('📁 [PROPERTY MODEL] New files to upload:', newFiles.length)
    console.log('📁 [PROPERTY MODEL] File breakdown:', newFiles.map(f => ({
      fieldType: f.fieldType,
      type: f.type,
      fileName: f.file?.name
    })))

    return newFiles
  }

  /**
   * Enhanced API request conversion with better image handling for updates
   */
  toApiRequest(formData, uploadedImageData = []) {
    console.log('🔄 [PROPERTY MODEL] Converting form data to API request:', formData)
    console.log('🖼️ [PROPERTY MODEL] Uploaded image data:', uploadedImageData)

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

    // Função para gerar data de fim válida (formato ISO)
    const generateValidEndDate = (inputDate) => {
      if (inputDate) {
        try {
          const date = new Date(inputDate)
          if (!isNaN(date.getTime())) {
            return date.toISOString()
          }
        } catch (e) {
          console.warn('Data inválida fornecida, usando data padrão')
        }
      }
      // Se não há data ou é inválida, usar 30 dias a partir de hoje
      const now = new Date()
      const endDate = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000))
      return endDate.toISOString()
    }

    const sanitizeNumber = (value) => {
      const num = Number(value)
      return isNaN(num) ? 0 : num
    }

    const mapDifferentialsToIds = (differentials) => {
      if (!Array.isArray(differentials)) return []

      const differentialMap = {
        'pet': 1,
        'floresta': 2,
        'brinquedo': 3,
        'lounge': 4,
        'yoga': 5,
      }

      return differentials
        .map(diff => differentialMap[diff])
        .filter(id => id !== undefined)
    }

    // Build comprehensive image arrays including existing and new images
    const imageUrls = []
    const imageTypes = []

    // Add existing images that weren't changed
    if (formData.video && formData.video.isExisting) {
      imageUrls.push(formData.video.url)
      imageTypes.push(2) // Video as gallery
    }

    if (formData.cover && formData.cover.isExisting) {
      imageUrls.push(formData.cover.url)
      imageTypes.push(1) // Cover
    }

    if (Array.isArray(formData.gallery)) {
      formData.gallery.forEach(file => {
        if (file && file.isExisting) {
          imageUrls.push(file.url)
          imageTypes.push(2) // Gallery
        }
      })
    }

    if (Array.isArray(formData.floorPlans)) {
      formData.floorPlans.forEach(file => {
        if (file && file.isExisting) {
          imageUrls.push(file.url)
          imageTypes.push(3) // Floor plan
        }
      })
    }

    // Add newly uploaded images
    if (Array.isArray(uploadedImageData)) {
      uploadedImageData.forEach(item => {
        if (item.urls && item.type) {
          imageUrls.push(...item.urls)
          imageTypes.push(...new Array(item.urls.length).fill(item.type))
        }
      })
    }

    // Build complete API request
    const request = {
      title: sanitizeString(formData.propertyTitle, 255),
      description: sanitizeString(formData.propertyDescription, 1000),
      area: formatAreaForDatabase(formData.area) || 0,
      numberOfRooms: sanitizeNumber(formData.numberOfRooms),
      type: sanitizePropertyType(formData.propertyType),
      advertisementCreateRequest: {
        creator: sanitizeNumber(formData.responsible) || sanitizeNumber(this.originalAdvertisementData?.creator?.id) || 1,
        responsible: sanitizeNumber(formData.responsible) || sanitizeNumber(this.originalAdvertisementData?.responsible?.id) || 1,
        dataFim: generateValidEndDate(formData.displayEndDate),
        active: Boolean(formData.active)
      },
      address: {
        id: this.originalAdvertisementData?.property?.address?.id || null,
        street: sanitizeString(formData.street, 255),
        number: sanitizeString(formData.number, 20),
        neighborhood: sanitizeString(formData.neighborhood, 100),
        city: sanitizeString(formData.city, 100),
        uf: sanitizeString(formData.state, 2),
        zipCode: formatCep(formData.cep),
        complement: null,
        region: sanitizeString(formData.region, 50)
      },
      standAddress: (formData.enableStandAddress && formData.standStreet) ? {
        id: this.originalAdvertisementData?.property?.standAddress?.id || null,
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
      images: imageUrls,
      imageType: imageTypes
    }

    console.log('✅ [PROPERTY MODEL] API request created for', this.isNew() ? 'CREATE' : 'UPDATE')
    console.log('🔍 [PROPERTY MODEL] Property type:', request.type)
    console.log('🔍 [PROPERTY MODEL] Active status:', request.advertisementCreateRequest.active)
    console.log('🖼️ [PROPERTY MODEL] Total images:', imageUrls.length)
    console.log('🏷️ [PROPERTY MODEL] Image types:', imageTypes)
    console.log('🎯 [PROPERTY MODEL] Amenities IDs:', request.amenitiesIds)

    return request
  }

  /**
   * Verifica se é um novo registro
   */
  isNew() {
    return this.id === null
  }
}
