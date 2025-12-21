import type { OrgsRepository } from "@/repositories/orgs-repository-interface.js"
import { InvalidCredentials } from "@/utils/errors/invalid-credentials.js"
import { compare } from "bcryptjs"
import type { Org } from "generated/prisma/browser.js"

interface LoginUseCaseRequest {
  email: string,
  password: string
}
interface LoginUseCaseResponse {
  org: Org
}

export class LoginUseCase {
  constructor(private orgsRepository: OrgsRepository) {
  }

  async execute({ email, password }: LoginUseCaseRequest): Promise<LoginUseCaseResponse> {
    const org = await this.orgsRepository.findByEmail(email)

    if (!org) {
      throw new InvalidCredentials()
    }

    const doesPasswordMarches = await compare(password, org.password_hash)

    if (!doesPasswordMarches) {
      throw new InvalidCredentials()
    }

    return {
      org
    }
  }
}