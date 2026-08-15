export interface State {
  id: number;
  sigla: string;
  nome: string;
}

export interface City {
  id: number;
  nome: string;
}

const CEARA_STATE: State = {
  id: 23,
  sigla: "CE",
  nome: "Ceará",
};

const CEARA_CITIES: City[] = [
  { id: 2304202, nome: "Fortaleza" },
  { id: 2306025, nome: "Icapuí" },
  { id: 2311199, nome: "Russas" },
];

export const locationsService = {
  async getState(): Promise<State[]> {
    return [CEARA_STATE];
  },

  async getCityByState(state: string): Promise<City[]> {
    if (state !== CEARA_STATE.sigla) return [];
    return CEARA_CITIES;
  },
};

export const getState = locationsService.getState;
export const getCityByState = locationsService.getCityByState;
