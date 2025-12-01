import { Store, Building } from 'lucide-react'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView.jsx'
import { TextView } from '@shared/components/ui/Text/TextView.jsx'

export function PropertyLocation({ address, type }) {
  const generateMapUrl = (address) => {
    // Use address if available, otherwise use location title/subtitle
    const searchQuery = address?.getFullAddress() || `${address.neighborhood} ${address.city} ${address.state}`
    const encodedQuery = encodeURIComponent(searchQuery)
    return `https://www.google.com/maps?q=${encodedQuery}&output=embed`
  }

  return (
    <div className="flex flex-col h-full gap-subsection md:gap-subsection-md justify-between">
      <div className="flex items-start gap-card md:gap-card-md">
        <div className="bg-default-light rounded-lg p-4">
          {type === 'stand' ? (
            <Store size={40} className="text-distac-primary" />
          ) : type === 'building' ? (
            <Building size={40} className="text-distac-primary" />
          ) : null}
        </div>
        <div>
          {type === 'stand' ? (
            <HeadingView level={4} className="text-default-light mb-0">
              Stand de Vendas
            </HeadingView>
          ) : type === 'building' ? (
            <HeadingView level={4} className="text-default-light mb-0">
              Empreendiento
            </HeadingView>
          ) : null}
          {address && (
          <TextView className="text-default-light font-medium text-lg mt-3">
            {address.getFullAddress()}
          </TextView>
          )}
        </div>
      </div>
      <div className="flex-grow">
        <HeadingView level={6} className="text-default-light !font-bold mb-4">
          Veja como chegar:
        </HeadingView>
        <div className="w-full h-full flex flex-col">
          <iframe
            width="100%"
            height="300"
            style={{ border: 0, borderRadius: '8px' }}
            loading="lazy"
            allowFullScreen
            src={generateMapUrl(address)}
            title={`Mapa de ${address.getFullAddress()}`}
          />
        </div>
      </div>
    </div>
  )
}
