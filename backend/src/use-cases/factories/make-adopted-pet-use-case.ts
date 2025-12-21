
import { PrismaPetsRepository } from "@/repositories/prisma/prisma-pets-repository.js"
import { ToggleAdoptedUseCase } from "../pets/adopted.js"

export function makeToggleAdoptedUseCase() {
  const petsRepository = new PrismaPetsRepository()
  const useCase = new ToggleAdoptedUseCase(petsRepository)

  return useCase
}