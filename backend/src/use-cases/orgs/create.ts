import type { OrgsRepository } from "@/repositories/orgs-interface-repository.js";
import { OrgAlreadyExits } from "@/utils/errors/org-already-exist.js";
import { hash } from "bcryptjs";
import type { Org } from "generated/prisma/client.js";

interface CreateOrgUseCaseRequest {
  name: string,
  email: string,
  password: string,
  address: string,
  whatsapp: string,
  city: string
}
interface CreateOrgUseCaseResponse {
  org: Org

}
export class CreateOrgUseCase {
  constructor(private orgsRepository: OrgsRepository) { }

  async execute({ name, email, password, address, whatsapp, city }: CreateOrgUseCaseRequest): Promise<CreateOrgUseCaseResponse> {
    const orgWithSameEmail = await this.orgsRepository.findByEmail(email)

    if (orgWithSameEmail) {
      throw new OrgAlreadyExits()
    }

    const password_hash = await hash(password, 6)

    const org = await this.orgsRepository.create({
      name,
      email,
      password_hash,
      address,
      whatsapp,
      city
    })

    return { org }
  }
}