import type { OrgsRepository } from "@/repositories/orgs-repository-interface.js";
import { OrgAlreadyExits } from "@/utils/errors/org-already-exist.js";
import { hash } from "bcryptjs";
import type { Org } from "generated/prisma/client.js";

interface CreateOrgUseCaseRequest {
  name: string
  email: string
  password: string
  whatsapp: string
  cep: string
  street: string
  numberHome: number
  state: string
  city: string
  latitude: number
  longitude: number
}

interface CreateOrgUseCaseResponse {
  org: Org
}

export class CreateOrgUseCase {
  constructor(private orgsRepository: OrgsRepository) { }

  async execute({
    name,
    email,
    password,
    whatsapp,
    cep,
    street,
    numberHome,
    state,
    city,
    latitude,
    longitude
  }: CreateOrgUseCaseRequest): Promise<CreateOrgUseCaseResponse> {
    const orgWithSameEmail = await this.orgsRepository.findByEmail(email)

    if (orgWithSameEmail) {
      throw new OrgAlreadyExits()
    }

    const password_hash = await hash(password, 6)

    const org = await this.orgsRepository.create({
      name,
      email,
      password_hash,
      cep,
      street,
      number_home: numberHome,
      whatsapp,
      state,
      city,
      latitude,
      longitude
    })

    return { org }
  }
}