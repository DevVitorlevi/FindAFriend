import type { PetImagesRepository } from '@/repositories/pets-images-repository-interface.js'
import type { PetImage, Prisma } from 'generated/prisma/browser.js'
import { randomUUID } from 'node:crypto'

export class InMemoryPetImagesRepository implements PetImagesRepository {
  public items: PetImage[] = []

  async create(data: Prisma.PetImageUncheckedCreateInput): Promise<PetImage> {
    const image: PetImage = {
      id: data.id ?? randomUUID(),
      pet_id: data.pet_id,
      url: data.url,
      created_at: new Date(),
    }

    this.items.push(image)

    return image
  }

  async findManyByPetId(petId: string): Promise<PetImage[]> {
    const images = this.items.filter((image) => image.pet_id === petId)

    return images
  }

  async findById(id: string): Promise<PetImage | null> {
    const image = this.items.find((item) => item.id === id)

    return image || null
  }


  async delete(id: string): Promise<void> {
    const imageIndex = this.items.findIndex((image) => image.id === id)

    if (imageIndex >= 0) {
      this.items.splice(imageIndex, 1)
    }
  }
}