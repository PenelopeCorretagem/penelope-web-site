import { SectionView } from '@shared/components/layout/Section/SectionView'
import { PropertiesCarouselView } from '@domains/property/PropertiesCarousel/PropertiesCarouselView'
import { usePropertiesConfigViewModel } from './usePropertiesConfigViewModel'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { InputView } from '@shared/components/ui/Input/InputView'
import { SelectView } from '@shared/components/ui/Select/SelectView'
import { useHeaderHeight } from '@shared/hooks/useHeaderHeight'
import { ArrowUpAZ, ArrowDownAZ, ArrowUpDown, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useRouter } from '@app/routes/useRouterViewModel'

export function PropertiesConfigView() {
  const navigate = useNavigate()
  const { generateRoute } = useRouter()

  const {
    lancamentos,
    disponiveis,
    emObras,
    loading,
    error,
    searchTerm,
    regionFilter,
    cityFilter,
    typeFilter,
    sortOrder,
    availableCities,
    handleEdit,
    handleDelete,
    handleSearchChange,
    handleRegionFilterChange,
    handleCityFilterChange,
    handleTypeFilterChange,
    handleSortOrderChange
  } = usePropertiesConfigViewModel()

  const headerHeight = useHeaderHeight()

  const handleAddProperty = () => {
    try {
      const route = generateRoute('ADMIN_PROPERTIES_CONFIG', { id: 'new' })
      navigate(route)
    } catch (error) {
      console.error('Erro ao gerar rota:', error)
      // Fallback direto
      navigate('/admin/gerenciar-imoveis/new')
    }
  }

  const getSortIcon = () => {
    if (sortOrder === 'asc') return <ArrowUpAZ size={16} />
    if (sortOrder === 'desc') return <ArrowDownAZ size={16} />
    return <ArrowUpDown size={16} />
  }

  if (loading) {
    return (
      <div style={{ '--header-height': `${headerHeight}px` }}>
        <SectionView className="flex items-center justify-center min-h-[calc(100vh-var(--header-height))]">
          Carregando imóveis...
        </SectionView>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ '--header-height': `${headerHeight}px` }}>
        <SectionView className="flex items-center justify-center text-red-500 min-h-[calc(100vh-var(--header-height))]">
          {error}
        </SectionView>
      </div>
    )
  }

  return (
    <div style={{ '--header-height': `${headerHeight}px` }}>
      <SectionView className="flex flex-col !gap-section-col md:!gap-section-col-md">
        <div className="flex items-center w-full justify-between flex-shrink-0">
          <HeadingView level={2} className="text-distac-primary">
            Gerenciar Imóveis
          </HeadingView>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-card md:gap-card-md flex-shrink-0">
          <div className="flex flex-col md:flex-row gap-card md:gap-card-md">
            <div className="flex-1">
              <InputView
                type="text"
                placeholder="Buscar por título, cidade ou descrição..."
                value={searchTerm}
                onChange={handleSearchChange}
                hasLabel={false}
                isActive={true}
              />
            </div>
            <SelectView
              value={regionFilter}
              name="regionFilter"
              id="regionFilter"
              options={[
                { value: 'TODAS', label: 'Todas as Regiões' },
                { value: 'GRANDE_SP', label: 'Grande São Paulo' },
                { value: 'INTERIOR', label: 'Interior' },
                { value: 'LITORAL', label: 'Litoral' },
                { value: 'VALE_PARAIBA', label: 'Vale do Paraíba' }
              ]}
              width="fit"
              variant="brown"
              shape="square"
              hasLabel={false}
              onChange={(e) => handleRegionFilterChange(e.target.value)}
            />
            <SelectView
              value={cityFilter}
              name="cityFilter"
              id="cityFilter"
              options={[
                { value: 'TODAS', label: 'Todas as Cidades' },
                ...availableCities.map(city => ({
                  value: city,
                  label: city
                }))
              ]}
              width="fit"
              variant="brown"
              shape="square"
              hasLabel={false}
              onChange={(e) => handleCityFilterChange(e.target.value)}
            />
            <SelectView
              value={typeFilter}
              name="typeFilter"
              id="typeFilter"
              options={[
                { value: 'TODOS', label: 'Todos os Tipos' },
                { value: 'LANCAMENTOS', label: 'Lançamentos' },
                { value: 'DISPONIVEIS', label: 'Disponíveis' },
                { value: 'EM_OBRAS', label: 'Em Obras' }
              ]}
              width="fit"
              variant="brown"
              shape="square"
              hasLabel={false}
              onChange={(e) => handleTypeFilterChange(e.target.value)}
            />
            <div className="w-full md:w-fit">
              <ButtonView
                type="button"
                width="fit"
                color={sortOrder !== 'none' ? 'pink' : 'brown'}
                onClick={handleSortOrderChange}
                shape="square"
                title={sortOrder === 'asc' ? 'Ordenação crescente (A → Z)' : sortOrder === 'desc' ? 'Ordenação decrescente (Z → A)' : 'Sem ordenação'}
              >
                {getSortIcon()}
              </ButtonView>
            </div>
          </div>
        </div>

        {/* Properties Content */}
        <div className="flex flex-col gap-subsection md:gap-subsection-md h-fit flex-1">
          {lancamentos.length > 0 && (
            <PropertiesCarouselView
              properties={lancamentos}
              titleCarousel="Lançamentos"
              actionButtonText="Adicionar Imóvel"
              onActionClick={handleAddProperty}
              supportMode={true}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}

          {disponiveis.length > 0 && (
            <PropertiesCarouselView
              properties={disponiveis}
              titleCarousel="Disponíveis"
              actionButtonText="Adicionar Imóvel"
              onActionClick={handleAddProperty}
              supportMode={true}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}

          {emObras.length > 0 && (
            <PropertiesCarouselView
              properties={emObras}
              titleCarousel="Em Obras"
              actionButtonText="Adicionar Imóvel"
              onActionClick={handleAddProperty}
              supportMode={true}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}

          {lancamentos.length === 0 && disponiveis.length === 0 && emObras.length === 0 && (
            <div className="flex flex-col items-center justify-center text-default-dark-muted py-8 gap-4">
              <p>Nenhum imóvel encontrado com os filtros aplicados.</p>
              <ButtonView
                type="button"
                color="pink"
                onClick={handleAddProperty}
                shape="square"
              >
                <Plus size={16} />
                Adicionar Primeiro Imóvel
              </ButtonView>
            </div>
          )}
        </div>
      </SectionView>
    </div>
  )
}
