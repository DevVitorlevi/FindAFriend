import { prisma } from "@/lib/prisma.js";
import type { PetImage } from "@generated/prisma/browser.js";
import type { PetImageUncheckedCreateInput } from "@generated/prisma/models.js";
import type { PetImagesRepository } from "../pets-images-repository-interface.js";
import type {
  CreatePetImageInput,
  CreatePetImageOutput,
} from "../DTOs/pet-image.js";

export class PrismaPetsImagesRepository implements PetImagesRepository {
  async create(data: CreatePetImageInput): Promise<CreatePetImageOutput> {
    const petImage = await prisma.petImage.create({
      data: {
        id: data.id,
        url: data.url,
        pet_id: data.petId,
      },
    });
    return {
      id: petImage.id,
      url: petImage.url,
      petId: petImage.pet_id,
      create_at: petImage.created_at,
    };
  }

  async findManyByPetId(petId: string): Promise<PetImage[]> {
    const petImages = await prisma.petImage.findMany({
      where: {
        pet_id: petId,
      },
    });
    return petImages;
  }
  async findById(id: string): Promise<PetImage | null> {
    const image = await prisma.petImage.findUnique({
      where: { id },
    });

    return image;
  }

  async delete(id: string): Promise<void> {
    await prisma.petImage.delete({
      where: {
        id,
      },
    });
  }
}
