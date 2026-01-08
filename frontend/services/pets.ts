import { petAPI } from "./api"

// Enums
export enum Age {
  FILHOTE = 'FILHOTE',
  ADULTO = 'ADULTO',
  IDOSO = 'IDOSO'
}

export enum Size {
  PEQUENO = 'PEQUENO',
  MEDIO = 'MEDIO',
  GRANDE = 'GRANDE'
}

// Interfaces
export interface PetImage {
  id: string
  url: string
  pet_id: string
  created_at: string
}

export interface Org {
  id: string
  name: string
  email: string
  whatsapp: string
  state: string
  city: string
  created_at: string
}

export interface Pet {
  id: string
  name: string
  description: string
  age: Age
  size: Size
  adopted: boolean
  created_at: string
  org_id: string
  org?: Org
  images?: PetImage[]
}

export interface SearchPetRequest {
  city?: string
  state?: string
  age?: Age
  size?: Size
  adopted?: boolean
}

export interface SearchPetResponse {
  pets: Pet[]
}

export interface GetPetsRequest {
  id: string
}

export interface GetPetsResponse {
  pets: Pet[]
}

export interface CreatePetRequest {
  name: string
  description: string
  age: Age
  size: Size
  orgId: string
}

export async function searchPet({ city, state }: SearchPetRequest): Promise<SearchPetResponse> {
  const { data } = await petAPI.get<SearchPetResponse>('/pets', {
    params: {
      city,
      state
    }
  })

  return data
}

export async function getPets(
  { id }: GetPetsRequest,
): Promise<GetPetsResponse> {
  try {
    const { data } = await petAPI.get<GetPetsResponse>(`/my/pets`, {
      params: { orgId: id }
    })
    return {
      pets: Array.isArray(data.pets) ? data.pets : []
    }
  } catch (error) {
    console.error('Erro ao buscar pets:', error)
    throw error
  }
}

export async function createPet({ orgId, ...data }: CreatePetRequest) {
  const response = await petAPI.post(`/pets/${orgId}/create`, data)

  return response.data
}
