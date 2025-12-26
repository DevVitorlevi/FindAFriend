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

    // Toggle: inverte o valor (true → false, false → true)
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

    // Busca a ONG relacionada ao pet
    const org = this.orgsRepository?.database.find((org) => org.id === pet.org_id)

    if (!org) {
      return null
    }

    // Busca as imagens do pet
    const images = this.petImagesRepository?.items.filter(
      (image) => image.pet_id === pet.id
    ) || []

    // Retorna o pet com a org e images incluídas
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
    // Mapeia cada pet com sua org e imagens
    const petsWithRelations = this.database
      .map((pet) => {
        // Busca a ONG do pet
        const org = this.orgsRepository?.database.find(
          (org) => org.id === pet.org_id
        )

        // Se não encontrar a ONG, ignora esse pet
        if (!org) return null

        // Busca as imagens do pet
        const images = this.petImagesRepository?.items.filter(
          (image) => image.pet_id === pet.id
        ) || []

        return {
          ...pet,
          org,
          images,
        }
      })
      // Remove pets que não têm ONG (nulls)
      .filter((pet): pet is Pet & { org: Org; images: PetImage[] } => pet !== null)

    // Filtra pelos critérios
    const filteredPets = petsWithRelations.filter((petWithOrg) => {
      // Filtros obrigatórios: state e city
      if (petWithOrg.org.state !== state) return false
      if (petWithOrg.org.city !== city) return false

      // Filtros opcionais
      if (age && petWithOrg.age !== age) return false
      if (size && petWithOrg.size !== size) return false

      return true
    })

    return filteredPets
  }
}