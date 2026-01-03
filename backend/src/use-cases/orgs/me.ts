import type { OrgsRepository } from "@/repositories/orgs-repository-interface.js";
import { ResourceNotFound } from "@/utils/errors/resource-not-found.js";
import type { Org } from "generated/prisma/browser.js";

interface MeUseCaseRequest {
  id: string
}

interface MeUseCaseResponse {
  org: Org
}
export class MeUseCase {
  constructor(private orgsRepository: OrgsRepository) { }

  async execute({ id }: MeUseCaseRequest): Promise<MeUseCaseResponse> {
    const org = await this.orgsRepository.me(id)

    if (!org) {
      throw new ResourceNotFound()
    }

    return { org }
  }
}