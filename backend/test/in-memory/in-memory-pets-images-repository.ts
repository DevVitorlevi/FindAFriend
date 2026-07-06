import type {
  CreatePetImageInput,
  CreatePetImageOutput,
  DeletePetImageParams,
  FindByIdPetImageOutput,
  FindByIdPetImageParams,
  FindManyPetImageOutput,
  FindManyPetImageParams,
} from "@/repositories/DTOs/pet-image.js";
import type { PetImagesRepository } from "@/repositories/pets-images-repository-interface.js";
import type { PetImage, Prisma } from "@generated/prisma/browser.js";
import { randomUUID } from "node:crypto";

export class InMemoryPetImagesRepository implements PetImagesRepository {
  public items: PetImage[] = [];

  async create(data: CreatePetImageInput): Promise<CreatePetImageOutput> {
    const image: PetImage = {
      id: randomUUID(),
      pet_id: data.petId,
      url: data.url,
      created_at: new Date(),
    };

    this.items.push(image);

    return {
      id: image.id,
      url: image.url,
      petId: image.pet_id,
      create_at: image.created_at,
    };
  }

  async findManyByPetId({
    petId,
  }: FindManyPetImageParams): Promise<FindManyPetImageOutput[]> {
    const images = this.items
      .filter((image) => image.pet_id === petId)
      .map((image) => ({
        id: image.id,
        url: image.url,
        petId: image.pet_id,
        create_at: image.created_at,
      }));

    return images;
  }

  async findById({
    petImageId,
  }: FindByIdPetImageParams): Promise<FindByIdPetImageOutput | null> {
    const image = this.items.find((item) => item.id === petImageId);

    if (!image) return null;

    return {
      id: image.id,
      url: image.url,
      petId: image.pet_id,
      create_at: image.created_at,
    };
  }

  async delete({ petImageId }: DeletePetImageParams): Promise<void> {
    const imageIndex = this.items.findIndex((image) => image.id === petImageId);

    if (imageIndex >= 0) {
      this.items.splice(imageIndex, 1);
    }
  }
}
