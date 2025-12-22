import { PrismaPetsImagesRepository } from "@/repositories/prisma/prisma-pets-images-repository.js";
import { DeletePetImageUseCase } from "../pets/delete-pet-image.js";

export function makeDeleteImageUseCase() {
  const prismaPetsImagesRepository = new PrismaPetsImagesRepository()

  const deleteImageUseCase = new DeletePetImageUseCase(prismaPetsImagesRepository)

  return deleteImageUseCase
}