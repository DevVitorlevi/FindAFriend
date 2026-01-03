import axios from 'axios'

export const petAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333',
  withCredentials: true
})

export const ibgeAPI = axios.create({
  baseURL: 'https://servicodados.ibge.gov.br/api/v1/localidades'
})

petAPI.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        await petAPI.patch('/token/refresh')

        return petAPI(originalRequest)
      } catch (refreshError) {
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)