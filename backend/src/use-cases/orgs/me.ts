import type { MeOrgOutput, MeOrgParams } from "@/repositories/DTOs/org.dtos.js";
import type { OrgsRepository } from "@/repositories/orgs-repository-interface.js";
import { ResourceNotFound } from "@/utils/errors/resource-not-found.js";
import type { Org } from "@generated/prisma/browser.js";
export class MeUseCase {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute({ id }: MeOrgParams): Promise<MeOrgOutput> {
    const org = await this.orgsRepository.me({ id });

    if (!org) {
      throw new ResourceNotFound();
    }

    return org;
  }
}
