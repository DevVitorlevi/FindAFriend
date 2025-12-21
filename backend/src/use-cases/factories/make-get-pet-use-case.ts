import { PrismaPetsRepository } from "@/repositories/prisma/prisma-pets-repository.js";
import { GetPetDetailsUseCase } from "../pets/get-pet.js";

export function makeGetPetUseCase() {
  const prismaPetsRepository = new PrismaPetsRepository()

  const getPetUseCase = new GetPetDetailsUseCase(prismaPetsRepository)

  return getPetUseCase
}