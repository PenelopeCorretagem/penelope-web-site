import { WizardFormView } from '@shared/components/ui/WizardForm/WizardFormView'
import { SectionView } from '@shared/components/layout/Section/SectionView'

export function PropertyConfigView() {
  const steps = [
    {
      title: 'Etapa 1',
      className: 'w-full flex flex-col gap-6',
      fields: [
        {
          name: 'displayStartDate',
          label: 'Data início de exibição',
          type: 'date',
          required: true,
          containerClassName: 'w-full md:w-1/2',
          groupRow: 'dates',
        },
        {
          name: 'displayEndDate',
          label: 'Data fim de exibição',
          type: 'date',
          required: true,
          containerClassName: 'w-full md:w-1/2',
          groupRow: 'dates',
        },
        {
          name: 'propertyTitle',
          label: 'Título do imóvel',
          type: 'text',
          required: true,
          containerClassName: 'w-full',
        },
        {
          name: 'cardDescription',
          label: 'Descritivo do card do imóvel',
          type: 'textarea',
          rows: 3,
          required: true,
          containerClassName: 'w-full',
        },
      ],
    },
    {
      title: 'Etapa 2',
      className: 'w-full flex flex-col gap-6',
      fields: [
        {
          name: 'propertyDescription',
          label: 'Descritivo do imóvel',
          type: 'textarea',
          rows: 5,
          required: true,
          containerClassName: 'w-full',
        },
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
          containerClassName: 'w-full',
        },
      ],
    },
    {
      title: 'Etapa 3',
      className: 'w-full flex flex-col gap-6',
      fields: [
        {
          name: 'addressTitle',
          label: 'Endereço do imóvel',
          type: 'heading',
          containerClassName: 'w-full',
        },
        {
          name: 'cep',
          label: 'CEP',
          type: 'text',
          required: true,
          containerClassName: 'w-full md:w-1/3',
          groupRow: 'address1',
        },
        {
          name: 'number',
          label: 'Número',
          type: 'text',
          required: true,
          containerClassName: 'w-full md:w-1/3',
          groupRow: 'address1',
        },
        {
          name: 'region',
          label: 'Região',
          type: 'select',
          options: ['Norte', 'Sul', 'Leste', 'Oeste', 'Centro'],
          required: true,
          containerClassName: 'w-full md:w-1/3',
          groupRow: 'address1',
        },
        {
          name: 'street',
          label: 'Rua',
          type: 'text',
          required: true,
          containerClassName: 'w-full',
        },
        {
          name: 'neighborhood',
          label: 'Bairro',
          type: 'text',
          required: true,
          containerClassName: 'w-full md:w-1/3',
          groupRow: 'address2',
        },
        {
          name: 'city',
          label: 'Cidade',
          type: 'text',
          required: true,
          containerClassName: 'w-full md:w-1/3',
          groupRow: 'address2',
        },
        {
          name: 'state',
          label: 'UF',
          type: 'select',
          options: ['SP', 'RJ', 'MG', 'ES', 'PR', 'SC', 'RS'],
          required: true,
          containerClassName: 'w-full md:w-1/3',
          groupRow: 'address2',
        },
      ],
    },
    {
      title: 'Etapa 4',
      className: 'w-full flex flex-col gap-6',
      fields: [
        {
          name: 'standAddressTitle',
          label: 'Endereço do stand',
          type: 'heading',
          containerClassName: 'w-auto',
          groupRow: 'standHeader',
        },
        {
          name: 'enableStandAddress',
          label: 'Habilitar endereço do stand',
          type: 'checkbox-group',
          options: [{ value: 'enabled', label: 'Sim' }],
          containerClassName: 'w-auto',
          groupRow: 'standHeader',
        },
        {
          name: 'standCep',
          label: 'CEP',
          type: 'text',
          containerClassName: 'w-full md:w-1/3',
          groupRow: 'standAddress1',
        },
        {
          name: 'standNumber',
          label: 'Número',
          type: 'text',
          containerClassName: 'w-full md:w-1/3',
          groupRow: 'standAddress1',
        },
        {
          name: 'standRegion',
          label: 'Região',
          type: 'select',
          options: ['Norte', 'Sul', 'Leste', 'Oeste', 'Centro'],
          containerClassName: 'w-full md:w-1/3',
          groupRow: 'standAddress1',
        },
        {
          name: 'standStreet',
          label: 'Rua',
          type: 'text',
          containerClassName: 'w-full',
        },
        {
          name: 'standNeighborhood',
          label: 'Bairro',
          type: 'text',
          containerClassName: 'w-full md:w-1/3',
          groupRow: 'standAddress2',
        },
        {
          name: 'standCity',
          label: 'Cidade',
          type: 'text',
          containerClassName: 'w-full md:w-1/3',
          groupRow: 'standAddress2',
        },
        {
          name: 'standState',
          label: 'UF',
          type: 'select',
          options: ['SP', 'RJ', 'MG', 'ES', 'PR', 'SC', 'RS'],
          containerClassName: 'w-full md:w-1/3',
          groupRow: 'standAddress2',
        },
      ],
    },
    {
      title: 'Etapa 5',
      className: 'w-full flex flex-col gap-6',
      fields: [
        {
          name: 'video',
          label: 'Vídeo',
          type: 'file',
          accept: 'video/*',
          containerClassName: 'w-full md:w-1/2',
          groupRow: 'media1',
        },
        {
          name: 'cover',
          label: 'Capa',
          type: 'file',
          accept: 'image/*',
          containerClassName: 'w-full md:w-1/2',
          groupRow: 'media1',
        },
        {
          name: 'gallery',
          label: 'Galeria',
          type: 'file',
          accept: 'image/*',
          multiple: true,
          containerClassName: 'w-full md:w-1/2',
          groupRow: 'media2',
        },
        {
          name: 'floorPlans',
          label: 'Plantas',
          type: 'file',
          accept: 'image/*',
          multiple: true,
          containerClassName: 'w-full md:w-1/2',
          groupRow: 'media2',
        },
      ],
    },
  ]

  const handleSubmit = async (formData) => {
    console.log('Dados do formulário:', formData)
    // TODO: Implementar lógica de submit
    return { success: true, message: 'Propriedade salva com sucesso!' }
  }

  const handleDelete = (formData) => {
    console.log('Excluir propriedade:', formData)
    // TODO: Implementar lógica de exclusão
  }

  const handleClear = (currentStepIndex) => {
    console.log(`Limpar campos da etapa ${currentStepIndex + 1}`)
    // TODO: Implementar lógica de limpeza adicional se necessário
  }

  return (
    <SectionView className="!min-h-[calc(100vh-80px)] !max-h-[calc(100vh-80px)] overflow-y-auto">
      <WizardFormView
        title="Configuração de Propriedade"
        steps={steps}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        onClear={handleClear}
      />
    </SectionView>
  )
}

export default PropertyConfigView
