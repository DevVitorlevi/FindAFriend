import type {
  UpdatePetInput,
  UpdatePetOutput,
} from "@/repositories/DTOs/pet.dtos.js";
import type { PetsRepository } from "@/repositories/pets-repository-interface.js";
import { ResourceNotFound } from "@/utils/errors/resource-not-found.js";

export class UpdatePetUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute(petId: string, data: UpdatePetInput): Promise<UpdatePetOutput> {
    const petExists = await this.petsRepository.findById(petId);

    if (!petExists) {
      throw new ResourceNotFound();
    }

    const { pet } = await this.petsRepository.update(petId, data);

    return { pet };
  }
}
