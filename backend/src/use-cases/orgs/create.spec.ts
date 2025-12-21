import { OrgAlreadyExits } from "@/utils/errors/org-already-exist.js"
import { InMemoryOrgsRepository } from "@/utils/test/in-memory/in-memory-orgs-repository.js"
import { beforeEach, describe, expect, it } from "vitest"
import { CreateOrgUseCase } from "./create.js"
import { compare } from "bcryptjs"

let orgsRepository: InMemoryOrgsRepository
let sut: CreateOrgUseCase

describe("Create Org Use Case", () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new CreateOrgUseCase(orgsRepository)
  })

  it("should be able to register org", async () => {
    const { org } = await sut.execute({
      name: "SEDEMA",
      email: "sedema@email.com",
      password: "123456",
      whatsapp: "(88)99999-9999",
      city: "Icapui - CE",
      latitude: -4.7086,
      longitude: -37.3564
    })

    expect(org.id).toEqual(expect.any(String))
    expect(org.name).toBe("SEDEMA")
  })

  it("should hash org password upon creation", async () => {
    const { org } = await sut.execute({
      name: "SEDEMA",
      email: "sedema@email.com",
      password: "123456",
      whatsapp: "(88)99999-9999",
      city: "Icapui - CE",
      latitude: -4.7086,
      longitude: -37.3564
    })

    const isPasswordCorrectlyHashed = await compare("123456", org.password_hash)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it("should not be able to register org with same email", async () => {
    const email = "sedema@email.com"

    await sut.execute({
      name: "SEDEMA",
      email,
      password: "123456",
      whatsapp: "(88)99999-9999",
      city: "Icapui - CE",
      latitude: -4.7086,
      longitude: -37.3564
    })

    await expect(
      sut.execute({
        name: "SEDEMA 2",
        email,
        password: "123456",
        whatsapp: "(88)99999-9999",
        city: "Icapui - CE",
        latitude: -4.7086,
        longitude: -37.3564
      })
    ).rejects.toBeInstanceOf(OrgAlreadyExits)
  })
})