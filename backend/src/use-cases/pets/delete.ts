import type { PetsRepository } from "@/repositories/pets-repository-interface.js";
import { ResourceNotFound } from "@/utils/errors/resource-not-found.js";

interface DeletePetRequest {
  id: string;
}

export class DeletePetUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({ id }: DeletePetRequest) {
    try {
      await this.petsRepository.delete(id);
    } catch (error) {
      throw new ResourceNotFound();
    }
  }
}
