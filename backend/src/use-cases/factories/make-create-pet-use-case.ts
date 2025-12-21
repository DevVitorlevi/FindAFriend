
import { PrismaPetsRepository } from "@/repositories/prisma/prisma-pets-repository.js";
import { CreatePetUseCase } from "../pets/create.js";

export function makeCreatePetUseCase() {
  const prismaPetsRepository = new PrismaPetsRepository()

  const createPetUseCase = new CreatePetUseCase(prismaPetsRepository)
  return createPetUseCase
}