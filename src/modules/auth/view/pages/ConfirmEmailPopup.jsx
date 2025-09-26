export default function ConfirmEmailPopup({
  onNavigateToLogin,
  onResendEmail,
}) {
  return (
    <div className='flex h-full flex-col items-center justify-center p-8 text-center text-gray-800'>
      {/* Mensagem principal de sucesso */}
      <h2 className='font-poppins text-4xl font-bold'>
        Enviamos um e-mail de confirmação, por favor, valide seu cadastro!
      </h2>

      {/* Ações para o usuário */}
      <div className='mt-8 text-base'>
        <p>
          NÃO RECEBEU O E-MAIL?{' '}
          <span
            className='cursor-pointer font-semibold text-[#B33C8E] hover:underline'
            onClick={onResendEmail} // Aciona a função de reenviar
          >
            REENVIAR
          </span>
        </p>
        <p className='mt-4'>
          JÁ CONFIRMOU?{' '}
          <span
            className='cursor-pointer font-semibold text-[#B33C8E] hover:underline'
            onClick={onNavigateToLogin} // Leva o usuário para a tela de login
          >
            ACESSAR
          </span>
        </p>
      </div>
    </div>
  )
}
