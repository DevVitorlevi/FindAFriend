import { PrismaOrgsRepository } from "@/repositories/prisma/prisma-orgs-repository.js";
import { CreateOrgUseCase } from "../orgs/create.js";

export function makeCreateOrgUseCase() {
  const prismaOrgsRepository = new PrismaOrgsRepository()
  const createOrgUseCase = new CreateOrgUseCase(prismaOrgsRepository)

  return createOrgUseCase
}