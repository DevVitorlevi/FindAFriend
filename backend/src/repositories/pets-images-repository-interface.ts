import type { PetImage, Prisma } from "generated/prisma/browser.js"


export interface PetImagesRepository {
  create(data: Prisma.PetImageUncheckedCreateInput): Promise<PetImage>
  findManyByPetId(petId: string): Promise<PetImage[]>
  delete(id: string): Promise<void>
}