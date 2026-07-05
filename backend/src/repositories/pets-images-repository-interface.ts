import type { PetImage, Prisma } from "@generated/prisma/browser.js";
import type {
  CreatePetImageInput,
  CreatePetImageOutput,
} from "./DTOs/pet-image.js";

export interface PetImagesRepository {
  create(data: CreatePetImageInput): Promise<CreatePetImageOutput>;
  findManyByPetId(petId: string): Promise<PetImage[]>;
  findById(id: string): Promise<PetImage | null>;
  delete(id: string): Promise<void>;
}
