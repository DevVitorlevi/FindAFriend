import type { PetsRepository } from "@/repositories/pets-repository-interface.js"
import type { Org, Pet, PetImage } from "generated/prisma/browser.js"

interface FetchManyOrgRequest {
  orgId: string
}

interface FetchManyOrgResponse {
  pets: (Pet & {
    org: Org
    images: PetImage[]
  })[]
}

export class FetchManyOrg {
  constructor(private petsRepository: PetsRepository) { }

  async execute({
    orgId
  }: FetchManyOrgRequest): Promise<FetchManyOrgResponse> {
    const pets = await this.petsRepository.findManyOfOrg(orgId)

    return {
      pets,
    }
  }
}