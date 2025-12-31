import type { OrgsRepository } from "@/repositories/orgs-repository-interface.js";
import type { Org } from "generated/prisma/client.js";
import { Prisma } from "generated/prisma/client.js";
import { randomUUID } from "node:crypto";

export class InMemoryOrgsRepository implements OrgsRepository {
  public database: Org[] = []

  async create(data: Prisma.OrgCreateInput) {
    const org: Org = {
      id: data.id ?? randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      whatsapp: data.whatsapp,
      state: data.state,
      city: data.city,
      created_at: new Date()
    }
    this.database.push(org)

    return org
  }

  async findByEmail(email: string) {
    const org = this.database.find(org => org.email === email)

    if (!org) {
      return null
    }

    return org
  }
}