import axiosInstance from '@api/axios/axiosInstance'

const PENELOPEC_API_BASE_URL = import.meta.env.PENELOPEC_URL

export const sendContactMessage = async (contactData) => {
  const response = await axiosInstance.post('/contact-us', contactData, {
    baseURL: PENELOPEC_API_BASE_URL,
  })
  return response.data
}
