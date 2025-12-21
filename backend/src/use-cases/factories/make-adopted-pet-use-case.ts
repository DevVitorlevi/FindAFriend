import { PrismaPetsRepository } from "@/repositories/prisma/prisma-pets-repository.js";
import { AdoptedPetUseCase } from "../pets/adopted.js";

export function makeAdoptedPetUseCase() {
  const prismaPetsRepository = new PrismaPetsRepository()
  const adoptedPetUseCase = new AdoptedPetUseCase(prismaPetsRepository)

  return adoptedPetUseCase
}