import { prisma } from "@/lib/prisma.js";
import type { PetImage } from "@generated/prisma/browser.js";
import type { PetImageUncheckedCreateInput } from "@generated/prisma/models.js";
import type { PetImagesRepository } from "../pets-images-repository-interface.js";
import type {
  CreatePetImageInput,
  CreatePetImageOutput,
  DeletePetImageParams,
  FindByIdPetImageOutput,
  FindByIdPetImageParams,
  FindManyPetImageOutput,
  FindManyPetImageParams,
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

  async findManyByPetId({
    petId,
  }: FindManyPetImageParams): Promise<FindManyPetImageOutput[]> {
    const petImages = await prisma.petImage.findMany({
      where: {
        pet_id: petId,
      },
    });

    return petImages.map((image) => ({
      id: image.id,
      url: image.url,
      petId: image.pet_id,
      create_at: image.created_at,
    }));
  }
  async findById({
    petImageId,
  }: FindByIdPetImageParams): Promise<FindByIdPetImageOutput | null> {
    const image = await prisma.petImage.findUnique({
      where: { id: petImageId },
    });

    if (!image) return null;

    return {
      id: image.id,
      url: image.url,
      petId: image.pet_id,
      create_at: image.created_at,
    };
  }

  async delete({ petImageId }: DeletePetImageParams): Promise<void> {
    await prisma.petImage.delete({
      where: {
        id: petImageId,
      },
    });
  }
}
