import type { PetsRepository } from "@/repositories/pets-repository-interface.js"
import { ResourceNotFound } from "@/utils/errors/resource-not-found.js"
import type { Org, Pet, PetImage } from "generated/prisma/browser.js"

interface GetPetDetailsUseCaseRequest {
  petId: string
}

interface GetPetDetailsUseCaseResponse {
  pet: Pet & {
    org: Org
    images: PetImage[]
  }
}

export class GetPetDetailsUseCase {
  constructor(private petsRepository: PetsRepository) { }

  async execute({
    petId,
  }: GetPetDetailsUseCaseRequest): Promise<GetPetDetailsUseCaseResponse> {
    const pet = await this.petsRepository.findById(petId)

    if (!pet) {
      throw new ResourceNotFound()
    }

    return {
      pet,
    }
  }
}