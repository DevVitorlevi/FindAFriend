import type { PetsRepository } from "@/repositories/pets-repository-interface.js"
import type { Pet } from "generated/prisma/browser.js"

interface AdoptedPetUseCaseRequest {
  petId: string,
}

interface AdoptedPetUseCaseResponse {
  pet: Pet
}

export class AdoptedPetUseCase {
  constructor(private petsRepository: PetsRepository) { }

  async execute({
    petId,
  }: AdoptedPetUseCaseRequest): Promise<AdoptedPetUseCaseResponse> {
    const pet = await this.petsRepository.adopted(petId)
    return {
      pet,
    }
  }
}