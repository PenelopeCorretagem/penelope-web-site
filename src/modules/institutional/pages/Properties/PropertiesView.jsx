import { useState, useEffect } from 'react'
import { SectionView } from '@shared/components/layout/Section/SectionView'
import { PropertiesCarouselView } from '@domains/property/PropertiesCarousel/PropertiesCarouselView'
import { SearchFilterView } from '@shared/components/ui/SearchFilter/SearchFilterView'
import { ResultTitleView } from '@institutional/components/ResultTitle/ResultTitleView'

export function PropertiesView() {
  const [headerHeight, setHeaderHeight] = useState(0)

  const [pendingFilters, setPendingFilters] = useState({
    city: '',
    region: '',
    type: '',
    bedrooms: '',
  })

  const [appliedFilters, setAppliedFilters] = useState({})

  const updatePendingFilter = (key, value) => {
    setPendingFilters(prev => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    setAppliedFilters({ ...pendingFilters })
  }

  const fakeRequest = [
    {
      title: 'Guarulhos',
      subtitle: 'Interlagos',
      description: '2 dormitórios com opção de terraço',
      bedrooms: 2,
      category: 'lancamento',
      differences: ['2 vagas', '1 suíte', '48m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    },
    {
      title: 'São Paulo',
      subtitle: 'Vila Mariana',
      description: '3 dormitórios com varanda gourmet',
      bedrooms: 3,
      category: 'lancamento',
      differences: ['2 vagas', '1 suíte', '48m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    },
    {
      title: 'Rio de Janeiro',
      subtitle: 'Copacabana',
      description: '1 dormitório com vista para o mar',
      bedrooms: 1,
      category: 'lancamento',
      differences: ['1 vaga', '1 suíte', '38m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    },
    {
      title: 'Guarulhos',
      subtitle: 'Interlagos',
      description: '2 dormitórios com opção de terraço',
      bedrooms: 2,
      category: 'lancamento',
      differences: ['2 vagas', '1 suíte', '48m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    }
  ]
  const fakeRequest2 = [
    {
      title: 'São Paulo',
      subtitle: 'Vila Mariana',
      description: '3 dormitórios com varanda gourmet',
      bedrooms: 3,
      category: 'disponivel',
      differences: ['2 vagas', '1 suíte', '48m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    },
    {
      title: 'Rio de Janeiro',
      subtitle: 'Copacabana',
      description: '1 dormitório com vista para o mar',
      bedrooms: 1,
      category: 'disponivel',
      differences: ['1 vaga', '1 suíte', '38m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    },
    {
      title: 'Guarulhos',
      subtitle: 'Interlagos',
      description: '2 dormitórios com opção de terraço',
      bedrooms: 2,
      category: 'disponivel',
      differences: ['2 vagas', '1 suíte', '48m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    },
    {
      title: 'São Paulo',
      subtitle: 'Vila Mariana',
      description: '3 dormitórios com varanda gourmet',
      bedrooms: 3,
      category: 'disponivel',
      differences: ['2 vagas', '1 suíte', '48m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    }
  ]
  const fakeRequest3 = [
    {
      title: 'Rio de Janeiro',
      subtitle: 'Copacabana',
      description: '1 dormitório com vista para o mar',
      bedrooms: 1,
      category: 'em_obras',
      differences: ['1 vaga', '1 suíte', '38m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    },
    {
      title: 'Guarulhos',
      subtitle: 'Interlagos',
      description: '2 dormitórios com opção de terraço',
      bedrooms: 2,
      category: 'em_obras',
      differences: ['2 vagas', '1 suíte', '48m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    },
    {
      title: 'São Paulo',
      subtitle: 'Vila Mariana',
      description: '3 dormitórios com varanda gourmet',
      bedrooms: 3,
      category: 'em_obras',
      differences: ['2 vagas', '1 suíte', '48m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    },
    {
      title: 'Rio de Janeiro',
      subtitle: 'Copacabana',
      bedrooms: 1,
      description: '1 dormitório com vista para o mar',
      category: 'em_obras',
      differences: ['1 vaga', '1 suíte', '38m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    },
  ]

  const gatherOptions = (lists) => {
    const cities = new Set()
    const regions = new Set()
    const types = new Set()
    const bedrooms = new Set()

    lists.forEach(list => {
      list.forEach(p => {
        if (p.title) cities.add(p.title)
        if (p.subtitle) regions.add(p.subtitle)
        if (p.category) types.add(p.category)
        const desc = p.description || ''
        const dormMatch = desc.match(/(\d+)\s*dormi/i)
        if (p.bedrooms) {
          const n = Number(p.bedrooms)
          const label = `${n} Dormitório${n > 1 ? 's' : ''}`
          bedrooms.add(label)
        } else if (dormMatch) {
          const n = parseInt(dormMatch[1], 10)
          const label = `${n} Dormitório${n > 1 ? 's' : ''}`
          bedrooms.add(label)
        } else if (Array.isArray(p.differences)) {
          p.differences.forEach(d => {
            const m = d.match(/(\d+)\s*dormi/i)
            if (m) {
              const n = parseInt(m[1], 10)
              const label = `${n} Dormitório${n > 1 ? 's' : ''}`
              bedrooms.add(label)
            }
          })
        }
      })
    })

    return {
      cities: Array.from(cities),
      regions: Array.from(regions),
      types: Array.from(types),
      bedrooms: Array.from(bedrooms),
    }
  }

  const options = gatherOptions([fakeRequest, fakeRequest2, fakeRequest3])

  const optionsWithPlaceholders = {
    cities: [{ label: 'Cidade', value: '' }, ...options.cities],
    regions: [{ label: 'Região', value: '' }, ...options.regions],
    types: [{ label: 'Estagio da Obra', value: '' }, ...options.types],
    bedrooms: [{ label: 'Dormitórios', value: '' }, ...options.bedrooms],
  }

  const filterPredicate = (p) => (
    (Object.keys(appliedFilters).length === 0 ? true : (
      (appliedFilters.city ? p.title === appliedFilters.city : true) &&
      (appliedFilters.region ? p.subtitle === appliedFilters.region : true) &&
      (appliedFilters.type ? p.category === appliedFilters.type : true) &&
      (appliedFilters.bedrooms ? (
        (() => {
          const m = String(appliedFilters.bedrooms).match(/(\d+)/)
          if (!m) return true
          const n = Number(m[1])
          return p.bedrooms ? p.bedrooms === n : (
            Array.isArray(p.differences) ? p.differences.some(d => d.includes(`${n}`)) : true
          )
        })()
      ) : true)
    ))
  )

  const filtered1 = fakeRequest.filter(filterPredicate)
  const filtered2 = fakeRequest2.filter(filterPredicate)
  const filtered3 = fakeRequest3.filter(filterPredicate)

  const totalResults = filtered1.length + filtered2.length + filtered3.length

  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.querySelector('header')
      if (header) {
        setHeaderHeight(header.offsetHeight - 1)
      }
    }

    updateHeaderHeight()
    window.addEventListener('resize', updateHeaderHeight)

    return () => window.removeEventListener('resize', updateHeaderHeight)
  }, [])

  return (
    <>
      <div
        className="sticky z-40 bg-default-light shadow-md"
        style={{ top: `${headerHeight}px` }}
      >
        <SearchFilterView
          filters={pendingFilters}
          updateFilter={updatePendingFilter}
          handleSearch={() => { /* opcional: acionar busca global */ }}
          onApply={applyFilters}
          options={optionsWithPlaceholders}
        />
      </div>
      <ResultTitleView
        results={totalResults}
        filters={appliedFilters}
      />
      {filtered1.length > 0 && (
        <SectionView>
          <PropertiesCarouselView
            properties={filtered1}
            titleCarousel="Lançamentos"
          />
        </SectionView>
      )}
      {filtered2.length > 0 && (
        <SectionView className="bg-default-light-alt">
          <PropertiesCarouselView
            properties={filtered2}
            titleCarousel="Disponível"
          />
        </SectionView>
      )}
      {filtered3.length > 0 && (
        <SectionView>
          <PropertiesCarouselView
            properties={filtered3}
            titleCarousel="Em Obras"
          />
        </SectionView>
      )}
    </>
  )
}
