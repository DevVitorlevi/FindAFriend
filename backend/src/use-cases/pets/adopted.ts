import type { ToggleAdoptedOutput } from "@/repositories/DTOs/pet.dtos.js";
import type { PetsRepository } from "@/repositories/pets-repository-interface.js";
import { ResourceNotFound } from "@/utils/errors/resource-not-found.js";

export class ToggleAdoptedUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute(petId: string): Promise<ToggleAdoptedOutput> {
    try {
      const pet = await this.petsRepository.toggleAdopted(petId);

      return pet;
    } catch (error) {
      throw new ResourceNotFound();
    }
  }
}
