import type { PetImage, Prisma } from "generated/prisma/browser.js"


export interface PetImagesRepository {
  create(data: Prisma.PetImageUncheckedCreateInput): Promise<PetImage>
  findManyByPetId(petId: string): Promise<PetImage[]>
  findById(id: string): Promise<PetImage | null>
  delete(id: string): Promise<void>
}