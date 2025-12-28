import axios from 'axios'

const api = axios.create({
  baseURL: 'https://servicodados.ibge.gov.br/api/v1/localidades'
})

export interface Estado {
  id: number
  sigla: string
  nome: string
}

export interface Cidade {
  id: number
  nome: string
}

export async function getEstados(): Promise<Estado[]> {
  const response = await api.get<Estado[]>('/estados?orderBy=nome')
  return response.data
}

export async function getCidadesByEstado(estadoSigla: string): Promise<Cidade[]> {
  const response = await api.get<Cidade[]>(
    `/estados/${estadoSigla}/municipios?orderBy=nome`
  )
  return response.data
}