import type { PetsRepository } from "@/repositories/pets-repository-interface.js";
import type { Age, Org, Pet, PetImage, Prisma, Size } from "generated/prisma/client.js";
import { randomUUID } from "node:crypto";

interface FindManyByCityParams {
  state: string
  city: string
  age?: Age
  size?: Size
}

export class InMemoryPetsRepository implements PetsRepository {
  public database: Pet[] = []

  constructor(
    private orgsRepository?: { database: Org[] },
    private petImagesRepository?: { items: PetImage[] }
  ) { }

  async toggleAdopted(petId: string): Promise<Pet> {
    const petIndex = this.database.findIndex(pet => pet.id === petId)

    if (petIndex < 0) {
      throw new Error('Pet not found')
    }

    // inverte o valor (true → false, false → true)
    this.database[petIndex].adopted = !this.database[petIndex].adopted

    return this.database[petIndex]
  }

  async create(data: Prisma.PetUncheckedCreateInput): Promise<Pet> {
    const pet: Pet = {
      id: data.id ?? randomUUID(),
      name: data.name,
      description: data.description,
      age: data.age as Age,
      size: data.size as Size,
      adopted: data.adopted ?? false,
      org_id: data.org_id,
      created_at: new Date()
    }

    this.database.push(pet)

    return pet
  }

  async findById(id: string): Promise<(Pet & {
    org: Org
    images: PetImage[]
  }) | null> {
    const pet = this.database.find((item) => item.id === id)

    if (!pet) {
      return null
    }

    const org = this.orgsRepository?.database.find((org) => org.id === pet.org_id)

    if (!org) {
      return null
    }

    const images = this.petImagesRepository?.items.filter(
      (image) => image.pet_id === pet.id
    ) || []

    return {
      ...pet,
      org,
      images
    }
  }

  async findManyByCity({
    state,
    city,
    age,
    size,
  }: FindManyByCityParams): Promise<(Pet & { org: Org; images: PetImage[] })[]> {
    const petsWithRelations = this.database
      .map((pet) => {
        const org = this.orgsRepository?.database.find(
          (org) => org.id === pet.org_id
        )

        if (!org) return null

        const images = this.petImagesRepository?.items.filter(
          (image) => image.pet_id === pet.id
        ) || []

        return {
          ...pet,
          org,
          images,
        }
      })
      .filter((pet): pet is Pet & { org: Org; images: PetImage[] } => pet !== null)

    const filteredPets = petsWithRelations.filter((petWithOrg) => {
      if (petWithOrg.org.state !== state) return false
      if (petWithOrg.org.city !== city) return false

      if (age && petWithOrg.age !== age) return false
      if (size && petWithOrg.size !== size) return false

      return true
    })

    return filteredPets
  }

  async findManyOfOrg(
    orgId: string
  ): Promise<(Pet & { org: Org; images: PetImage[] })[]> {
    return this.database
      .filter((pet) => pet.org_id === orgId)
      .map((pet) => {
        const org = this.orgsRepository?.database.find(
          (org) => org.id === pet.org_id
        )

        if (!org) {
          throw new Error('Org not found for pet')
        }

        const images =
          this.petImagesRepository?.items.filter(
            (image) => image.pet_id === pet.id
          ) ?? []

        return {
          ...pet,
          org,
          images,
        }
      })
  }
}