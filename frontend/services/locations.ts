import { ibgeAPI } from "./api"

export interface State {
  id: number
  sigla: string
  nome: string
}

export interface City {
  id: number
  nome: string
}

export const locationsService = {
  async getState(): Promise<State[]> {
    const { data } = await ibgeAPI.get('/estados?orderBy=nome')
    return data
  },

  async getCityByState(state: string): Promise<City[]> {
    const { data } = await ibgeAPI.get(`/estados/${state}/municipios?orderBy=nome`)
    return data
  }
}

export const getState = locationsService.getState
export const getCityByState = locationsService.getCityByState