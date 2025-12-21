import { prisma } from "@/lib/prisma.js";
import type { Org } from "generated/prisma/client.js";
import type { OrgCreateInput } from "generated/prisma/models.js";
import type { OrgsRepository } from "../orgs-repository-interface.js";

export class PrismaOrgsRepository implements OrgsRepository {
  async findByEmail(email: string): Promise<Org | null> {
    const org = await prisma.org.findUnique({
      where: {
        email
      }
    })

    return org
  }
  async create(data: OrgCreateInput) {
    const org = await prisma.org.create({ data })

    return org
  }

}