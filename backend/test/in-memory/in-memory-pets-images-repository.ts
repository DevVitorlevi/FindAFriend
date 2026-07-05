import type {
  CreatePetImageInput,
  CreatePetImageOutput,
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

  async findManyByPetId(petId: string): Promise<PetImage[]> {
    const images = this.items.filter((image) => image.pet_id === petId);

    return images;
  }

  async findById(id: string): Promise<PetImage | null> {
    const image = this.items.find((item) => item.id === id);

    return image || null;
  }

  async delete(id: string): Promise<void> {
    const imageIndex = this.items.findIndex((image) => image.id === id);

    if (imageIndex >= 0) {
      this.items.splice(imageIndex, 1);
    }
  }
}
