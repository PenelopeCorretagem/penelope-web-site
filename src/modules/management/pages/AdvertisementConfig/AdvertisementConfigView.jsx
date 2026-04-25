import { useState } from 'react'
import { WizardFormView } from '@shared/components/ui/WizardForm/WizardFormView'
import { SectionView } from '@shared/components/layout/Section/SectionView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { useAdvertisementConfigViewModel } from './useAdvertisementConfigViewModel'
import { useRouteParams } from '@app/routes/useRouterViewModel'
import { AlertView } from '@shared/components/feedback/Alert/AlertView'

export function AdvertisementConfigView() {
  const { id } = useRouteParams()
  const [showDisableConfirmation, setShowDisableConfirmation] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

  const {
    loading,
    initialData,
    submitting,
    isNew,
    usersWithCreci,
    loadingUsers,
    loadingAmenities,
    amenities,
    alertConfig,
    handleCloseAlert,
    handleSubmit,
    handleDisable,
    handleDelete,
    handleClear,
    handleCancel
  } = useAdvertisementConfigViewModel(id)
  
  // Só monta o formulário quando os usuários e amenities estiverem carregados
  if (loading || loadingUsers || loadingAmenities) {
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



  // Converter amenities em opções de checkbox
  const featureOptions = amenities.map(feature => ({
    value: feature.description.toLowerCase().replace(/\s+/g, '_'),
    label: feature.description,
    icon: feature.icon || 'Package'
  }))



  const steps = [
    {
      title: 'INFORMAÇÕES GERAIS',
      className: 'w-full h-full flex flex-col gap-card md:gap-card-md',
      groups: [
        {
          className: 'w-full grid grid-cols-1 md:grid-cols-12 gap-card md:gap-card-md',
          fields: [
            {
              name: 'advertisementTitle',
              label: 'TÍTULO',
              type: 'text',
              required: true,
              containerClassName: 'w-full md:col-span-6',
            },
            {
              name: 'displayEndDate',
              label: 'DATA TÉRMINO DE EXIBIÇÃO',
              type: 'date',
              required: true,
              containerClassName: 'w-full md:col-span-3',
            },
            {
              name: 'active',
              label: 'ATIVO',
              type: 'checkbox',
              placeholder: 'Propriedade ativa',
              containerClassName: 'w-full md:col-span-3',
            },
          ],
        },
        {
          className: 'w-full grid grid-cols-1 md:grid-cols-8 gap-card md:gap-card-md',
          fields: [
            {
              name: 'responsible',
              label: 'RESPONSÁVEL',
              type: 'select',
              options: responsibleOptions,
              required: true,
              containerClassName: 'w-full md:col-span-4',
            },
            {
              name: 'advertisementType',
              label: 'TIPO',
              type: 'select',
              options: [
                { value: '', label: 'Selecione o tipo' },
                { value: 'DISPONIVEL', label: 'Disponível' },
                { value: 'EM_OBRAS', label: 'Em Obras' },
                { value: 'LANCAMENTO', label: 'Lançamento' }
              ],
              required: true,
              containerClassName: 'w-full md:col-span-2',
            },
            {
              name: 'numberOfRooms',
              label: 'Nº QUARTOS',
              type: 'number',
              required: true,
              containerClassName: 'w-full',
            },
            {
              name: 'area',
              label: 'ÁREA (M²)',
              type: 'text',
              required: true,
              containerClassName: 'w-full',
            },
          ],
        },
        {
          className: 'w-full h-full flex-1',
          fields: [
            {
              name: 'advertisementDescription',
              label: 'DESCRITIVO DO IMÓVEL',
              type: 'textarea',
              className: 'w-full h-full flex-1',
              containerClassName: 'w-full h-full flex-1',
              rows: 5,
              required: true,
            },
          ],
        },
      ],
    },
    {
      title: 'DIFERENCIAIS DO IMÓVEL',
      className: 'w-full h-full flex flex-col gap-card md:gap-card-md',
      groups: [
        {
          className: 'w-full h-full overflow-hidden',
          fields: [
            {
              name: 'differentials',
              label: 'DIFERENCIAIS',
              type: 'differentials-grid',
              options: featureOptions,
              containerClassName: 'w-full h-full overflow-hidden',
            },
          ],
        },
      ],
    },
    {
      title: 'LOCALIZAÇÃO DO IMÓVEL',
      className: 'w-full flex flex-col gap-card md:gap-card-md',
      groups: [
        {
          className: 'w-full',
          fields: [
            {
              name: 'addressTitle',
              label: 'LOCALIZAÇÃO DO IMÓVEL',
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
              label: 'NÚMERO',
              type: 'text',
              required: true,
              containerClassName: 'w-full md:w-1/3',
            },
            {
              name: 'region',
              label: 'REGIÃO',
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
              label: 'RUA',
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
              label: 'BAIRRO',
              type: 'text',
              required: true,
              containerClassName: 'w-full md:w-1/3',
            },
            {
              name: 'city',
              label: 'CIDADE',
              type: 'text',
              required: true,
              containerClassName: 'w-full md:w-1/3',
            },
            {
              name: 'state',
              label: 'UF',
              type: 'select',
              size: 3,
              options: [
                { value: '', label: 'Selecione o estado' },
                { value: 'AC', label: 'AC' },
                { value: 'AL', label: 'AL' },
                { value: 'AP', label: 'AP' },
                { value: 'AM', label: 'AM' },
                { value: 'BA', label: 'BA' },
                { value: 'CE', label: 'CE' },
                { value: 'DF', label: 'DF' },
                { value: 'ES', label: 'ES' },
                { value: 'GO', label: 'GO' },
                { value: 'MA', label: 'MA' },
                { value: 'MT', label: 'MT' },
                { value: 'MS', label: 'MS' },
                { value: 'MG', label: 'MG' },
                { value: 'PA', label: 'PA' },
                { value: 'PB', label: 'PB' },
                { value: 'PR', label: 'PR' },
                { value: 'PE', label: 'PE' },
                { value: 'PI', label: 'PI' },
                { value: 'RJ', label: 'RJ' },
                { value: 'RN', label: 'RN' },
                { value: 'RS', label: 'RS' },
                { value: 'RO', label: 'RO' },
                { value: 'RR', label: 'RR' },
                { value: 'SC', label: 'SC' },
                { value: 'SP', label: 'SP' },
                { value: 'SE', label: 'SE' },
                { value: 'TO', label: 'TO' }
              ],
              required: true,
              containerClassName: 'w-full md:w-1/3',
            },
          ],
        },
      ],
    },
    {
      title: 'CAPA',
      className: 'w-full h-full flex flex-col gap-card md:gap-card-md',
      groups: [
        {
          className: 'w-full h-full flex-1 flex flex-col gap-card md:gap-card-md',
          fields: [
            {
              name: 'cover',
              label: 'CAPA',
              type: 'custom-cover-preview',
              accept: 'image/*',
              containerClassName: 'w-full h-full flex-1',
              className: 'w-full h-full flex-1',
            },
          ],
        },
      ],
    },
    {
      title: 'GALERIA E PLANTAS',
      className: 'w-full h-full flex flex-col gap-card md:gap-card-md',
      groups: [
        {
          className: 'w-full h-full flex-1 flex flex-col md:flex-row gap-card md:gap-card-md',
          fields: [
            {
              name: 'gallery',
              label: 'GALERIA',
              type: 'file',
              accept: 'image/*',
              multiple: true,
              containerClassName: 'w-full h-full flex-1 md:w-1/2',
              className: 'w-full h-full flex-1',
            },
            {
              name: 'floorPlans',
              label: 'PLANTAS',
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
    {
      title: 'VÍDEO',
      className: 'w-full flex flex-col gap-card md:gap-card-md',
      groups: [
        {
          className: 'w-full',
          fields: [
            {
              name: 'video',
              label: 'LINK DO VÍDEO (YOUTUBE)',
              type: 'text',
              placeholder: 'Ex: https://www.youtube.com/watch?v=...',
              containerClassName: 'w-full',
              className: 'w-full',
            },
          ],
        },
      ],
    },
  ]

  return (
    <>
      <SectionView className="h-full">
        <WizardFormView
          title={isNew ? 'Nova Propriedade' : 'Editar Propriedade'}
          steps={steps}
          initialData={initialData}
          onSubmit={(formData) => {
            return handleSubmit(formData)
          }}
          onDisable={!isNew ? () => setShowDisableConfirmation(true) : undefined}
          onDelete={!isNew ? () => setShowDeleteConfirmation(true) : undefined}
          onClear={handleClear}
          onCancel={handleCancel}
          disabled={submitting}
          key={id || 'new'}
        />
      </SectionView>

      {/* Alerta de erro flutuante */}
      <AlertView
        isVisible={!!alertConfig}
        type={alertConfig?.type}
        message={alertConfig?.message}
        onClose={handleCloseAlert}
        hasCloseButton={true}
      />

      <AlertView
        isVisible={showDisableConfirmation}
        type="warning"
        message="Tem certeza que deseja desabilitar esta propriedade? Ela não aparecerá mais no site."
        hasCloseButton={false}
        onClose={() => setShowDisableConfirmation(false)}
        buttonsLayout="col"
      >
        <div className="flex justify-center gap-card md:gap-card-md w-full">
          <ButtonView
            type="button"
            shape="square"
            color="border-distac-primary"
            onClick={() => setShowDisableConfirmation(false)}
            width="fit"
          >
            Cancelar
          </ButtonView>
          <ButtonView
            type="button"
            shape="square"
            color="pink"
            onClick={async () => {
              setShowDisableConfirmation(false)
              if (handleDisable) {
                await handleDisable()
              }
            }}
            width="fit"
            disabled={submitting}
          >
            {submitting ? 'Desabilitando...' : 'Desabilitar'}
          </ButtonView>
        </div>
      </AlertView>

      <AlertView
        isVisible={showDeleteConfirmation}
        type="warning"
        message="Tem certeza que deseja deletar esta propriedade permanentemente? Esta ação não poderá ser desfeita."
        hasCloseButton={false}
        onClose={() => setShowDeleteConfirmation(false)}
        buttonsLayout="col"
      >
        <div className="flex justify-center gap-card md:gap-card-md w-full">
          <ButtonView
            type="button"
            shape="square"
            color="border-distac-primary"
            onClick={() => setShowDeleteConfirmation(false)}
            width="fit"
          >
            Cancelar
          </ButtonView>
          <ButtonView
            type="button"
            shape="square"
            color="pink"
            onClick={async () => {
              setShowDeleteConfirmation(false)
              if (handleDelete) {
                await handleDelete()
              }
            }}
            width="fit"
            disabled={submitting}
          >
            {submitting ? 'Deletando...' : 'Deletar'}
          </ButtonView>
        </div>
      </AlertView>
    </>
  )
}
