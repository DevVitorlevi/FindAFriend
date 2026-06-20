import { PrismaPetsRepository } from "@/repositories/prisma/prisma-pets-repository.js";
import { DeletePetUseCase } from "@/use-cases/pets/delete.js";

export function makeDeletePetUseCase() {
  const prismaPetsRepository = new PrismaPetsRepository();
  const deletePetUseCase = new DeletePetUseCase(prismaPetsRepository);

  return deletePetUseCase;
}
