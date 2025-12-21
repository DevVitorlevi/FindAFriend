import type { Org, Pet, PetImage, Prisma } from "generated/prisma/client.js";

export interface PetsRepository {
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
  findById(id: string): Promise<(Pet & {
    org: Org
    images: PetImage[]
  }) | null>
}