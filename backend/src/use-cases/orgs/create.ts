import type {
  CreateOrgInput,
  CreateOrgOutput,
} from "@/repositories/DTOs/org.dtos.js";
import type { OrgsRepository } from "@/repositories/orgs-repository-interface.js";
import { OrgAlreadyExits } from "@/utils/errors/org-already-exist.js";
import { hash } from "bcryptjs";
export class CreateOrgUseCase {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute({
    name,
    email,
    password,
    whatsapp,
    state,
    city,
  }: CreateOrgInput): Promise<CreateOrgOutput> {
    const orgWithSameEmail = await this.orgsRepository.findByEmail(email);

    if (orgWithSameEmail) {
      throw new OrgAlreadyExits();
    }

    const password_hash = await hash(password, 6);

    const org = await this.orgsRepository.create({
      name,
      email,
      password: password_hash,
      whatsapp,
      state,
      city,
    });

    return org;
  }
}
