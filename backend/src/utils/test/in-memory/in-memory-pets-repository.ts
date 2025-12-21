import type { PetsRepository } from "@/repositories/pets-repository-interface.js";
import type { Pet } from "generated/prisma/browser.js";
import type { PetUncheckedCreateInput } from "generated/prisma/models.js";
import { randomUUID } from "node:crypto";

export class InMemoryPetsRepository implements PetsRepository {
  public database: Pet[] = []
  async create(data: PetUncheckedCreateInput) {
    const pet = {
      id: randomUUID(),
      name: data.name,
      description: data.description,
      age: data.age,
      size: data.size,
      org_id: data.org_id,
      create_at: new Date()
    }
    this.database.push(pet)

    return pet
  }
}