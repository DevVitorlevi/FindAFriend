import type { PetsRepository } from "@/repositories/pets-repository-interface.js";
import { ResourceNotFound } from "@/utils/errors/resource-not-found.js";
export class DeletePetUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute(petId: string) {
    const petExists = await this.petsRepository.findById({ petId });

    if (!petExists) {
      throw new ResourceNotFound();
    }

    await this.petsRepository.delete(petId);
  }
}
