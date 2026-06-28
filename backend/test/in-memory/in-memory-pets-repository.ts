import type { PetWithDetails } from "@/@types/pet-with-details.js";
import type {
  CreatePetInput,
  CreatePetOutput,
  FindManyByCityParams,
  FindPetByIdParams,
  ToggleAdoptedOutput,
  UpdatePetInput,
} from "@/repositories/DTOs/pet.dtos.js";
import type { PetsRepository } from "@/repositories/pets-repository-interface.js";
import type {
  Age,
  Org,
  Pet,
  PetImage,
  Prisma,
  Size,
} from "@generated/prisma/client.js";
import { randomUUID } from "node:crypto";
export class InMemoryPetsRepository implements PetsRepository {
  public database: Pet[] = [];

  constructor(
    private orgsRepository?: { database: Org[] },
    private petImagesRepository?: { items: PetImage[] },
  ) {}

  async create(orgId: string, data: CreatePetInput): Promise<CreatePetOutput> {
    const pet: Pet = {
      id: randomUUID(),
      name: data.name,
      description: data.description,
      age: data.age as Age,
      size: data.size as Size,
      adopted: false,
      org_id: orgId,
      created_at: new Date(),
    };

    this.database.push(pet);

    return pet;
  }

  async findById({ petId }: FindPetByIdParams): Promise<PetWithDetails | null> {
    const pet = this.database.find((item) => item.id === petId);

    if (!pet) {
      return null;
    }

    const org = this.orgsRepository?.database.find(
      (org) => org.id === pet.org_id,
    );

    if (!org) {
      return null;
    }

    const images =
      this.petImagesRepository?.items.filter(
        (image) => image.pet_id === pet.id,
      ) || [];

    return {
      ...pet,
      org,
      images,
    };
  }

  async findManyByCity(data: FindManyByCityParams): Promise<PetWithDetails[]> {
    const petsWithRelations = this.database
      .map((pet) => {
        const org = this.orgsRepository?.database.find(
          (org) => org.id === pet.org_id,
        );

        if (!org) return null;

        const images =
          this.petImagesRepository?.items.filter(
            (image) => image.pet_id === pet.id,
          ) || [];

        return {
          ...pet,
          org,
          images,
        };
      })
      .filter((pet): pet is PetWithDetails => pet !== null);

    const filteredPets = petsWithRelations.filter((petWithOrg) => {
      if (petWithOrg.org.state !== data.state) return false;
      if (petWithOrg.org.city !== data.city) return false;

      if (data.age && petWithOrg.age !== data.age) return false;
      if (data.size && petWithOrg.size !== data.size) return false;

      return true;
    });

    return filteredPets;
  }
  async toggleAdopted(petId: string): Promise<ToggleAdoptedOutput> {
    const petIndex = this.database.findIndex((pet) => pet.id === petId);

    if (petIndex < 0) {
      throw new Error("Pet not found");
    }

    this.database[petIndex].adopted = !this.database[petIndex].adopted;

    return this.database[petIndex];
  }

  async findManyOfOrg(
    orgId: string,
  ): Promise<(Pet & { org: Org; images: PetImage[] })[]> {
    return this.database
      .filter((pet) => pet.org_id === orgId)
      .map((pet) => {
        const org = this.orgsRepository?.database.find(
          (org) => org.id === pet.org_id,
        );

        if (!org) {
          throw new Error("Org not found for pet");
        }

        const images =
          this.petImagesRepository?.items.filter(
            (image) => image.pet_id === pet.id,
          ) ?? [];

        return {
          ...pet,
          org,
          images,
        };
      });
  }

  async delete(petId: string) {
    const petIndex = this.database.findIndex((pet) => pet.id === petId);

    if (petIndex >= 0) {
      this.database.splice(petIndex, 1);
    }
  }

  async update(petId: string, data: UpdatePetInput) {
    const pet = this.database.find((pet) => pet.id === petId);

    if (!pet) {
      throw new Error("Pet not found");
    }

    Object.assign(pet, {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.age !== undefined && { age: data.age }),
      ...(data.size !== undefined && { size: data.size }),
      updatedAt: new Date(),
    });

    return {
      pet: {
        id: pet.id,
        name: pet.name,
        description: pet.description,
        age: pet.age,
        size: pet.size,
        org_id: pet.org_id,
      },
    };
  }
}
