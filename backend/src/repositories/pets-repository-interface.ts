import type { Org, Pet, PetImage, Prisma } from "generated/prisma/client.js";

interface FindManyByCityParams {
  state: string
  city: string
  age?: string
  size?: string
}
export interface PetsRepository {
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
  findById(id: string): Promise<(Pet & {
    org: Org
    images: PetImage[]
  }) | null>
  findManyByCity(params: FindManyByCityParams): Promise<(Pet & { org: Org; images: PetImage[] })[]>
  adopted(petId: string): Promise<Pet>
}