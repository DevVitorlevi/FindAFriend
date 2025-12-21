import { PrismaPetsRepository } from "@/repositories/prisma/prisma-pets-repository.js";
import { FetchPetCityUseCase } from "../pets/fetch-pet-city.js";

export function makeFetchPetCityUseCase() {
  const prismaPetsRepository = new PrismaPetsRepository()

  const fetchPetCityUseCase = new FetchPetCityUseCase(prismaPetsRepository)

  return fetchPetCityUseCase
}