import type { PetsRepository } from "@/repositories/pets-repository-interface.js"
import type { Age, Org, Pet, PetImage, Size } from "generated/prisma/browser.js"

interface FetchPetCityUseCaseRequest {
  state: string,
  city: string,
  age?: Age,
  size?: Size
}

interface FetchPetCityUseCaseResponse {
  pets: (Pet & {
    org: Org
    images: PetImage[]
  })[]
}

export class FetchPetCityUseCase {
  constructor(private petsRepository: PetsRepository) { }

  async execute({
    state,
    city,
    age,
    size
  }: FetchPetCityUseCaseRequest): Promise<FetchPetCityUseCaseResponse> {
    const pets = await this.petsRepository.findManyByCity({
      city,
      state,
      age,
      size
    })


    return {
      pets,
    }
  }
}