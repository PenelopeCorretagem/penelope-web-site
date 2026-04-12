import { useEffect } from 'react'
import { WizardFormView } from '@shared/components/ui/WizardForm/WizardFormView'
import { SectionView } from '@shared/components/layout/Section/SectionView'
import { usePropertyConfigViewModel } from './usePropertyConfigViewModel'
import { useRouteParams } from '@app/routes/useRouterViewModel'
import { AlertView, useAlert } from '@shared/components/feedback/Alert/AlertView'

export function PropertyConfigView() {
  const { id } = useRouteParams()
  const alertError = useAlert(false)

  const {
    loading,
    error,
    initialData,
    submitting,
    isNew,
    usersWithCreci,
    loadingUsers,
    loadingFeatures,
    features,
    handleSubmit,
    handleDelete,
    handleClear,
    handleCancel
  } = usePropertyConfigViewModel(id)

  // Mostra o alerta de erro quando há erro
  useEffect(() => {
    if (error) {
      alertError.show()
    }
  }, [error, alertError])
  
  // Só monta o formulário quando os usuários e features estiverem carregados
  if (loading || loadingUsers || loadingFeatures) {
    return (
      <SectionView className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        {loading ? 'Carregando dados da propriedade...' : loadingUsers ? 'Carregando usuários...' : 'Carregando diferenciais...'}
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



  // Converter features em opções de checkbox
  const featureOptions = features.map(feature => ({
    value: feature.description.toLowerCase().replace(/\s+/g, '_'),
    label: feature.description
  }))



  const steps = [
    {
      title: 'Informações Gerais',
      className: 'w-full h-full flex flex-col gap-card md:gap-card-md',
      groups: [
        {
          className: 'w-full grid grid-cols-1 md:grid-cols-12 gap-card md:gap-card-md',
          fields: [
            {
              name: 'propertyTitle',
              label: 'Título',
              type: 'text',
              required: true,
              containerClassName: 'w-full md:col-span-6',
            },
            {
              name: 'displayEndDate',
              label: 'Data Término de Exibição',
              type: 'date',
              required: true,
              containerClassName: 'w-full md:col-span-3',
            },
            {
              name: 'active',
              label: 'Ativo',
              type: 'checkbox',
              placeholder: 'Propriedade ativa',
              containerClassName: 'w-full md:col-span-3',
            },
          ],
        },
        {
          className: 'w-full grid grid-cols-1 md:grid-cols-12 gap-card md:gap-card-md',
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
              containerClassName: 'w-full md:col-span-6',
            },
            {
              name: 'responsible',
              label: 'Responsável',
              type: 'select',
              options: responsibleOptions,
              required: true,
              containerClassName: 'w-full md:col-span-6',
            },
          ],
        },
      ],
    },
    {
      title: 'Descrição e Características',
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
              type: 'text',
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
      ],
    },
    {
      title: 'Diferenciais do Imóvel',
      className: 'w-full flex flex-col gap-card md:gap-card-md',
      groups: [
        {
          className: 'w-full',
          fields: [
            {
              name: 'differentials',
              label: 'Diferenciais',
              type: 'checkbox-group',
              options: featureOptions,
              containerClassName: 'w-full',
              groupClassName: 'grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4',
            },
          ],
        },
      ],
    },
    {
      title: 'Localização do Imóvel',
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
      title: 'Localização do Stand',
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
      title: 'Vídeo e Capa',
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
      title: 'Galeria de Imagens',
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
    <>
      <SectionView className="!min-h-[calc(100vh-80px)] !max-h-[calc(100vh-80px)] overflow-y-auto">
        <WizardFormView
          title={isNew ? 'Nova Propriedade' : 'Editar Propriedade'}
          steps={steps}
          initialData={initialData}
          onSubmit={(formData) => {
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

      {/* Alerta de erro flutuante */}
      <AlertView
        isVisible={alertError.isVisible}
        type="error"
        message={error || ''}
        onClose={alertError.hide}
        hasCloseButton={true}
      />
    </>
  )
}
