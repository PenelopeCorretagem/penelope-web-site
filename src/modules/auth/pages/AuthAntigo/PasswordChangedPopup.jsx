import { useNavigate } from 'react-router-dom'
import { ButtonView as Botao } from '@shared/components/ui/Button/ButtonView'

export default function PasswordChangedPopup() {
  const navigate = useNavigate()

  const handleNavigateToLogin = () => {
    // A função de navegação agora é controlada aqui dentro
    navigate('/auth')
  }

  return (
    <div className='flex h-full flex-col items-center justify-center p-8 text-center text-gray-800'>
      <h2 className='font-poppins text-4xl font-bold'>
        Senha alterada com sucesso!
      </h2>
      <div className='mt-8'>
        <Botao variant='destac' onClick={handleNavigateToLogin}>
          IR PARA O LOGIN
        </Botao>
      </div>
    </div>
  )
}
