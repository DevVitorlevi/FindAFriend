import type { OrgsRepository } from "@/repositories/orgs-interface-repository.js";
import type { Org } from "generated/prisma/client.js";
import type { OrgCreateInput } from "generated/prisma/models.js";
import { randomUUID } from "node:crypto";

export class InMemoryOrgsRepository implements OrgsRepository {
  public database: Org[] = []
  async create(data: OrgCreateInput) {
    const org = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      address: data.address,
      whatsapp: data.whatsapp,
      city: data.city,
      create_at: new Date()
    }
    this.database.push(org)

    return org
  }
  async findByEmail(email: string) {
    const org = await this.database.find(org => org.email === email)

    if (!org) {
      return null
    }

    return org
  }

}