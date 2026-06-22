import { PrismaPetsRepository } from "@/repositories/prisma/prisma-pets-repository.js";
import { UpdatePetUseCase } from "../pets/update.js";

export function makeUpdatePetUseCase() {
  const prismaPetsRepository = new PrismaPetsRepository();
  const updatePetUseCase = new UpdatePetUseCase(prismaPetsRepository);

  return updatePetUseCase;
}
