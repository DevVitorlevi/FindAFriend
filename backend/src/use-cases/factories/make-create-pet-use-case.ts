import { PrismaPetsRepository } from "@/repositories/prisma/prisma-pets-repository.js";
import { CreatePetUseCase } from "../pets/create.js";
import { PrismaOrgsRepository } from "@/repositories/prisma/prisma-orgs-repository.js";

export function makeCreatePetUseCase() {
  const prismaPetsRepository = new PrismaPetsRepository();
  const prismaOrgsRepository = new PrismaOrgsRepository();

  const createPetUseCase = new CreatePetUseCase(
    prismaPetsRepository,
    prismaOrgsRepository,
  );
  return createPetUseCase;
}
