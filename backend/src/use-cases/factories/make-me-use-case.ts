import { PrismaOrgsRepository } from "@/repositories/prisma/prisma-orgs-repository.js";
import { MeUseCase } from "../orgs/me.js";

export function makeMeUseCase() {
  const prismaRepository = new PrismaOrgsRepository()
  const meUseCase = new MeUseCase(prismaRepository)

  return meUseCase
}