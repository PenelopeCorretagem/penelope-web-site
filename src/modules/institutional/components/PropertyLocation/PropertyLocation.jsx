import { useState } from 'react'
import { Store, Building } from 'lucide-react'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView.jsx'
import { TextView } from '@shared/components/ui/Text/TextView.jsx'
import { ButtonView } from '@shared/components/ui/Button/ButtonView.jsx'

export function PropertyLocation({ locations, addresses = [], titles = [] }) {
  const [showMaps, setShowMaps] = useState({})

  const handleMapClick = (location, index) => {
    console.log('Exibir mapa para:', location)

    // Toggle map visibility for this specific location
    setShowMaps(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const generateMapUrl = (location, address) => {
    // Use address if available, otherwise use location title/subtitle
    const searchQuery = address || `${location.title} ${location.subtitle}`
    const encodedQuery = encodeURIComponent(searchQuery)
    return `https://www.google.com/maps?q=${encodedQuery}&output=embed`
  }

  return (
    <div>
      <HeadingView level={2} className="text-default-light mb-10">
        Localização
      </HeadingView>
      <div className={`grid gap-8 auto-rows-fr ${locations.length === 1 ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
        {locations.map((location, index) => (
          <div key={index} className="flex flex-col h-full gap-subsection md:gap-subsection-md justify-between">
            <div className="flex items-start gap-card md:gap-card-md">
              <div className="bg-default-light rounded-lg p-4">
                {index === 0 ? (
                  <Store size={40} className="text-distac-primary" />
                ) : (
                  <Building size={40} className="text-distac-primary" />
                )}
              </div>
              <div>
                {titles[index] && (
                  <HeadingView level={4} className="text-default-light mb-0">
                    {titles[index]}
                  </HeadingView>
                )}
                {addresses[index] && (
                  <TextView className="text-default-light font-medium text-lg mt-3">
                    {addresses[index]}
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
                  src={generateMapUrl(location, addresses[index])}
                  title={`Mapa de ${location.title}`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
