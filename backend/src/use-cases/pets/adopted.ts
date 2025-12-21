import type { PetsRepository } from "@/repositories/pets-repository-interface.js"
import { ResourceNotFound } from "@/utils/errors/resource-not-found.js"
import type { Pet } from "generated/prisma/client.js"

interface ToggleAdoptedUseCaseRequest {
  petId: string
}

interface ToggleAdoptedUseCaseResponse {
  pet: Pet
}

export class ToggleAdoptedUseCase {
  constructor(private petsRepository: PetsRepository) { }

  async execute({
    petId,
  }: ToggleAdoptedUseCaseRequest): Promise<ToggleAdoptedUseCaseResponse> {
    try {
      const pet = await this.petsRepository.toggleAdopted(petId)

      return { pet }
    } catch (error) {
      throw new ResourceNotFound()
    }
  }
}