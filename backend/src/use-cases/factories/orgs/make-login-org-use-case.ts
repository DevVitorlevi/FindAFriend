import { PrismaOrgsRepository } from "@/repositories/prisma/prisma-orgs-repository.js";
import { LoginUseCase } from "../orgs/login.js";

export function makeLoginOrgUseCase() {
  const prismaOrgsRepository = new PrismaOrgsRepository()
  const loginUseCase = new LoginUseCase(prismaOrgsRepository)

  return loginUseCase
}