import type { PetsRepository } from "@/repositories/pets-repository-interface.js";
import type { Org, Pet, PetImage, Prisma } from "generated/prisma/client.js";
import { randomUUID } from "node:crypto";

export class InMemoryPetsRepository implements PetsRepository {
  public database: Pet[] = []

  // ← Recebe o repositório de ORGs para poder fazer o findById com a org incluída
  constructor(private orgsRepository?: { database: Org[] },
    private petImagesRepository?: { items: PetImage[] }
  ) { }

  async create(data: Prisma.PetUncheckedCreateInput): Promise<Pet> {
    const pet: Pet = {
      id: data.id ?? randomUUID(),
      name: data.name,
      description: data.description,
      age: data.age as any,
      size: data.size as any,
      org_id: data.org_id,
      create_at: new Date()
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
    const images = this.petImagesRepository?.items.filter(
      (image) => image.pet_id === pet.id
    ) || []
    // Retorna o pet com a org incluída (igual o Prisma faz)
    return {
      ...pet,
      org,
      images
    }
  }
}