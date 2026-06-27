import type { PetWithDetails } from "@/@types/pet-with-details.js";
import type {
  FindPetByIdOutput,
  FindPetByIdParams,
} from "@/repositories/DTOs/pet.dtos.js";
import type { PetsRepository } from "@/repositories/pets-repository-interface.js";
import { ResourceNotFound } from "@/utils/errors/resource-not-found.js";
import type { Org, Pet, PetImage } from "@generated/prisma/browser.js";

export class GetPetDetailsUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({ petId }: FindPetByIdParams): Promise<PetWithDetails> {
    const pet = await this.petsRepository.findById({ petId });

    if (!pet) {
      throw new ResourceNotFound();
    }

    return pet;
  }
}
