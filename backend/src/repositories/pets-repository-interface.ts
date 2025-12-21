// repositories/pets-repository-interface.ts
import type { Age, Org, Pet, PetImage, Prisma, Size } from "generated/prisma/client.js";

interface FindManyByCityParams {
  state: string
  city: string
  age?: Age
  size?: Size
}

export interface PetsRepository {
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
  findById(id: string): Promise<(Pet & { org: Org; images: PetImage[] }) | null>
  findManyByCity(params: FindManyByCityParams): Promise<(Pet & { org: Org; images: PetImage[] })[]>
  toggleAdopted(petId: string): Promise<Pet>
}