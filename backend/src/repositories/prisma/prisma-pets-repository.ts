import { prisma } from "@/lib/prisma.js";
import type {
  Age,
  Org,
  Pet,
  PetImage,
  Size,
} from "@generated/prisma/client.js";
import type { PetsRepository } from "../pets-repository-interface.js";
import type {
  CreatePetInput,
  CreatePetOutput,
  FindManyByCityParams,
  FindPetByIdParams,
  ToggleAdoptedOutput,
  UpdatePetInput,
  UpdatePetOutput,
} from "../DTOs/pet.dtos.js";
import type { PetWithDetails } from "@/@types/pet-with-details.js";

export class PrismaPetsRepository implements PetsRepository {
  async create(orgId: string, data: CreatePetInput): Promise<CreatePetOutput> {
    const pet = await prisma.pet.create({
      data: {
        name: data.name,
        description: data.description,
        age: data.age,
        size: data.size,
        org_id: orgId,
      },
    });

    return pet;
  }

  async findById({ petId }: FindPetByIdParams): Promise<PetWithDetails | null> {
    const pet = await prisma.pet.findUnique({
      where: { id: petId },
      include: {
        org: true,
        images: true,
      },
    });
    return pet;
  }

  async findManyByCity({
    state,
    city,
    age,
    size,
  }: FindManyByCityParams): Promise<PetWithDetails[]> {
    const pets = await prisma.pet.findMany({
      where: {
        org: { city, state },
        ...(age && { age }),
        ...(size && { size }),
      },
      include: {
        org: true,
        images: true,
      },
    });
    return pets;
  }

  async toggleAdopted(petId: string): Promise<ToggleAdoptedOutput> {
    const currentPet = await prisma.pet.findUnique({
      where: { id: petId },
      select: { adopted: true },
    });

    if (!currentPet) {
      throw new Error("Pet not found");
    }

    const pet = await prisma.pet.update({
      where: { id: petId },
      data: {
        adopted: !currentPet.adopted,
      },
    });

    return pet;
  }

  async findManyOfOrg(
    orgId: string,
  ): Promise<(Pet & { org: Org; images: PetImage[] })[]> {
    const pets = await prisma.pet.findMany({
      where: {
        org_id: orgId,
      },
      include: {
        org: true,
        images: true,
      },
    });
    return pets;
  }

  async delete(petId: string) {
    await prisma.pet.delete({
      where: {
        id: petId,
      },
    });
  }

  async update(petId: string, data: UpdatePetInput) {
    const pet = await prisma.pet.update({ where: { id: petId }, data });

    return pet;
  }
}
