import { PrismaOrgsRepository } from "@/repositories/prisma/prisma-orgs-repository.js";
import { MeUseCase } from "@/use-cases/orgs/me.js";

export function makeMeUseCase() {
  const prismaRepository = new PrismaOrgsRepository();
  const meUseCase = new MeUseCase(prismaRepository);

  return meUseCase;
}
