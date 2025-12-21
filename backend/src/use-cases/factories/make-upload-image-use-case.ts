import { PrismaPetsImagesRepository } from "@/repositories/prisma/prisma-pets-images-repository.js";
import { PrismaPetsRepository } from "@/repositories/prisma/prisma-pets-repository.js";
import { UploadPetImagesUseCase } from "../pets/upload-images.js";

export function makeUploadImagesUseCase() {
  const prismaPetsRepository = new PrismaPetsRepository()
  const prismaPetsImagesRepository = new PrismaPetsImagesRepository()

  const uploadImagesUseCase = new UploadPetImagesUseCase(prismaPetsRepository, prismaPetsImagesRepository)

  return uploadImagesUseCase
}