export default function RecoveryLinkSentPopup({
  onNavigateToLogin,
  onResendEmail,
}) {
  return (
    <div className='flex h-full flex-col items-center justify-center p-8 text-center text-gray-800'>
      <h2 className='font-poppins text-4xl font-bold'>
        Você receberá em breve uma mensagem com as instruções para redefinir sua
        senha.
      </h2>

      <div className='mt-8 text-base'>
        <p>
          NÃO RECEBEU O E-MAIL?{' '}
          <span
            className='cursor-pointer font-semibold text-[#B33C8E] hover:underline'
            onClick={onResendEmail}
          >
            REENVIAR
          </span>
        </p>
        <p className='mt-4'>
          JÁ REDEFINIU A SENHA?{' '}
          <span
            className='cursor-pointer font-semibold text-[#B33C8E] hover:underline'
            onClick={onNavigateToLogin}
          >
            ACESSAR
          </span>
        </p>
      </div>
    </div>
  )
}
