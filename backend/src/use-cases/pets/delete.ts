import type { PetsRepository } from "@/repositories/pets-repository-interface.js";
import { ResourceNotFound } from "@/utils/errors/resource-not-found.js";

interface DeletePetRequest {
  petId: string;
}

export class DeletePetUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({ petId }: DeletePetRequest) {
    try {
      await this.petsRepository.delete(petId);
    } catch (error) {
      throw new ResourceNotFound();
    }
  }
}
