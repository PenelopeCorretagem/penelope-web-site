import { WizardFormView } from '@shared/components/ui/WizardForm/WizardFormView'
import { SectionView } from '@shared/components/layout/Section/SectionView'
import { usePropertyConfigViewModel } from './usePropertyConfigViewModel'
import { useRouteParams } from '@app/routes/useRouterViewModel'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'

export function PropertyConfigView() {
  const { id } = useRouteParams()

  console.log('🎨 [PROPERTY CONFIG VIEW] Mounted with ID:', id)

  const {
    loading,
    error,
    initialData,
    submitting,
    isNew,
    usersWithCreci,
    loadingUsers,
    handleSubmit,
    handleDelete,
    handleClear,
    handleCancel
  } = usePropertyConfigViewModel(id)

  console.log('🎨 [PROPERTY CONFIG VIEW] State updated:', {
    loading,
    error,
    isNew,
    hasInitialData: !!initialData,
    initialDataKeys: initialData ? Object.keys(initialData) : [],
    usersCount: usersWithCreci.length,
    loadingUsers
  })

  if (initialData) {
    console.log('🎨 [PROPERTY CONFIG VIEW] Received initialData:', {
      propertyTitle: initialData.propertyTitle,
      propertyType: initialData.propertyType,
      responsible: initialData.responsible,
      address: {
        street: initialData.street,
        city: initialData.city,
        cep: initialData.cep
      },
      differentials: initialData.differentials,
      // Log detalhado de imagens
      images: {
        video: {
          exists: !!initialData.video,
          preview: initialData.video?.preview?.substring(0, 100),
          name: initialData.video?.name,
          isExisting: initialData.video?.isExisting,
          url: initialData.video?.url?.substring(0, 100)
        },
        cover: {
          exists: !!initialData.cover,
          preview: initialData.cover?.preview?.substring(0, 100),
          name: initialData.cover?.name,
          isExisting: initialData.cover?.isExisting,
          url: initialData.cover?.url?.substring(0, 100)
        },
        gallery: {
          count: initialData.gallery?.length || 0,
          items: initialData.gallery?.map(item => ({
            name: item?.name,
            preview: item?.preview?.substring(0, 50),
            isExisting: item?.isExisting
          }))
        },
        floorPlans: {
          count: initialData.floorPlans?.length || 0,
          items: initialData.floorPlans?.map(item => ({
            name: item?.name,
            preview: item?.preview?.substring(0, 50),
            isExisting: item?.isExisting
          }))
        }
      }
    })
  }

  // Só monta o formulário quando os usuários estiverem carregados
  if (loading || loadingUsers) {
    return (
      <SectionView className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        {loading ? 'Carregando dados da propriedade...' : 'Carregando usuários...'}
      </SectionView>
    )
  }

  if (error) {
    return (
      <SectionView className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-red-500 gap-4">
        <p>{error}</p>
        <ButtonView
          type="button"
          color="brown"
          onClick={handleCancel}
        >
          Voltar
        </ButtonView>
      </SectionView>
    )
  }

  // Agora monta as opções com segurança, pois os usuários já foram carregados
  const responsibleOptions = [
    { value: '', label: 'Selecione um responsável' },
    ...usersWithCreci.map(user => ({
      value: user.id?.toString() || user.email,
      label: user.getDisplayName()
    }))
  ]

  console.log('🎨 [PROPERTY CONFIG VIEW] Responsible options:', responsibleOptions.map(opt => ({ value: opt.value, label: opt.label })))

  const steps = [
    {
      title: 'Etapa 1',
      className: 'w-full h-full flex flex-col gap-card md:gap-card-md',
      groups: [
        {
          className: 'w-full flex flex-row gap-card md:gap-card-md',
          fields: [
            {
              name: 'propertyTitle',
              label: 'Título',
              type: 'text',
              required: true,
              containerClassName: 'w-full md:w-1/2',
            },
            {
              name: 'displayEndDate',
              label: 'Data Término de Exibição',
              type: 'date',
              required: true,
              containerClassName: 'w-full md:w-1/4',
            },
            {
              name: 'active',
              label: 'Ativo',
              type: 'checkbox',
              placeholder: 'Propriedade ativa',
              containerClassName: 'w-full md:w-1/4',
            },
          ],
        },
        {
          className: 'w-full flex flex-row gap-card md:gap-card-md',
          fields: [
            {
              name: 'propertyType',
              label: 'Tipo',
              type: 'select',
              options: [
                { value: '', label: 'Selecione o tipo' },
                { value: 'DISPONIVEL', label: 'Disponível' },
                { value: 'EM_OBRAS', label: 'Em Obras' },
                { value: 'LANCAMENTO', label: 'Lançamento' }
              ],
              required: true,
              containerClassName: 'w-1/2',
            },
            {
              name: 'responsible',
              label: 'Responsável',
              type: 'select',
              options: responsibleOptions,
              required: true,
              containerClassName: 'w-1/2',
            },
          ],
        },
        {
          className: 'w-full h-full flex-1',
          fields: [
            {
              name: 'cardDescription',
              label: 'Descritivo do card do imóvel',
              type: 'textarea',
              className: 'w-full h-full flex-1',
              containerClassName: 'w-full h-full flex-1',
              rows: 3,
              required: true,
            },
          ],
        },
      ],
    },
    {
      title: 'Etapa 2',
      className: 'w-full h-full flex flex-col gap-card md:gap-card-md',
      groups: [
        {
          className: 'w-full h-full flex-1',
          fields: [
            {
              name: 'propertyDescription',
              label: 'Descritivo do imóvel',
              type: 'textarea',
              className: 'w-full h-full flex-1',
              containerClassName: 'w-full h-full flex-1',
              rows: 5,
              required: true,
            },
          ],
        },
        {
          className: 'w-full flex flex-row gap-card md:gap-card-md',
          fields: [
            {
              name: 'area',
              label: 'Área (m²)',
              type: 'text', // Mudado de 'number' para 'text' para permitir formatação
              required: true,
              containerClassName: 'w-full md:w-1/2',
            },
            {
              name: 'numberOfRooms',
              label: 'Número de Quartos',
              type: 'number',
              required: true,
              containerClassName: 'w-full md:w-1/2',
            },
          ],
        },
        {
          className: 'w-full',
          fields: [
            {
              name: 'differentials',
              label: 'Diferenciais',
              type: 'checkbox-group',
              options: [
                { value: 'pet', label: 'Pet' },
                { value: 'floresta', label: 'Floresta' },
                { value: 'brinquedo', label: 'Brinquedo' },
                { value: 'lounge', label: 'Lounge' },
                { value: 'yoga', label: 'Yoga' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Etapa 3',
      className: 'w-full flex flex-col gap-card md:gap-card-md',
      groups: [
        {
          className: 'w-full',
          fields: [
            {
              name: 'addressTitle',
              label: 'Endereço do imóvel',
              type: 'heading',
            },
          ],
        },
        {
          className: 'w-full flex flex-row gap-card md:gap-card-md',
          fields: [
            {
              name: 'cep',
              label: 'CEP',
              type: 'text',
              required: true,
              containerClassName: 'w-full md:w-1/3',
            },
            {
              name: 'number',
              label: 'Número',
              type: 'text',
              required: true,
              containerClassName: 'w-full md:w-1/3',
            },
            {
              name: 'region',
              label: 'Região',
              type: 'select',
              options: [
                { value: '', label: 'Selecione a região' },
                { value: 'Norte', label: 'Norte' },
                { value: 'Sul', label: 'Sul' },
                { value: 'Leste', label: 'Leste' },
                { value: 'Oeste', label: 'Oeste' },
                { value: 'Centro', label: 'Centro' }
              ],
              required: true,
              containerClassName: 'w-full md:w-1/3',
            },
          ],
        },
        {
          className: 'w-full',
          fields: [
            {
              name: 'street',
              label: 'Rua',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          className: 'w-full flex flex-row gap-card md:gap-card-md',
          fields: [
            {
              name: 'neighborhood',
              label: 'Bairro',
              type: 'text',
              required: true,
              containerClassName: 'w-full md:w-1/3',
            },
            {
              name: 'city',
              label: 'Cidade',
              type: 'text',
              required: true,
              containerClassName: 'w-full md:w-1/3',
            },
            {
              name: 'state',
              label: 'UF',
              type: 'select',
              options: [
                { value: '', label: 'Selecione o estado' },
                { value: 'SP', label: 'SP' },
                { value: 'RJ', label: 'RJ' },
                { value: 'MG', label: 'MG' },
                { value: 'ES', label: 'ES' },
                { value: 'PR', label: 'PR' },
                { value: 'SC', label: 'SC' },
                { value: 'RS', label: 'RS' }
              ],
              required: true,
              containerClassName: 'w-full md:w-1/3',
            },
          ],
        },
      ],
    },
    {
      title: 'Etapa 4',
      className: 'w-full flex flex-col gap-card md:gap-card-md',
      groups: [
        {
          className: 'w-full flex flex-row justify-between gap-card md:gap-card-md',
          fields: [
            {
              name: 'standAddressTitle',
              label: 'Endereço do stand',
              type: 'heading',
              containerClassName: 'w-auto',
            },
            {
              name: 'enableStandAddress',
              label: 'Habilitar endereço do stand',
              type: 'checkbox',
              placeholder: 'Habilitar endereço do stand',
              containerClassName: 'w-auto',
            },
          ],
        },
        {
          className: 'w-full flex flex-row gap-card md:gap-card-md',
          fields: [
            {
              name: 'standCep',
              label: 'CEP',
              type: 'text',
              containerClassName: 'w-full md:w-1/3',
            },
            {
              name: 'standNumber',
              label: 'Número',
              type: 'text',
              containerClassName: 'w-full md:w-1/3',
            },
            {
              name: 'standRegion',
              label: 'Região',
              type: 'select',
              options: [
                { value: '', label: 'Selecione a região' },
                { value: 'Norte', label: 'Norte' },
                { value: 'Sul', label: 'Sul' },
                { value: 'Leste', label: 'Leste' },
                { value: 'Oeste', label: 'Oeste' },
                { value: 'Centro', label: 'Centro' }
              ],
              containerClassName: 'w-full md:w-1/3',
            },
          ],
        },
        {
          className: 'w-full',
          fields: [
            {
              name: 'standStreet',
              label: 'Rua',
              type: 'text',
            },
          ],
        },
        {
          className: 'w-full flex flex-row gap-card md:gap-card-md',
          fields: [
            {
              name: 'standNeighborhood',
              label: 'Bairro',
              type: 'text',
              containerClassName: 'w-full md:w-1/3',
            },
            {
              name: 'standCity',
              label: 'Cidade',
              type: 'text',
              containerClassName: 'w-full md:w-1/3',
            },
            {
              name: 'standState',
              label: 'UF',
              type: 'select',
              options: [
                { value: '', label: 'Selecione o estado' },
                { value: 'SP', label: 'SP' },
                { value: 'RJ', label: 'RJ' },
                { value: 'MG', label: 'MG' },
                { value: 'ES', label: 'ES' },
                { value: 'PR', label: 'PR' },
                { value: 'SC', label: 'SC' },
                { value: 'RS', label: 'RS' }
              ],
              containerClassName: 'w-full md:w-1/3',
            },
          ],
        },
      ],
    },
    {
      title: 'Etapa 5',
      className: 'w-full h-full flex flex-col gap-card md:gap-card-md',
      groups: [
        {
          className: 'w-full h-full flex-1 flex flex-row gap-card md:gap-card-md',
          fields: [
            {
              name: 'video',
              label: 'Vídeo',
              type: 'file',
              accept: 'video/*',
              containerClassName: 'w-full h-full flex-1 md:w-1/2',
              className: 'w-full h-full flex-1',
            },
            {
              name: 'cover',
              label: 'Capa',
              type: 'file',
              accept: 'image/*',
              containerClassName: 'w-full h-full flex-1 md:w-1/2',
              className: 'w-full h-full flex-1',
            },
          ],
        },
      ],
    },
    {
      title: 'Etapa 6',
      className: 'w-full h-full flex flex-col gap-card md:gap-card-md',
      groups: [
        {
          className: 'w-full h-full flex-1 flex flex-row gap-card md:gap-card-md',
          fields: [
            {
              name: 'gallery',
              label: 'Galeria',
              type: 'file',
              accept: 'image/*',
              multiple: true,
              containerClassName: 'w-full h-full flex-1 md:w-1/2',
              className: 'w-full h-full flex-1',
            },
            {
              name: 'floorPlans',
              label: 'Plantas',
              type: 'file',
              accept: 'image/*',
              multiple: true,
              containerClassName: 'w-full h-full flex-1 md:w-1/2',
              className: 'w-full h-full flex-1',
            },
          ],
        },
      ],
    },
  ]

  return (
    <SectionView className="!min-h-[calc(100vh-80px)] !max-h-[calc(100vh-80px)] overflow-y-auto">
      <WizardFormView
        title={isNew ? 'Nova Propriedade' : 'Editar Propriedade'}
        steps={steps}
        initialData={initialData}
        onSubmit={(formData) => {
          console.log('🎯 [PROPERTY CONFIG VIEW] onSubmit called with formData images:', {
            videoExists: !!formData.video,
            coverExists: !!formData.cover,
            galleryCount: formData.gallery?.length,
            floorPlansCount: formData.floorPlans?.length,
            video: formData.video,
            cover: formData.cover,
            gallery: formData.gallery,
            floorPlans: formData.floorPlans
          })
          return handleSubmit(formData)
        }}
        onDelete={!isNew ? () => {
          if (window.confirm('Tem certeza que deseja desabilitar esta propriedade? Ela não aparecerá mais no site.')) {
            return handleDelete()
          }
        } : undefined}
        onClear={handleClear}
        onCancel={handleCancel}
        disabled={submitting}
        key={id || 'new'}
      />
    </SectionView>
  )
}
