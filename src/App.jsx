import { HomeView } from './institutional/view/pages/HomeView.jsx'
import { SearchFilter } from './shared/view/components/SearchFilter'

export function App() {
  return (
    <>
      <HomeView />
      <SearchFilter />
      <div className='px-section-x bg-surface-primary flex h-fit items-center justify-between py-6'>
        <p className='text-[32px] leading-snug font-semibold tracking-tight text-[#36221D] uppercase'>
          67 APARTAMENTOS EM SÃO PAULO COM 3 DORMITÓRIOS
        </p>
      </div>
      <div className='px-section-x bg-surface-primary flex h-fit items-center justify-between py-6'>
        <p className='text-brand-primary text-[24px] leading-snug font-semibold tracking-tight uppercase'>
          LANÇAMENTOS
        </p>
      </div>
      <div className='px-section-x bg-surface-primary flex h-fit items-center justify-start gap-6 py-6'>
        <div className='flex h-fit flex-col items-start justify-between shadow-2xl'>
          <img src='ape.png' alt='' />
          <div className='h-fit w-full bg-white p-4 py-6'>
            <p className='text-[22px] leading-snug font-semibold tracking-tight text-black uppercase'>
              NEXT GUARULHOS
            </p>
            <p className='text-brand-primary text-[18px] leading-snug font-semibold tracking-tight uppercase'>
              INTERLAGOS
            </p>
            <br />
            <p className='text-[16px] leading-snug tracking-tight text-black uppercase'>
              2 DORMITÓRIOS, COM OPÇÃO DE TERRAÇO
            </p>
            <div>
              <div className='inline-block rounded-md bg-gray-500 p-2 text-white'>
                GARAGEM
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
