import axios from 'axios'

export const petAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333',
})

export const ibgeAPI = axios.create({
  baseURL: 'https://servicodados.ibge.gov.br/api/v1/localidades'
})