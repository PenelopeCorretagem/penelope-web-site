import ContactImage from '../../assets/ContactImage.jpg'

export function CardImageView({ descriptionImage }) {
  return (
    <div className='flex flex-col items-start gap-1.5'>
      <div className='relative z-0 w-fit rounded-md bg-gradient-to-b from-[#B33C8E] to-[#36221D] p-4 shadow-lg'>
        <img
          src={ContactImage}
          alt='Casal feliz'
          className='border-brand-primary relative z-10 block transform-[translate(-34px,32px)] rounded-sm border-3 shadow-lg'
        />
      </div>
      <p className='font-default-family text-text-primary mt-2 text-sm'>
        {descriptionImage}
      </p>
    </div>
  )
}
