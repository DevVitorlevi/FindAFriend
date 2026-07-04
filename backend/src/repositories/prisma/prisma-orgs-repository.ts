import { prisma } from "@/lib/prisma.js";
import type { Org } from "@generated/prisma/client.js";
import type { OrgCreateInput } from "@generated/prisma/models.js";
import type { OrgsRepository } from "../orgs-repository-interface.js";
import type { CreateOrgInput } from "../DTOs/org.dtos.js";

export class PrismaOrgsRepository implements OrgsRepository {
  async findByEmail(email: string): Promise<Org | null> {
    const org = await prisma.org.findUnique({
      where: {
        email,
      },
    });

    return org;
  }
  async create(data: CreateOrgInput) {
    const org = await prisma.org.create({
      data: {
        name: data.name,
        email: data.email,
        whatsapp: data.whatsapp,
        password_hash: data.password,
        state: data.state,
        city: data.city,
      },
    });

    return org;
  }

  async me(id: string) {
    const org = await prisma.org.findUnique({
      where: {
        id,
      },
    });

    if (!org) {
      return null;
    }

    return org;
  }
}
