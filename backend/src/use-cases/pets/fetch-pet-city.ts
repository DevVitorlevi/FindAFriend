import type { PetWithDetails } from "@/@types/pet-with-details.js";
import type { FindManyByCityParams } from "@/repositories/DTOs/pet.dtos.js";
import type { PetsRepository } from "@/repositories/pets-repository-interface.js";
export class FetchPetCityUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute(data: FindManyByCityParams): Promise<PetWithDetails[]> {
    const pets = await this.petsRepository.findManyByCity(data);

    return pets;
  }
}
