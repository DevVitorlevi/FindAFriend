import { OrgAlreadyExits } from "@/utils/errors/org-already-exist.js"
import { compare } from "bcryptjs"
import { InMemoryOrgsRepository } from "test/in-memory/in-memory-orgs-repository.js"
import { beforeEach, describe, expect, it } from "vitest"
import { CreateOrgUseCase } from "../../src/use-cases/orgs/create.js"

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
      state: "CE",
      city: "Icapui",
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
      state: "CE",
      city: "Icapui",
    })

    const isPasswordCorrectlyHashed = await compare("123456", org.password_hash)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it("should not be able to register org with same email", async () => {
    const email = "sedema@email.com"

    await sut.execute({
      name: "SEDEMA",
      email: "sedema@email.com",
      password: "123456",
      whatsapp: "(88)99999-9999",
      state: "CE",
      city: "Icapui",
    })

    await expect(
      sut.execute({
        name: "SEDEMA",
        email: "sedema@email.com",
        password: "123456",
        whatsapp: "(88)99999-9999",
        state: "CE",
        city: "Icapui",
      })
    ).rejects.toBeInstanceOf(OrgAlreadyExits)
  })
})