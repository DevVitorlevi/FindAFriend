import { prisma } from "@/lib/prisma.js";
import type { PetImage } from "generated/prisma/browser.js";
import type { PetImageUncheckedCreateInput } from "generated/prisma/models.js";
import type { PetImagesRepository } from "../pets-images-repository-interface.js";

export class PrismaPetsImagesRepository implements PetImagesRepository {
  async create(data: PetImageUncheckedCreateInput): Promise<PetImage> {
    const petImage = await prisma.petImage.create({ data })
    return petImage
  }

  async findManyByPetId(petId: string): Promise<PetImage[]> {
    const petImages = await prisma.petImage.findMany({
      where: {
        pet_id: petId
      }
    })
    return petImages
  }

  async delete(id: string): Promise<void> {
    await prisma.petImage.delete({
      where: {
        id
      }
    })
  }

}