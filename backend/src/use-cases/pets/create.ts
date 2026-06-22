import type { OrgsRepository } from "@/repositories/orgs-repository-interface.js";
import type { PetsRepository } from "@/repositories/pets-repository-interface.js";
import { ResourceNotFound } from "@/utils/errors/resource-not-found.js";
import type { Age, Pet, Size } from "@generated/prisma/browser.js";

interface CreatePetUseCaseRequest {
  name: string;
  description: string;
  age: Age;
  size: Size;
  orgId: string;
}

interface CreatePetUseCaseResponse {
  pet: Pet;
}

export class CreatePetUseCase {
  constructor(
    private petsRepository: PetsRepository,
    private orgsRepository: OrgsRepository,
  ) {}

  async execute({
    name,
    description,
    age,
    size,
    orgId,
  }: CreatePetUseCaseRequest): Promise<CreatePetUseCaseResponse> {
    const org = await this.orgsRepository.me(orgId);

    if (!org) {
      throw new ResourceNotFound();
    }

    const pet = await this.petsRepository.create({
      name,
      description,
      age,
      size,
      org_id: orgId,
    });

    return { pet };
  }
}
