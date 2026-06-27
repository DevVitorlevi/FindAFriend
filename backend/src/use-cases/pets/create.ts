import type {
  CreatePetInput,
  CreatePetOutput,
  CreatePetParams,
} from "@/repositories/DTOs/pet.dtos.js";
import type { OrgsRepository } from "@/repositories/orgs-repository-interface.js";
import type { PetsRepository } from "@/repositories/pets-repository-interface.js";
import { ResourceNotFound } from "@/utils/errors/resource-not-found.js";

export class CreatePetUseCase {
  constructor(
    private petsRepository: PetsRepository,
    private orgsRepository: OrgsRepository,
  ) {}

  async execute(
    params: CreatePetParams,
    data: CreatePetInput,
  ): Promise<CreatePetOutput> {
    const org = await this.orgsRepository.me(params.orgId);

    if (!org) throw new ResourceNotFound();

    const pet = await this.petsRepository.create(params.orgId, data);

    return pet;
  }
}
