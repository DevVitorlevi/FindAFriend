import { PrismaPetsRepository } from "@/repositories/prisma/prisma-pets-repository.js";
import { FetchManyOrg } from "../pets/fetch-many-org.js";

export function makeFetchManyOrgUseCase() {
  const prismaPetsRepository = new PrismaPetsRepository()

  const fetchManyOrgUseCase = new FetchManyOrg(prismaPetsRepository)

  return fetchManyOrgUseCase
}