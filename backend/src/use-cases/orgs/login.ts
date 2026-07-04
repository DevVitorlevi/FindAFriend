import type { OrgsRepository } from "@/repositories/orgs-repository-interface.js";
import { InvalidCredentials } from "@/utils/errors/invalid-credentials.js";
import { compare } from "bcryptjs";
import type {
  LoginOrgInput,
  LoginOrgOutput,
} from "@/repositories/DTOs/org.dtos.js";
export class LoginUseCase {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute(data: LoginOrgInput): Promise<LoginOrgOutput> {
    const org = await this.orgsRepository.findByEmail(data.email);

    if (!org) {
      throw new InvalidCredentials();
    }

    const doesPasswordMarches = await compare(data.password, org.password_hash);

    if (!doesPasswordMarches) {
      throw new InvalidCredentials();
    }

    return org;
  }
}
