import { formatAreaForDisplay, formatAreaForDatabase } from '@shared/utils/formatAreaUtil'

/**
 * Modelo de dados para configuração de propriedade
 */
export class PropertyConfigModel {
  constructor(realEstateAdvertisement = null) {
    console.log('🔨 [PROPERTY MODEL] Constructor called with:', {
      hasData: !!realEstateAdvertisement,
      id: realEstateAdvertisement?.id,
      hasEstate: !!realEstateAdvertisement?.estate,
      estateTitle: realEstateAdvertisement?.estate?.title
    })

    this.id = realEstateAdvertisement?.id || null
    this.active = realEstateAdvertisement?.active !== undefined ? realEstateAdvertisement.active : true
    this.displayEndDate = realEstateAdvertisement?.endDate ? this._formatDate(realEstateAdvertisement.endDate) : ''

    // Access Estate entity getters (not private properties)
    const estate = realEstateAdvertisement?.estate
    this.propertyTitle = estate?.title || ''
    this.propertyType = estate?.type?.key || 'DISPONIVEL'
    this.propertyDescription = estate?.description || ''
    this.area = estate?.area || ''
    this.numberOfRooms = estate?.numberOfRooms || ''

    // Responsible
    this.responsible = realEstateAdvertisement?.responsible?.id || realEstateAdvertisement?.creator?.id || ''

    // Card description from address
    this.cardDescription = estate?.address?.neighborhood || ''

    console.log('🔨 [PROPERTY MODEL] Basic fields processed:', {
      id: this.id,
      title: this.propertyTitle,
      type: this.propertyType,
      responsible: this.responsible,
      area: this.area,
      rooms: this.numberOfRooms,
      active: this.active,
      endDate: this.displayEndDate
    })

    // Extract differentials from features (not amenities)
    console.log('🎯 [PROPERTY MODEL] Processing features:', estate?.features?.length || 0)
    this.differentials = estate?.features?.map(feature => {
      const normalized = this._normalizeDifferential(feature.description)
      console.log(`  - Feature "${feature.description}" normalized to "${normalized}"`)
      return normalized
    }) || []
    console.log('🎯 [PROPERTY MODEL] Final differentials:', this.differentials)

    // Store original advertisement data for updates
    this.originalAdvertisementData = realEstateAdvertisement

    // Address
    const mainAddress = estate?.address || {}
    console.log('📍 [PROPERTY MODEL] Processing main address:', mainAddress)

    this.address = {
      cep: mainAddress?.zipCode || '',
      number: mainAddress?.number || '',
      region: mainAddress?.region || '',
      street: mainAddress?.street || '',
      neighborhood: mainAddress?.neighborhood || '',
      city: mainAddress?.city || '',
      state: mainAddress?.uf || ''
    }

    console.log('📍 [PROPERTY MODEL] Processed address:', this.address)

    // Stand address
    const standAddressData = estate?.standAddress
    console.log('📍 [PROPERTY MODEL] Processing stand address:', !!standAddressData, standAddressData)

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
    console.log('📍 [PROPERTY MODEL] Processed stand address:', {
      enabled: this.enableStandAddress,
      address: this.enableStandAddress ? this.standAddress : 'disabled'
    })

    // Images
    const images = estate?.images || []
    console.log('🖼️ [PROPERTY MODEL] Constructor - Processing images:', images.length)
    console.log('🖼️ [PROPERTY MODEL] Raw images:', images.map(img => ({
      id: img.id,
      type: img.type?.description,
      url: img.url?.substring(0, 100)
    })))

    this.images = {
      video: this._createFilePreview(this._extractImageUrl(images, 'Video'), 'Video'),
      cover: this._createFilePreview(this._extractImageUrl(images, 'Capa'), 'Capa'),
      gallery: this._extractAndCreatePreviews(images, 'Galeria'),
      floorPlans: this._extractAndCreatePreviews(images, 'Planta')
    }

    console.log('🖼️ [PROPERTY MODEL] Constructor - Final images:', {
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
    console.log('🔄 [PROPERTY MODEL] fromAdvertisementEntity called with:', {
      id: advertisementEntity?.id,
      hasEstate: !!advertisementEntity?.estate,
      estateTitle: advertisementEntity?.estate?.title
    })

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
    console.log(`🔍 [PROPERTY MODEL] _extractImageUrl searching for "${type}"`)

    if (!Array.isArray(images) || images.length === 0) {
      console.log(`❌ [PROPERTY MODEL] No images array or empty`)
      return ''
    }

    // Try exact match first using type.description (from ImageEstateType entity)
    let image = images.find(img => img.type?.description === type)
    console.log(`🔍 [PROPERTY MODEL] Exact match for "${type}":`, image ? { id: image.id, type: image.type?.description } : 'Not found')

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
      console.log(`🔍 [PROPERTY MODEL] Alternative match for "${type}":`, image ? { id: image.id, type: image.type?.description } : 'Not found')
    }

    const url = image?.url || ''
    console.log(`🔍 [PROPERTY MODEL] Extracted ${type} image:`, {
      found: !!image,
      imageId: image?.id,
      imageType: image?.type?.description,
      urlLength: url?.length
    })

    return url
  }

  /**
   * Enhanced gallery/floor plans extraction with better sorting and type matching
   */
  _extractAndCreatePreviews(images, type) {
    console.log(`🔍 [PROPERTY MODEL] _extractAndCreatePreviews for "${type}"`)

    if (!Array.isArray(images)) {
      console.log(`❌ [PROPERTY MODEL] Images is not an array for ${type}`)
      return []
    }

    // Try exact match first using type.description
    let matchingImages = images.filter(img => img.type?.description === type)
    console.log(`🔍 [PROPERTY MODEL] Exact matches for "${type}":`, matchingImages.length)

    // If no exact match, try alternative mappings
    if (matchingImages.length === 0) {
      const typeMapping = {
        'Galeria': ['galeria', 'Galeria', 'GALERIA', 'gallery', 'Gallery', 'GALLERY', '2'],
        'Planta': ['planta', 'Planta', 'PLANTA', 'floor_plan', 'Floor_Plan', 'FLOOR_PLAN', 'floorplan', 'FloorPlan', 'FLOORPLAN', '3']
      }

      const alternativeTypes = typeMapping[type] || []
      matchingImages = images.filter(img => alternativeTypes.includes(String(img.type?.description)))
      console.log(`🔍 [PROPERTY MODEL] Found ${matchingImages.length} alternative matches for "${type}"`)
    }

    const previews = matchingImages
      .sort((a, b) => (a?.id || 0) - (b?.id || 0))
      .map((img, index) => this._createFilePreview(img.url, type, index + 1))
      .filter(Boolean)

    console.log(`✅ [PROPERTY MODEL] Created ${previews.length} previews for "${type}"`)
    return previews
  }

  /**
   * Cria um objeto File-like para preview de URL
   */
  _createFilePreview(url, type, index = null) {
    console.log(`🖼️ [PROPERTY MODEL] _createFilePreview:`, { url: url?.substring(0, 100), type, index, hasUrl: !!url })

    if (!url) {
      console.log(`❌ [PROPERTY MODEL] No URL provided for ${type}`)
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

    console.log(`✅ [PROPERTY MODEL] Created preview for ${type}:`, {
      fileName,
      urlLength: url?.length
    })

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
    if (!name) return ''

    const lowerName = String(name).toLowerCase().trim()

    const map = {
      'pet': 'pet',
      'floresta': 'floresta',
      'brinquedo': 'brinquedo',
      'lounge': 'lounge',
      'yoga': 'yoga',
    }

    return map[lowerName] || lowerName.replace(/\s+/g, '_')
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
    console.log('📤 [PROPERTY MODEL] toFormData() called')

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
      differentials: this.differentials,
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

    console.log('📤 [PROPERTY MODEL] toFormData() complete:', {
      title: formData.propertyTitle,
      type: formData.propertyType,
      images: {
        video: !!formData.video,
        cover: !!formData.cover,
        gallery: formData.gallery.length,
        floorPlans: formData.floorPlans.length
      }
    })

    return formData
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
    console.log('🔄 [PROPERTY MODEL] Converting form data to API request')

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
