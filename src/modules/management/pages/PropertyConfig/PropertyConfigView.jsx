import { WizardFormView } from '@shared/components/ui/WizardForm/WizardFormView'
import { SectionView } from '@shared/components/layout/Section/SectionView'
import { usePropertyConfigViewModel } from './usePropertyConfigViewModel'
import { useRouteParams } from '@app/routes/useRouterViewModel'

export function PropertyConfigView() {
  const { id } = useRouteParams()

  console.log('PropertyConfigView - ID from params:', id)

  const {
    loading,
    error,
    initialData,
    isNew,
    handleSubmit,
    handleDelete,
    handleClear,
    handleCancel
  } = usePropertyConfigViewModel(id)

  console.log('PropertyConfigView - initialData:', initialData)

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
              containerClassName: 'w-full md:w-1/2',
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
          className: 'w-full',
          fields: [
            {
              name: 'differentials',
              label: 'Diferenciais',
              type: 'checkbox-group',
              options: [
                { value: 'piscina', label: 'Piscina' },
                { value: 'academia', label: 'Academia' },
                { value: 'churrasqueira', label: 'Churrasqueira' },
                { value: 'playground', label: 'Playground' },
                { value: 'salao_festas', label: 'Salão de Festas' },
                { value: 'garagem', label: 'Garagem' },
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
              options: ['Norte', 'Sul', 'Leste', 'Oeste', 'Centro'],
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
              options: ['SP', 'RJ', 'MG', 'ES', 'PR', 'SC', 'RS'],
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
              type: 'checkbox-group',
              options: [{ value: 'enabled', label: 'Sim' }],
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
              options: ['Norte', 'Sul', 'Leste', 'Oeste', 'Centro'],
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
              options: ['SP', 'RJ', 'MG', 'ES', 'PR', 'SC', 'RS'],
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

  if (loading) {
    return (
      <SectionView className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        Carregando dados da propriedade...
      </SectionView>
    )
  }

  if (error) {
    return (
      <SectionView className="flex items-center justify-center min-h-[calc(100vh-80px)] text-red-500">
        {error}
      </SectionView>
    )
  }

  return (
    <SectionView className="!min-h-[calc(100vh-80px)] !max-h-[calc(100vh-80px)] overflow-y-auto">
      <WizardFormView
        title={isNew ? 'Nova Propriedade' : 'Editar Propriedade'}
        steps={steps}
        initialData={initialData}
        onSubmit={handleSubmit}
        onDelete={!isNew ? handleDelete : undefined}
        onClear={handleClear}
        onCancel={handleCancel}
        key={id || 'new'} // Force re-render quando mudar de ID
      />
    </SectionView>
  )
}
